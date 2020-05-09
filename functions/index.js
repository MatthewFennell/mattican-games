/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const moment = require('moment');
const constants = require('./src/constants');
const common = require('./src/common');

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
                round: operations.increment(1),
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
    console.log('team', team);
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

exports.randomiseTeams = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (!data.numberOfTeams) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid number of teams');
            }

            const { currentPlayers, host } = doc.data();
            let newTeams = constants.initialTeams;

            if (context.auth.uid !== host) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            if (data.numberOfTeams >= 3) {
                newTeams = [...newTeams, {
                    name: constants.defaultTeamNames.TeamZero,
                    members: [],
                    score: 0,
                    previousExplainer: null
                }];
            }

            if (data.numberOfTeams >= 4) {
                newTeams = [...newTeams, {
                    name: constants.defaultTeamNames.UndefinedName,
                    members: [],
                    score: 0,
                    previousExplainer: null
                }];
            }

            if (data.numberOfTeams >= 5) {
                newTeams = [...newTeams, {
                    name: constants.defaultTeamNames.LastTeam,
                    members: [],
                    score: 0,
                    previousExplainer: null
                }];
            }
            const newTeamsArray = newTeams.map(a => ({ ...a }));

            fp.shuffle(currentPlayers).forEach((player, index) => {
                newTeamsArray[index % newTeamsArray.length] = ({
                    ...newTeamsArray[index % newTeamsArray.length],
                    members: [...newTeamsArray[index % newTeamsArray.length].members, player]
                });
            });

            return doc.ref.update({
                teams: newTeamsArray,
                waitingToJoinTeam: []
            });
        });
    });


exports.createArticulateGame = functions
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
                        scoreLimit: 42, // 6 x 7
                        timePerRound: Math.min(Number(data.timePerRound), 120),
                        waitingToJoinTeam: [],
                        winningTeam: null
                    });
                }
            );
        });
    });


exports.editArticulateGame = functions
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
                timePerRound: Math.min(Number(data.timePerRound), 120)
            });
        });
    });


exports.startArticulateGame = functions
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


exports.startArticulate = functions
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
                activeCategory: common.getCategory(0),
                words: {
                    Object: fp.shuffle(words.Object),
                    Nature: fp.shuffle(words.Nature),
                    Random: fp.shuffle(words.Random),
                    World: fp.shuffle(words.World),
                    Person: fp.shuffle(words.Person),
                    Action: fp.shuffle(words.Action),
                    Spade: fp.shuffle(words.Spade)
                },
                teams: fp.shuffle(remainingTeams.map(team => (team.name === firstTeamName ? {
                    ...team,
                    members: fp.shuffle(team.members),
                    previousExplainer: firstExplainer
                } : ({
                    ...team,
                    members: fp.shuffle(team.members)
                })))),
                status: constants.articulateGameStatuses.PrepareToGuess,
                waitingToJoinTeam: []
            });
        });
    });


exports.startArticulateRound = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const {
                activeExplainer, timePerRound, activeTeam, teams, temporaryTeam
            } = doc.data();

            if (context.auth.uid !== activeExplainer) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the explainer');
            }

            const activeTeamScore = fp.get('score')(teams.find(team => team.name === (temporaryTeam || activeTeam)));
            console.log('active team score', activeTeamScore);

            return doc.ref.update({
                activeCategory: common.getCategory(activeTeamScore),
                finishTime: moment().add(timePerRound, 'seconds').format(),
                round: operations.increment(1),
                status: constants.articulateGameStatuses.Guessing
            });
        });
    });


exports.skipArticulateWord = functions
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


exports.gotArticulateWord = functions
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


exports.trashArticulateWord = functions
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


exports.loadArticulateSummary = functions
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

exports.setArticulateWordConfirmed = functions
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


exports.confirmArticulateScore = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const {
                activeCategory, activeTeam, teams, confirmedWords, words, skippedWords, trashedWords, temporaryTeam,
                isSpadeRound
            } = doc.data();

            const teamThatPlayed = temporaryTeam || activeTeam;

            const newScore = Math.min(teams.find(team => team.name === teamThatPlayed).score + confirmedWords.length, constants.articulateMaxScore);
            console.log('new score', newScore);
            const nextCategory = common.getCategory(newScore);
            console.log('next category', nextCategory);

            const nextTeam = findNextTeam(activeTeam, teams);
            console.log('next team', nextTeam);
            const nextExplainer = findNextExplainerInTeam(nextTeam);
            console.log('is spade round', isSpadeRound);

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
                 && newScore !== constants.articulateMaxScore && !temporaryTeam) {
                const teamObj = teams.find(t => t.name === activeTeam);
                const nextExplainerInTeam = findNextExplainerInTeam(teamObj);

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

            const nextTeamCurrentScore = fp.get('score')(teams.find(t => t.name === nextTeam.name));

            return doc.ref.update({
                activeTeam: nextTeam.name, // If PrepareToGuess, game has not finished
                activeExplainer: nextExplainer, // If PrepareToGuess, game has not finished,
                activeCategory: common.getCategory(nextTeamCurrentScore),
                status: constants.articulateGameStatuses.PrepareToGuess,
                isFinalRound: nextTeamCurrentScore === constants.articulateMaxScore,
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
                activeCategory, trashedWords, teams, words
            } = doc.data();

            const nextTeam = teams.find(team => team.name === data.name);
            const nextExplainer = findNextExplainerInTeam(nextTeam);
            const nextCategory = common.getCategory(nextTeam.score);

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

exports.confirmArticulateWinner = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            const { activeTeam, teams } = doc.data();

            const scoreOfActiveTeam = fp.get('score')(teams.find(team => team.name === activeTeam));
            console.log('score of active team', scoreOfActiveTeam);

            if (scoreOfActiveTeam !== constants.articulateMaxScore) {
                throw new functions.https.HttpsError('not-found', 'That team hasn\'t reached the max score yet');
            }

            console.log('active team', activeTeam);

            return doc.ref.update({
                activeExplainer: null,
                status: constants.articulateGameStatuses.GameFinished,
                winningTeam: activeTeam
            });
        });
    });

exports.leaveArticulateGame = functions
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
