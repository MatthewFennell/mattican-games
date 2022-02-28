const _ = require('lodash');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');
const constants = require('./constants');
const telestrationWords = require('./telestration/telestration.json');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.createGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (data.name && data.name.length > 32) {
            throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 32 characters');
        }

        const numberOfSpies = Math.max(1, data.numberOfSpies);

        return db.collection('users').doc(context.auth.uid).get().then(response => {
            const { displayName } = response.data();
            return db.collection('games').where('name', '==', data.name).get().then(
                docs => {
                    if (docs.size > 0) {
                        throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                    }
                    return db.collection('games').add({
                        currentPlayers: [context.auth.uid],
                        objectsToDraw: data.includesPresetWords ? telestrationWords : [],
                        hasStarted: false,
                        host: context.auth.uid,
                        mode: 'Telestrations',
                        name: data.name,
                        round: 0,
                        // playersReady: [],
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        },
                        usedWords: [],
                        usersToJoinNextRound: [],
                        numberOfSpies
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

            // if (doc.data().playersReady.length !== doc.data().currentPlayers.length) {
            //     throw new functions.https.HttpsError('invalid-argument', 'Not everybody is ready');
            // }

            const { currentPlayers, numberOfSpies } = doc.data();

            return doc.ref.update({
                hasStarted: true,
                status: constants.telestrationGameStatuses.AddingWords,
                numberOfSpies: Math.min(numberOfSpies, currentPlayers.length)
            });
        });
    });

exports.addWord = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

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

            const { usedWords, objectsToDraw, numberOfSpies } = doc.data();

            if (usedWords.length === objectsToDraw.length) {
                throw new functions.https.HttpsError('invalid-argument', 'You need to add more words');
            }

            const nextWord = _.chain(objectsToDraw).filter(word => !usedWords.includes(word)).shuffle().head().value()

            const nextUsers = doc.data().currentPlayers;

            const randomUsers = _.shuffle(nextUsers);

            if (numberOfSpies > nextUsers.length) {
                numberOfSpies = nextUsers.length
            }

            const spies = randomUsers.slice(0, numberOfSpies) 

            return doc.ref.update({
                round: operations.increment(1),
                hasStarted: true,
                status: constants.telestrationGameStatuses.Drawing,
                wordToDraw: nextWord,
                firstDrawer: _.chain(nextUsers).shuffle().head().value(),
                blindUsers: spies,
                usedWords: operations.arrayUnion(nextWord),
                currentPlayers: nextUsers,
                usersToJoinNextRound: []
            });
        });
    });

exports.setNumberOfSpies = functions
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

            const { currentPlayers } = doc.data();

            if (data.numberOfSpies < 0 || data.numberOfSpies > currentPlayers.length) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid number of spies');
            }

            return doc.ref.update({
                numberOfSpies: data.numberOfSpies
            });
        });
    });