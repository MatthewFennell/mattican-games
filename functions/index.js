/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const firestore = require('@google-cloud/firestore');
const moment = require('moment');
const constants = require('./src/constants');
const common = require('./src/common');

const client = new firestore.v1.FirestoreAdminClient();
const bucket = 'gs://learning-backups';

const config = functions.config();

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.auth = require('./src/auth');
exports.avalon = require('./src/avalon');
exports.profile = require('./src/profile');
exports.hitler = require('./src/hitler');

const operations = admin.firestore.FieldValue;
// currently at v8.13.0 for node

// // https://firebase.google.com/docs/reference/js/firebase.functions.html#functionserrorcod

exports.destroyGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found');
            }
            if (doc.data().host === context.auth.uid) {
                return doc.ref.delete();
            }
            return Promise.resolve();
        });
    });

exports.leaveGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (doc.data().currentPlayers && doc.data().currentPlayers.length <= 1) {
                return doc.ref.delete();
            }
            if (doc.data().host === context.auth.uid && doc.data().currentPlayers && doc.data().currentPlayers.length > 1) {
                return doc.ref.update({
                    host: doc.data().currentPlayers.find(x => x !== context.auth.uid),
                    playersReady: operations.arrayRemove(context.auth.uid),
                    currentPlayers: operations.arrayRemove(context.auth.uid)
                });
            }
            if (doc.data().hasStarted) {
                if (doc.data().status !== constants.avalonGameStatuses.Finished) {
                    throw new functions.https.HttpsError('invalid-argument', 'That game has not finished yet');
                }
            }
            return doc.ref.update({
                playersReady: operations.arrayRemove(context.auth.uid),
                currentPlayers: operations.arrayRemove(context.auth.uid)
            });
        });
    });

exports.readyUp = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (data.isReady) {
                return doc.ref.update({
                    playersReady: operations.arrayUnion(context.auth.uid)
                });
            }
            return doc.ref.update({
                playersReady: operations.arrayRemove(context.auth.uid)
            });
        });
    });

exports.leaveMidgame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (doc.data().status === constants.avalonGameStatuses.Finished || !doc.data().hasStarted) {
                if (doc.data().currentPlayers.length === 1) {
                    return doc.ref.delete();
                }

                return doc.ref.update({
                    currentPlayers: operations.arrayRemove(context.auth.uid),
                    host: doc.data().currentPlayers.find(x => x !== context.auth.uid)
                });
            }

            if (doc.data().requestToEndGame) {
                throw new functions.https.HttpsError('invalid-argument', 'Somebody else is already trying to end the game');
            }

            return doc.ref.update({
                requestToEndGame: context.auth.uid,
                approveLeaveMidgame: operations.arrayUnion(context.auth.uid)
            });
        });
    });

exports.approveLeaveMidgame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!doc.data().requestToEndGame) {
                throw new functions.https.HttpsError('invalid-argument', 'Nobody is trying to end the game');
            }

            if (doc.data().approveLeaveMidgame.includes(context.auth.uid) || doc.data().rejectLeaveMidgame.includes(context.auth.uid)) {
                throw new functions.https.HttpsError('invalid-argument', 'You have already voted');
            }

            if (data.isApprove) {
                if (doc.data().approveLeaveMidgame.length >= 2) {
                    return doc.ref.delete();
                }
                return doc.ref.update({
                    approveLeaveMidgame: operations.arrayUnion(context.auth.uid)
                });
            }

            if (doc.data().rejectLeaveMidgame.length >= 2) {
                return doc.ref.update({
                    approveLeaveMidgame: [],
                    rejectLeaveMidgame: [],
                    requestToEndGame: ''
                });
            }

            return doc.ref.update({
                rejectLeaveMidgame: operations.arrayUnion(context.auth.uid)
            });
        });
    });

