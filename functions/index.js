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
                    currentPlayers: operations.arrayUnion(context.auth.uid)
                });
            });
        });
    });


exports.createHitlerGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.mode) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game mode');
        }

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (data.name && data.name.length > 32) {
            throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 32 characters');
        }

        if (!common.validNumberOfPlayers(data.numberOfPlayers, data.mode)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid number of players');
        }

        return db.collection('games').where('name', '==', data.name).get().then(
            docs => {
                if (docs.size > 0) {
                    throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                }
                return db.collection('games').add({
                    approveLeaveMidgame: [],
                    cardDeck: [],
                    chancellor: '',
                    chancellorCards: '',
                    consecutiveRejections: 0,
                    currentPlayers: [context.auth.uid],
                    deadPlayers: [],
                    discardPile: [],
                    hasStarted: false,
                    hiddenInfo: [],
                    history: [],
                    host: context.auth.uid,
                    mode: data.mode,
                    name: data.name,
                    numberFascistPlayed: 0,
                    numberLiberalPlayed: 0,
                    numberOfPlayers: Math.min(data.numberOfPlayers, 10),
                    playersReady: [],
                    playerRoles: [],
                    president: null,
                    presidentCards: [],
                    previouslyInPower: [],
                    rejectLeaveMidgame: [],
                    requestToEndGame: '',
                    round: null,
                    votesFor: [],
                    votesAgainst: []
                });
            }
        );
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

            if (doc.data().playersReady.length !== doc.data().numberOfPlayers) {
                throw new functions.https.HttpsError('invalid-argument', 'Not everybody is ready');
            }

            const playerOrder = fp.shuffle(doc.data().currentPlayers);

            const deckOfCards = [];

            for (let x = 0; x < 11; x += 1) {
                deckOfCards.push(1);
            }

            for (let x = 0; x < 6; x += 1) {
                deckOfCards.push(-1);
            }

            const playerRoles = common.makeHitlerRoles(doc.data().currentPlayers);

            return doc.ref.update({
                cardDeck: fp.shuffle(deckOfCards),
                currentPlayers: playerOrder,
                hasStarted: true,
                president: fp.first(playerOrder),
                round: 1,
                playerRoles,
                status: constants.hitlerGameStatuses.Nominating
            });
        });
    });


exports.nominateChancellor = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().president) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }
            if (!data.chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid chancellor');
            }
            if (data.chancellor === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate yourself');
            }
            return doc.ref.update({
                chancellor: data.chancellor
            });
        });
    });


exports.confirmChancellor = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().president) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }

            if (!doc.data().chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'No chancellor set');
            }

            return doc.ref.update({
                status: constants.hitlerGameStatuses.Voting
            });
        });
    });


exports.makeVote = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.Voting) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not voting currently');
            }
            if (doc.data().deadPlayers.includes(context.auth.uid)) {
                throw new functions.https.HttpsError('invalid-argument', 'You are dead. No voting!');
            }

            const { votesFor, votesAgainst } = doc.data();

            if (votesFor.includes(context.auth.uid) || votesAgainst.includes(context.auth.uid)) {
                throw new functions.https.HttpsError('invalid-argument', 'You have already voted');
            }

            if (data.vote) {
                return doc.ref.update({
                    votesFor: operations.arrayUnion(context.auth.uid)
                });
            }
            return doc.ref.update({
                votesAgainst: operations.arrayUnion(context.auth.uid)
            });
        })
            .then(() => db.collection('games').doc(data.gameId).get().then(doc => {
                const {
                    votesFor, votesAgainst, numberOfPlayers, president, currentPlayers,
                    cardDeck, deadPlayers
                } = doc.data();

                if (votesFor.length + votesAgainst.length === numberOfPlayers - deadPlayers.length) {
                    if (votesFor.length > votesAgainst.length) {
                        const presidentCards = cardDeck.slice(0, 3);
                        const remainingCards = cardDeck.slice(3);
                        console.log('president cards', presidentCards);
                        console.log('remaining cards', remainingCards);
                        return doc.ref.update({
                            presidentCards,
                            cardDeck: remainingCards,
                            status: constants.hitlerGameStatuses.PresidentDecidingCards,
                            votesAgainst: [],
                            votesFor: [],
                            consecutiveRejections: 0
                        });
                    }
                    // May need to turn over top card here
                    return doc.ref.update({
                        chancellor: '',
                        status: constants.hitlerGameStatuses.Nominating,
                        votesAgainst: [],
                        votesFor: [],
                        consecutiveRejections: operations.increment(1),
                        president: common.findNextUser(president, currentPlayers)
                    });
                }
                return Promise.resolve();
            }));
    });


exports.giveCardsToChancellor = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().president) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.PresidentDecidingCards) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not deciding cards');
            }
            if (!doc.data().chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'Chancellor has not been set');
            }
            if ((doc.data().cards && doc.data().cards.length < 2) || !data.cards) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid set of cards');
            }

            const remainingCard = doc.data().presidentCards;
            const chancellorCards = data.cards;


            chancellorCards.forEach(x => {
                const index = remainingCard.indexOf(x);
                if (index > -1) {
                    remainingCard.splice(index, 1);
                }
            });

            console.log('remaining card', remainingCard);

            return doc.ref.update({
                chancellorCards: data.cards,
                discardPile: [...doc.data().discardPile, remainingCard],
                presidentCards: [],
                status: constants.hitlerGameStatuses.ChancellorDecidingCards
            });
        });
    });

const generateNewPackOfCards = (cardDeck, discardPile) => {
    if (cardDeck.length >= 3) {
        console.log('card deck greater than 3', cardDeck);
        return cardDeck;
    }
    const newList = cardDeck.concat(discardPile);
    console.log('card deck less than 3', cardDeck);
    console.log('discard pile', discardPile);
    return fp.shuffle(newList);
};


exports.playChancellorCard = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the Chancellor');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.ChancellorDecidingCards) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not playing cards now');
            }
            if (data.card !== 1 && data.card !== -1) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid Card');
            }

            const {
                numberLiberalPlayed, president, currentPlayers, chancellorCards, discardPile, cardDeck,
                chancellor
            } = doc.data();

            const cardNotPlayed = chancellorCards[0] === data.card ? chancellorCards[1] : chancellorCards[0];
            const newDiscardPile = [...discardPile, cardNotPlayed];
            console.log('card not played', cardNotPlayed);
            console.log('new discard pile', newDiscardPile);
            console.log('new pack of cards', generateNewPackOfCards(cardDeck, discardPile));

            if (data.card === 1) {
                console.log('a liberal has been played');
                if (numberLiberalPlayed === 4) {
                    console.log('5 liberals played!');
                    return doc.ref.update({
                        numberLiberalPlayed: operations.increment(1),
                        status: constants.hitlerGameStatuses.Finished
                    });
                }


                return doc.ref.update({
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    chancellor: '',
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    chancellorCards: [],
                    presidentCards: [],
                    president: common.findNextUser(president, currentPlayers),
                    numberLiberalPlayed: operations.increment(1),
                    status: constants.hitlerGameStatuses.Nominating,
                    previouslyInPower: [president, chancellor],
                    round: operations.increment(1)
                });
            }
            console.log('a fascist has been played');
            return Promise.resolve();
        });
    });
