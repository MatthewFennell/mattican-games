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

                    const spade = [];
                    const random = [];
                    const object = [];
                    const action = [];
                    const world = [];
                    const person = [];
                    const nature = [];

                    for (let x = 0; x < 100; x += 1) {
                        spade.push(`Spade ${x}`);
                        random.push(`Random ${x}`);
                        object.push(`Object ${x}`);
                        action.push(`Action ${x}`);
                        world.push(`World ${x}`);
                        person.push(`Person ${x}`);
                        nature.push(`Nature ${x}`);
                    }


                    return db.collection('games').add({
                        activeCategory: null,
                        activeTeam: '',
                        activeExplainer: '',
                        currentPlayers: [context.auth.uid],
                        currentWordIndex: 0,
                        hasStarted: false,
                        host: context.auth.uid,
                        mode: constants.gameModes.Articulate,
                        name: data.name,
                        playersReady: [],
                        round: null,
                        skippingRule: data.skippingRule,
                        teams: constants.initialTeams,
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        },
                        wordsGuessed: [],
                        skippedWords: [],
                        temporaryTeam: null,
                        trashedWords: [],
                        words: {
                            Object: object,
                            World: world,
                            Spade: spade,
                            Nature: nature,
                            Random: random,
                            Action: action,
                            Person: person
                        },
                        timePerRound: Math.min(Number(data.timePerRound), 120),
                        waitingToJoinTeam: [],
                        winningTeam: null,
                        scoreCap: data.scoreCap || constants.articulateMaxScore
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
            if (!data.skippingRule || !constants.articulateSkipping[data.skippingRule]) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid skipping rule');
            }
            if (!data.timePerRound) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid time per round');
            }
            return doc.ref.update({
                skippingRule: data.skippingRule,
                timePerRound: Math.min(Number(data.timePerRound), 120),
                scoreCap: data.scoreCap || constants.articulateMaxScore
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

            return doc.ref.update({
                hasStarted: true,
                round: 1,
                status: constants.articulateGameStatuses.MakingTeams
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

            const { words, teams, scoreCap } = doc.data();

            const remainingTeams = fp.shuffle(teams.filter(team => team.members.length > 0));

            const firstTeamName = fp.first(remainingTeams).name;
            const firstExplainer = fp.first(fp.first(remainingTeams).members);

            return doc.ref.update({
                activeTeam: firstTeamName,
                activeExplainer: firstExplainer,
                activeCategory: common.getCategory(0, scoreCap),
                words: {
                    Object: fp.shuffle(words.Object),
                    Nature: fp.shuffle(words.Nature),
                    Random: fp.shuffle(words.Random),
                    World: fp.shuffle(words.World),
                    Person: fp.shuffle(words.Person),
                    Action: fp.shuffle(words.Action),
                    Spade: fp.shuffle(words.Spade)
                },
                teams: remainingTeams.map(team => (team.name === firstTeamName ? {
                    ...team,
                    members: fp.shuffle(team.members),
                    previousExplainer: firstExplainer
                } : ({
                    ...team,
                    members: fp.shuffle(team.members)
                }))),
                status: constants.articulateGameStatuses.PrepareToGuess,
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
            const {
                activeExplainer, timePerRound, activeTeam, teams, temporaryTeam, scoreCap
            } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            const activeTeamScore = fp.get('score')(teams.find(team => team.name === (temporaryTeam || activeTeam)));
            return doc.ref.update({
                activeCategory: common.getCategory(activeTeamScore, scoreCap),
                finishTime: moment().add(timePerRound, 'seconds').format(),
                round: operations.increment(1),
                status: constants.articulateGameStatuses.Guessing
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

            if (doc.data().status !== constants.articulateGameStatuses.Guessing) {
                return Promise.resolve();
            }

            const {
                activeCategory, wordsGuessed, trashedWords, skippedWords, words, currentWordIndex
            } = doc.data();

            const endingWord = fp.flow(fp.get(activeCategory), fp.get(currentWordIndex))(words);

            return doc.ref.update({
                currentWordIndex: 0,
                status: constants.whoInHatGameStatuses.RoundSummary,
                confirmedWords: wordsGuessed,
                confirmedTrashed: endingWord ? trashedWords.concat(endingWord) : trashedWords,
                confirmedSkipped: skippedWords,
                words: {
                    ...words,
                    [activeCategory]: words[activeCategory].filter(word => word !== endingWord)
                },
                trashedWords: endingWord ? [...trashedWords, endingWord] : trashedWords
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

            const {
                activeCategory, activeTeam, teams, confirmedWords, words, skippedWords, trashedWords, temporaryTeam,
                scoreCap
            } = doc.data();

            const teamThatPlayed = temporaryTeam || activeTeam;

            const newScore = Math.min(teams.find(team => team.name === teamThatPlayed).score + confirmedWords.length, scoreCap);
            const nextCategory = common.getCategory(newScore, scoreCap);

            const nextTeam = common.findNextTeam(activeTeam, teams);
            const nextExplainer = common.findNextExplainerInTeam(nextTeam);

            const newWords = {
                ...words,
                [activeCategory]: words[activeCategory].filter(x => !confirmedWords.includes(x)
            && !skippedWords.includes(x) && !trashedWords.includes(x))
            };

            const newTeamScores = teams.map(team => {
                if (team.name === nextTeam.name) {
                    return {
                        ...team,
                        previousExplainer: nextExplainer,
                        score: team.name === teamThatPlayed ? newScore : team.score
                    };
                }
                if (team.name === teamThatPlayed) {
                    return {
                        ...team,
                        score: newScore
                    };
                }
                return team;
            });

            if (nextCategory === constants.articulateCategories.Spade && confirmedWords.length !== 0
             && newScore !== scoreCap && !temporaryTeam) {
                const teamObj = teams.find(t => t.name === activeTeam);
                const nextExplainerInTeam = common.findNextExplainerInTeam(teamObj);

                const nextTeams = teams.map(team => (team.name === teamObj.name ? ({
                    ...team,
                    previousExplainer: nextExplainerInTeam,
                    score: newScore
                }) : team));

                return doc.ref.update({
                    activeExplainer: nextExplainerInTeam,
                    activeCategory: constants.articulateCategories.Spade,
                    confirmedWords: [],
                    confirmedTrashed: [],
                    confirmedSkipped: [],
                    currentWordIndex: 0,
                    trashedWords: [],
                    skippedWords: [],
                    isSpadeRound: true,
                    status: constants.articulateGameStatuses.PrepareToGuess,
                    temporaryTeam: null,
                    teams: nextTeams,
                    words: newWords,
                    wordsGuessed: []
                });
            }

            const nextTeamCurrentScore = fp.get('score')(newTeamScores.find(t => t.name === nextTeam.name));

            return doc.ref.update({
                activeTeam: nextTeam.name, // If PrepareToGuess, game has not finished
                activeExplainer: nextExplainer, // If PrepareToGuess, game has not finished,
                activeCategory: common.getCategory(nextTeamCurrentScore, scoreCap),
                status: constants.articulateGameStatuses.PrepareToGuess,
                isFinalRound: nextTeamCurrentScore === scoreCap,
                isSpadeRound: false,
                confirmedWords: [],
                confirmedTrashed: [],
                confirmedSkipped: [],
                currentWordIndex: 0,
                trashedWords: [],
                skippedWords: [],
                teams: newTeamScores,
                temporaryTeam: null,
                wordsGuessed: [],
                words: newWords
            });
        });
    });

exports.confirmSpadeRoundWinner = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found');
            }

            if (!data.name) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid team');
            }

            const {
                activeCategory, trashedWords, teams, words, scoreCap
            } = doc.data();

            const nextTeam = teams.find(team => team.name === data.name);
            const nextExplainer = common.findNextExplainerInTeam(nextTeam);
            const nextCategory = common.getCategory(nextTeam.score, scoreCap);

            const newWords = words[activeCategory].filter(word => !trashedWords.includes(word));

            return doc.ref.update({
                activeExplainer: nextExplainer,
                activeCategory: nextCategory,
                isSpadeRound: false,
                temporaryTeam: fp.get('name')(nextTeam),
                status: constants.articulateGameStatuses.PrepareToGuess,
                confirmedWords: [],
                confirmedTrashed: [],
                confirmedSkipped: [],
                currentWordIndex: 0,
                trashedWords: [],
                skippedWords: [],
                teams: teams.map(team => (team.name === fp.get('name')(nextTeam) ? ({
                    ...team,
                    previousExplainer: nextExplainer
                }) : team)),
                words: {
                    ...words,
                    [activeCategory]: newWords
                }
            });
        });
    });

exports.confirmWinner = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const { activeTeam, teams, scoreCap } = doc.data();
            const scoreOfActiveTeam = fp.get('score')(teams.find(team => team.name === activeTeam));

            if (scoreOfActiveTeam !== scoreCap) {
                throw new functions.https.HttpsError('not-found', 'That team hasn\'t reached the max score yet');
            }

            return doc.ref.update({
                activeExplainer: null,
                status: constants.articulateGameStatuses.GameFinished,
                winningTeam: activeTeam
            });
        });
    });
