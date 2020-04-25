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
                        currentPlayers: [context.auth.uid],
                        hasStarted: false,
                        host: context.auth.uid,
                        isCustomNames: Boolean(data.isCustomNames),
                        mode: constants.gameModes.WhosInTheHat,
                        name: data.name,
                        playersReady: [],
                        round: null,
                        skippingRule: data.skippingRule,
                        teams: constants.initialTeams,
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        }
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
            return doc.ref.update({
                isCustomNames: Boolean(data.isCustomNames),
                skippingRule: data.skippingRule
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

            return doc.ref.update({
                hasStarted: true,
                round: 1,
                status: constants.whoInHatGameStatuses.MakingTeams
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
                    score: 0
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