exports.joinGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found');
            }
            if (doc.data().currentPlayers.length === doc.data().numberOfPlayers) {
                throw new functions.https.HttpsError('invalid-argument', 'That game is full');
            }
            if (doc.data().hasStarted) {
                throw new functions.https.HttpsError('invalid-argument', 'That game has already started');
            }

            return db.collection('users').doc(context.auth.uid).get().then(response => {
                const { displayName } = response.data();
                if (!displayName) {
                    throw new functions.https.HttpsError('invalid-argument', 'Please set a display name before joining');
                }
                return doc.ref.update({
                    currentPlayers: operations.arrayUnion(context.auth.uid),
                    usernameMappings: {
                        ...doc.data().usernameMappings,
                        [context.auth.uid]: displayName
                    }
                });
            });
        });
    });

exports.editDisplayName = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!data.displayName) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid display name');
            }
            if (data.displayName.length > 12) {
                throw new functions.https.HttpsError('invalid-argument', 'Too long. Max length of 12');
            }

            const batch = db.batch();
            const userRef = db.collection('users').doc(context.auth.uid);
            batch.update(userRef, { displayName: data.displayName });
            const newMappings = fp.set(context.auth.uid, data.displayName)(doc.data().usernameMappings);
            batch.update(doc.ref, { usernameMappings: newMappings });
            batch.commit();
        });
    });


exports.createWhoInHatGame = functions
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

exports.editGameWhoInHat = functions
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

exports.startWhoInHatGame = functions
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

exports.addTeam = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!data.teamName) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid team name');
            }

            if (data.teamName.length > 20) {
                throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 20 characters');
            }

            const currentTeamNames = doc.data().teams.map(team => team.name);

            if (currentTeamNames.includes(data.teamName)) {
                throw new functions.https.HttpsError('invalid-argument', 'There is already a team with that name');
            }

            return doc.ref.update({
                teams: operations.arrayUnion({
                    name: data.teamName,
                    members: [],
                    score: 0,
                    previousExplainer: null
                })
            });
        });
    });


exports.joinTeam = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!data.teamName) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid team name');
            }

            const currentTeamNames = doc.data().teams.map(team => team.name);

            if (!currentTeamNames.includes(data.teamName)) {
                throw new functions.https.HttpsError('invalid-argument', 'There is no team with that name');
            }

            return doc.ref.update({
                teams: doc.data().teams.map(team => (team.name === data.teamName ? {
                    ...team,
                    members: lodash.union([...team.members, context.auth.uid])
                } : {
                    ...team,
                    members: team.members.filter(x => x !== context.auth.uid)
                }))
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

const playerExistsInTeam = (game, playerId) => game.teams
    .some(team => team.members.includes(playerId));

const findPlayersNotInTeam = game => game.currentPlayers
    .filter(playerId => !playerExistsInTeam(game, playerId));

exports.startWhoInHat = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const playersNotInTeams = findPlayersNotInTeam(doc.data());

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

exports.startWhoInHatRound = functions
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
                status: constants.whoInHatGameStatuses.Guessing
            });
        });
    });

exports.gotWord = functions
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

            const { activeExplainer } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            return doc.ref.update({
                currentWordIndex: operations.increment(1),
                wordsGuessed: operations.arrayUnion(data.word)
            });
        });
    });

exports.skipWord = functions
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

            const { activeExplainer, currentWordIndex, skippingRule } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            return doc.ref.update({
                currentWordIndex: skippingRule === constants.whoInHatSkipping.OneSkip ? currentWordIndex : operations.increment(1),
                skippedWords: operations.arrayUnion(data.word)
            });
        });
    });


exports.trashWord = functions
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

            const { activeExplainer } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            return doc.ref.update({
                currentWordIndex: operations.increment(1),
                trashedWords: operations.arrayUnion(data.word)
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

            const { wordsGuessed, trashedWords, skippedWords } = doc.data();

            return doc.ref.update({
                currentWordIndex: 0,
                status: constants.whoInHatGameStatuses.RoundSummary,
                confirmedWords: wordsGuessed,
                confirmedTrashed: trashedWords,
                confirmedSkipped: skippedWords
            });
        });
    });


