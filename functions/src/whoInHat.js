/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const moment = require('moment');
const constants = require('./constants');
const common = require('./common');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.createGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (!data.skippingRule || !constants.whoInHatSkipping[data.skippingRule]) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid skipping rule');
        }

        if (!data.timePerRound) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid time per round');
        }

        if (data.name && data.name.length > 32) {
            throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 32 characters');
        }

        return db.collection('users').doc(context.auth.uid).get().then(response => {
            const { displayName } = response.data();
            return db.collection('games').where('name', '==', data.name).get().then(
                docs => {
                    if (docs.size > 0) {
                        throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                    }
                    return db.collection('games').add({
                        activeTeam: '',
                        activeExplainer: '',
                        currentPlayers: [context.auth.uid],
                        currentWordIndex: 0,
                        hasStarted: false,
                        host: context.auth.uid,
                        isCustomNames: Boolean(data.isCustomNames),
                        mode: constants.gameModes.WhosInTheHat,
                        name: data.name,
                        playersReady: [],
                        round: null,
                        scoreCap: data.isCustomNames ? null : Math.min(data.scoreCap, 50),
                        skippingRule: data.skippingRule,
                        teams: constants.initialTeams,
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        },
                        wordsGuessed: [],
                        skippedWords: [],
                        trashedWords: [],
                        words: [],
                        timePerRound: Math.min(Number(data.timePerRound), 120),
                        waitingToJoinTeam: []
                    });
                }
            );
        });
    });

exports.editGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!data.skippingRule || !constants.whoInHatSkipping[data.skippingRule]) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid skipping rule');
            }
            if (!data.timePerRound) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid time per round');
            }
            return doc.ref.update({
                isCustomNames: Boolean(data.isCustomNames),
                skippingRule: data.skippingRule,
                scoreCap: data.isCustomNames ? null : data.scoreCap,
                timePerRound: Math.min(Number(data.timePerRound), 120)
            });
        });
    });

exports.startGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (doc.data().host !== context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the host');
            }

            if (doc.data().playersReady.length !== doc.data().currentPlayers.length) {
                throw new functions.https.HttpsError('invalid-argument', 'Not everybody is ready');
            }

            const { isCustomNames } = doc.data();

            return doc.ref.update({
                hasStarted: true,
                round: 1,
                status: constants.whoInHatGameStatuses.MakingTeams,
                words: isCustomNames ? [] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z']
            });
        });
    });


exports.start = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const playersNotInTeams = common.findPlayersNotInTeam(doc.data());


            if (playersNotInTeams && playersNotInTeams.length > 0) {
                throw new functions.https.HttpsError('invalid-argument', 'There are some players not in a team');
            }

            const { words, teams } = doc.data();

            const remainingTeams = fp.shuffle(teams.filter(team => team.members.length > 0));

            const firstTeamName = fp.first(remainingTeams).name;
            const firstExplainer = fp.first(fp.first(remainingTeams).members);

            return doc.ref.update({
                activeTeam: firstTeamName,
                activeExplainer: firstExplainer,
                words: fp.shuffle(words),
                teams: remainingTeams.map(team => (team.name === firstTeamName ? {
                    ...team,
                    previousExplainer: firstExplainer
                } : team)),
                status: constants.whoInHatGameStatuses.PrepareToGuess,
                waitingToJoinTeam: []
            });
        });
    });

exports.startRound = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const { activeExplainer, timePerRound } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            return doc.ref.update({
                finishTime: moment().add(timePerRound, 'seconds').format(),
                round: operations.increment(1),
                status: constants.whoInHatGameStatuses.Guessing
            });
        });
    });


exports.addWord = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!data.word) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid word');
            }

            return doc.ref.update({
                words: doc.data().words.some(x => x.toLowerCase() === data.word.toLowerCase())
                    ? doc.data().words : operations.arrayUnion(data.word)
            });
        });
    });

exports.confirmScore = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!data.confirmedWords) {
                throw new functions.https.HttpsError('not-found', 'Something wrong with confirmed words. Contact Matt');
            }

            const { confirmedWords } = data;

            const {
                activeTeam, teams, words, isCustomNames, scoreCap
            } = doc.data();

            const nextTeam = common.findNextTeam(activeTeam, teams);
            const nextExplainer = common.findNextExplainerInTeam(nextTeam);

            const newScore = teams.find(team => team.name === activeTeam).score + confirmedWords.length;

            const scoreCapReached = !isCustomNames && newScore >= scoreCap;

            const newWords = words.filter(x => !confirmedWords.includes(x));

            let nextGameStatus = constants.whoInHatGameStatuses.PrepareToGuess;
            let winningTeam = null;

            const newTeamScores = teams.map(team => {
                if (team.name === nextTeam.name) {
                    return {
                        ...team,
                        previousExplainer: nextExplainer,
                        score: team.name === activeTeam ? team.score + confirmedWords.length : team.score
                    };
                }
                if (team.name === activeTeam) {
                    return {
                        ...team,
                        score: team.score + confirmedWords.length
                    };
                }
                return team;
            });

            if (newWords.length === 0) {
                nextGameStatus = constants.whoInHatGameStatuses.NoCardsLeft;
                winningTeam = fp.get('name')(newTeamScores.reduce((acc, cur) => (acc.score > cur.score ? acc : cur)));
            } else if (scoreCapReached) {
                nextGameStatus = constants.whoInHatGameStatuses.ScoreCapReached;
                winningTeam = activeTeam;
            }

            return doc.ref.update({
                activeTeam: nextGameStatus === constants.whoInHatGameStatuses.PrepareToGuess ? nextTeam.name : null, // If PrepareToGuess, game has not finished
                activeExplainer: nextGameStatus === constants.whoInHatGameStatuses.PrepareToGuess ? nextExplainer : null, // If PrepareToGuess, game has not finished,
                status: nextGameStatus,
                confirmedWords: [],
                confirmedTrashed: [],
                confirmedSkipped: [],
                currentWordIndex: 0,
                trashedWords: [],
                skippedWords: [],
                teams: newTeamScores,
                winningTeam: nextGameStatus !== constants.whoInHatGameStatuses.PrepareToGuess ? winningTeam : null, // If not PrepareToGuess, game has finished
                wordsGuessed: [],
                words: fp.shuffle(newWords)
            });
        });
    });

exports.loadSummary = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (doc.data().status !== constants.whoInHatGameStatuses.Guessing) {
                return Promise.resolve();
            }

            const {
                wordsGuessed, trashedWords, skippedWords, words, currentWordIndex
            } = doc.data();

            const endingWord = words[currentWordIndex];


            return doc.ref.update({
                currentWordIndex: 0,
                status: constants.whoInHatGameStatuses.RoundSummary,
                confirmedWords: wordsGuessed,
                confirmedTrashed: endingWord ? trashedWords.concat(endingWord) : trashedWords,
                confirmedSkipped: skippedWords,
                words: words.filter(word => word !== endingWord),
                trashedWords: endingWord ? [...trashedWords, endingWord] : trashedWords
            });
        });
    });
