const _ = require('lodash');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');
const constants = require('./constants');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.createGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        console.log("mode", constants.gameModes.Telestrations)
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
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
                        objectsToDraw: constants.telestrationObjects,
                        hasStarted: false,
                        host: context.auth.uid,
                        mode: 'Telestrations',
                        name: data.name,
                        round: 0,
                        playersReady: [],
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        },
                        usedWords: [],
                        usersToJoinNextRound: []
                    });
                }
            );
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
                status: constants.telestrationGameStatuses.AddingWords,
            });
        });
    });

exports.addWord = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        console.log("hey", data.word)

        if (!data.word) {
            throw new functions.https.HttpsError('not-found', 'Must provide a word');
        }

        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }

            return doc.ref.update({
                objectsToDraw: operations.arrayUnion(data.word)
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

            if (doc.data().host !== context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the host');
            }

            const { usedWords, usersToJoinNextRound } = doc.data();

            const nextWord = _.chain(doc.data().objectsToDraw).filter(word => !usedWords.includes(word)).shuffle().head().value()

            const nextUsers = [...doc.data().currentPlayers, ...usersToJoinNextRound]

            return doc.ref.update({
                round: operations.increment(1),
                hasStarted: true,
                status: constants.telestrationGameStatuses.Drawing,
                wordToDraw: nextWord,
                blindUser: _.chain(nextUsers).shuffle().head().value(),
                usedWords: operations.arrayUnion(nextWord),
                currentPlayers: nextUsers,
                usersToJoinNextRound: []
            });
        });
    });