exports.confirmWord = functions
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
                confirmedWords: data.isConfirmed ? operations.arrayUnion(data.word) : operations.arrayRemove(data.word)
            });
        });
    });

const findNextTeam = (activeTeam, teams) => {
    const index = teams.findIndex(team => team.name === activeTeam);
    return teams[(index + 1) % teams.length];
};

const findNextExplainerInTeam = team => {
    const index = team.members.findIndex(member => member === team.previousExplainer);
    return team.members[(index + 1) % team.members.length];
};

exports.confirmScore = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const {
                activeTeam, teams, confirmedWords, words, isCustomNames, scoreCap, skippedWords, trashedWords
            } = doc.data();

            const nextTeam = findNextTeam(activeTeam, teams);
            const nextExplainer = findNextExplainerInTeam(nextTeam);

            const newScore = teams.find(team => team.name === activeTeam).score + confirmedWords.length;

            const scoreCapReached = !isCustomNames && newScore >= scoreCap;

            const newWords = words.filter(x => !confirmedWords.includes(x) && !skippedWords.includes(x) && !trashedWords.includes(x));

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

            console.log('next game status', nextGameStatus);

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

exports.leaveWhoInHatGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (doc.data().currentPlayers && doc.data().currentPlayers.length <= 1) {
                return doc.ref.delete();
            }

            if (doc.data().activeExplainer === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot leave game when it\'s your turn');
            }

            if (doc.data().host === context.auth.uid && doc.data().currentPlayers && doc.data().currentPlayers.length > 1) {
                return doc.ref.update({
                    host: doc.data().currentPlayers.find(x => x !== context.auth.uid),
                    playersReady: operations.arrayRemove(context.auth.uid),
                    currentPlayers: operations.arrayRemove(context.auth.uid),
                    teams: doc.data().teams.map(team => ({
                        ...team,
                        members: team.members.filter(member => member !== context.auth.uid)
                    })).filter(team => team.members.length > 0)
                });
            }


            return doc.ref.update({
                playersReady: operations.arrayRemove(context.auth.uid),
                currentPlayers: operations.arrayRemove(context.auth.uid),
                teams: doc.data().teams.map(team => ({
                    ...team,
                    members: team.members.filter(member => member !== context.auth.uid)
                })).filter(team => team.members.length > 0)
            });
        });
    });


exports.joinWhoInHatMidgame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found');
            }

            return db.collection('users').doc(context.auth.uid).get().then(response => {
                const { displayName } = response.data();
                if (!displayName) {
                    throw new functions.https.HttpsError('invalid-argument', 'Please set a display name before joining');
                }
                return doc.ref.update({
                    currentPlayers: operations.arrayUnion(context.auth.uid),
                    usernameMappings: {
                        ...doc.data().usernameMappings,
                        [context.auth.uid]: displayName
                    },
                    waitingToJoinTeam: operations.arrayUnion(context.auth.uid)
                });
            });
        });
    });

exports.joinWhoInHatTeamMidgame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found');
            }

            if (!data.teamName) {
                throw new functions.https.HttpsError('invalid-argument', 'Please select a team');
            }

            const { teams } = doc.data();

            if (!teams.some(team => team.name === data.teamName)) {
                throw new functions.https.HttpsError('invalid-argument', 'There is no team with that name');
            }

            const teamToBeAddedTo = teams.find(team => team.name === data.teamName);
            const previousIndex = teamToBeAddedTo.members.indexOf(teamToBeAddedTo.previousExplainer) || 0;

            const newIndex = previousIndex === 0 ? teamToBeAddedTo.members.length : previousIndex - 1;
            teamToBeAddedTo.members.splice(newIndex, 0, context.auth.uid);


            return doc.ref.update({
                teams: doc.data().teams.map(team => (team.name === data.teamName ? teamToBeAddedTo : ({
                    ...team,
                    members: team.members.filter(x => x !== context.auth.uid)
                }))).filter(team => team.members.length > 0),
                waitingToJoinTeam: operations.arrayRemove(context.auth.uid)
            });
        });
    });
