/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const constants = require('./constants');
const common = require('./common');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.leaveUnconstrainedMidgame = functions
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

            if (doc.data().mode === 'Othello') {
                if (doc.data().opponentType === constants.othelloPlayerTypes.Computer) {
                    throw new functions.https.HttpsError('invalid-argument', 'They are playing vs AI');
                }
                if (doc.data().currentPlayers.length === 2) {
                    throw new functions.https.HttpsError('invalid-argument', 'That game is full');
                }
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

exports.leaveMidgame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            if (doc.data().currentPlayers.length === 1) {
                return doc.ref.delete();
            }

            if (doc.data().status === constants.avalonGameStatuses.Finished || !doc.data().hasStarted) {
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

exports.joinMidgame = functions
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


exports.joinTeamMidgame = functions
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

            if (teams.some(team => team.members.includes(context.auth.uid))) {
                return Promise.resolve();
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
