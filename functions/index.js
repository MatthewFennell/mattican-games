/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const constants = require('./src/constants');
const common = require('./src/common');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.auth = require('./src/auth');
exports.articulate = require('./src/articulate');
exports.avalon = require('./src/avalon');
exports.hitler = require('./src/hitler');
exports.profile = require('./src/profile');
exports.shared = require('./src/shared');
exports.whoInHat = require('./src/whoInHat');

const operations = admin.firestore.FieldValue;
// currently at v8.13.0 for node

// // https://firebase.google.com/docs/reference/js/firebase.functions.html#functionserrorcod


//  1 = White
// -1 = Black
exports.createOthelloGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (!data.opponent) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide an opponent type');
        }

        if (data.opponent === constants.othelloPlayerTypes.Computer && !data.difficulty) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a computer difficulty');
        }

        if (data.opponent !== constants.othelloPlayerTypes.Computer && data.opponent !== constants.othelloPlayerTypes.Human) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid opponent type');
        }

        if (data.opponent === constants.othelloPlayerTypes.Computer && !constants.othelloDifficulties.includes(data.difficulty)) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid computer difficulty');
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
                    const initialBoard = {
                        rowZero: [0, 0, 0, 0, 0, 0, 0, 0],
                        rowOne: [0, 0, 0, 0, 0, 0, 0, 0],
                        rowTwo: [0, 0, 0, 0, 0, 0, 0, 0],
                        rowThree: [0, 0, 0, 1, -1, 0, 0, 0],
                        rowFour: [0, 0, 0, -1, 1, 0, 0, 0],
                        rowFive: [0, 0, 0, 0, 0, 0, 0, 0],
                        rowSix: [0, 0, 0, 0, 0, 0, 0, 0],
                        rowSeven: [0, 0, 0, 0, 0, 0, 0, 0]
                    };

                    return db.collection('games').add({
                        activePlayer: -1,
                        board: initialBoard,
                        currentPlayers: [context.auth.uid],
                        difficulty: data.difficulty ? data.difficulty : 'N/A',
                        hasFinished: false,
                        hasStarted: false,
                        history: [],
                        host: context.auth.uid,
                        mode: 'Othello',
                        name: data.name,
                        opponentType: data.opponent,
                        playersReady: [],
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        }
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
            if (!data.opponent) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide an opponent type');
            }

            if (data.opponent === constants.othelloPlayerTypes.Computer && !data.difficulty) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a computer difficulty');
            }

            if (data.opponent !== constants.othelloPlayerTypes.Computer && data.opponent !== constants.othelloPlayerTypes.Human) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid opponent type');
            }

            if (data.opponent === constants.othelloPlayerTypes.Computer && !constants.othelloDifficulties.includes(data.difficulty)) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid computer difficulty');
            }
            return doc.ref.update({
                difficulty: data.difficulty,
                opponentType: data.opponent
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

            const { opponentType, currentPlayers } = doc.data();

            const players = fp.shuffle([constants.othelloPlayerTypes.Human, opponentType]);

            if (opponentType === constants.othelloPlayerTypes.Computer) {
                return doc.ref.update({
                    activePlayer: -1,
                    hasStarted: true,
                    playerBlack: players[0] === constants.othelloPlayerTypes.Human ? context.auth.uid : constants.othelloPlayerTypes.Computer,
                    playerWhite: players[1] === constants.othelloPlayerTypes.Human ? context.auth.uid : constants.othelloPlayerTypes.Computer
                });
            }

            const randomPlayers = fp.shuffle(currentPlayers);

            return doc.ref.update({
                activePlayer: -1,
                hasStarted: true,
                playerBlack: randomPlayers[0],
                playerWhite: randomPlayers[1]
            });
        });
    });
