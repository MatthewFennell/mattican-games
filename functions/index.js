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
                    hitlerKilled: false,
                    history: [],
                    host: context.auth.uid,
                    mode: data.mode,
                    name: data.name,
                    numberFascistPlayed: 0,
                    numberLiberalPlayed: 0,
                    numberOfPlayers: Math.min(data.numberOfPlayers, 10),
                    playersReady: [],
                    playerRoles: [],
                    playerToInvestigate: '',
                    president: null,
                    presidentCards: [],
                    playerToKill: '',
                    requestingVeto: false,
                    previousChancellor: '',
                    previousPresident: '',
                    rejectLeaveMidgame: [],
                    requestToEndGame: '',
                    temporaryPresident: '',
                    round: null,
                    votesFor: [],
                    votesAgainst: [],
                    vetoRejected: false
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
                deckOfCards.push(-1);
            }

            for (let x = 0; x < 6; x += 1) {
                deckOfCards.push(1);
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

const canNominatePlayer = (player, currentGame) => {
    const numberOfDeadPlayers = currentGame.deadPlayers.length;
    const remainingPlayers = currentGame.numberOfPlayers - numberOfDeadPlayers;

    if (remainingPlayers <= 5) {
        if (currentGame.previousPresident === player) {
            return false;
        }
        return true;
    }
    if (currentGame.previousPresident === player
            || currentGame.previousChancellor === player) {
        return false;
    }
    return true;
};


exports.nominateChancellor = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.Nominating
            && !doc.data().status === constants.hitlerGameStatuses.TemporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }

            if (context.auth.uid !== doc.data().president
            && doc.data().status === constants.hitlerGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }

            if (context.auth.uid !== doc.data().temporaryPresident
            && doc.data().status === constants.hitlerGameStatuses.TemporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }

            if (!data.chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid chancellor');
            }
            if (data.chancellor === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate yourself');
            }
            if (doc.data().deadPlayers.includes(data.chancellor)) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate a dead player');
            }
            if (!canNominatePlayer(data.chancellor, doc.data())) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate a dead player');
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
            if (!doc.data().status === constants.hitlerGameStatuses.Nominating
            && !doc.data().status === constants.hitlerGameStatuses.TemporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }

            if (context.auth.uid !== doc.data().president && doc.data().status === constants.hitlerGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }

            if (context.auth.uid !== doc.data().temporaryPresident && doc.data().status === constants.hitlerGameStatuses.TemporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }


            if (!doc.data().chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'No chancellor set');
            }

            return doc.ref.update({
                status: constants.hitlerGameStatuses.Voting
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
                    votesFor, votesAgainst, numberOfPlayers, president, currentPlayers, discardPile,
                    cardDeck, deadPlayers, consecutiveRejections, numberFascistPlayed, numberLiberalPlayed,
                    chancellor, temporaryPresident
                } = doc.data();

                if (votesFor.length + votesAgainst.length === numberOfPlayers - deadPlayers.length) {
                    if (votesFor.length > votesAgainst.length) {
                        const presidentCards = cardDeck.slice(0, 3);
                        const remainingCards = cardDeck.slice(3);
                        console.log('president cards', presidentCards);
                        console.log('remaining cards', remainingCards);

                        console.log('temporary president', temporaryPresident);
                        console.log('previous president', president);
                        console.log('setting previous president to ', (temporaryPresident || president));
                        return doc.ref.update({
                            presidentCards,
                            cardDeck: remainingCards,
                            status: constants.hitlerGameStatuses.PresidentDecidingCards,
                            votesAgainst: [],
                            votesFor: [],
                            consecutiveRejections: 0,
                            previousChancellor: chancellor,
                            previousPresident: temporaryPresident || president
                        });
                    }

                    if (consecutiveRejections === 2) {
                        console.log('have voted no 3 times, turning over the top card');

                        const topCard = fp.first(cardDeck);
                        const remainingCards = cardDeck.slice(1);
                        console.log('top card', topCard);

                        const gameFinished = (topCard === 1 && numberLiberalPlayed === 4)
                        || (topCard === -1 && numberFascistPlayed === 5);

                        if (gameFinished) {
                            return doc.ref.update({
                                status: constants.hitlerGameStatuses.Finished,
                                numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                                numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                                previousChancellor: '',
                                previousPresident: '',
                                temporaryPresident: ''
                            });
                        }

                        return doc.ref.update({
                            status: constants.hitlerGameStatuses.Nominating,
                            numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                            numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                            cardDeck: generateNewPackOfCards(remainingCards, discardPile),
                            discardPile: remainingCards.length < 3 ? [] : discardPile,
                            previouslyInPower: [],
                            chancellor: '',
                            president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                            consecutiveRejections: 0,
                            round: operations.increment(1),
                            votesFor: [],
                            votesAgainst: [],
                            previousChancellor: '',
                            previousPresident: '',
                            temporaryPresident: ''
                        });
                    }


                    return doc.ref.update({
                        chancellor: '',
                        status: constants.hitlerGameStatuses.Nominating,
                        votesAgainst: [],
                        votesFor: [],
                        consecutiveRejections: operations.increment(1),
                        president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                        temporaryPresident: ''
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
            if (!doc.data().status === constants.hitlerGameStatuses.PresidentDecidingCards) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not deciding cards');
            }
            if ((doc.data().temporaryPresident && context.auth.uid !== doc.data().temporaryPresident)
            && (context.auth.uid !== doc.data().president)) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }
            if (!doc.data().chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'Chancellor has not been set');
            }
            if ((doc.data().cards && doc.data().cards.length < 2) || !data.cards) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid set of cards');
            }

            const remainingCard = doc.data().presidentCards;
            const chancellorCards = data.cards;

            console.log('chancellor cards', chancellorCards);


            chancellorCards.forEach(x => {
                const index = remainingCard.indexOf(x);
                if (index > -1) {
                    remainingCard.splice(index, 1);
                }
            });

            return doc.ref.update({
                chancellorCards: data.cards,
                discardPile: [...doc.data().discardPile, fp.first(remainingCard)],
                presidentCards: [],
                status: constants.hitlerGameStatuses.ChancellorDecidingCards
            });
        });
    });

const nextGameMode = (numberOfPlayers, fascistNum) => {
    console.log('fascist num', fascistNum);
    if (fascistNum === 4 || fascistNum === 5) {
        console.log('bullet');
        return constants.hitlerGameStatuses.Kill;
    }
    if (fascistNum === 3 && numberOfPlayers <= 6) {
        console.log('peek');
        return constants.hitlerGameStatuses.Peek;
    }
    if (numberOfPlayers <= 6) {
        console.log('less than 6, nominating');
        return constants.hitlerGameStatuses.Nominating;
    }
    if (fascistNum === 3) {
        console.log('transfer president');
        return constants.hitlerGameStatuses.Transfer;
    }
    if (fascistNum === 2) {
        console.log('investigate');
        return constants.hitlerGameStatuses.Investigate;
    }
    if (fascistNum === 1 && numberOfPlayers >= 9) {
        console.log('investigate');
        return constants.hitlerGameStatuses.Investigate;
    }
    console.log('nominating');
    return constants.hitlerGameStatuses.Nominating;
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
                chancellor, numberFascistPlayed, numberOfPlayers, deadPlayers
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
                        status: constants.hitlerGameStatuses.Finished,
                        chancellor: '',
                        president: '',
                        temporaryPresident: ''
                    });
                }


                return doc.ref.update({
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    chancellor: '',
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    chancellorCards: [],
                    presidentCards: [],
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    numberLiberalPlayed: operations.increment(1),
                    status: constants.hitlerGameStatuses.Nominating,
                    round: operations.increment(1),
                    temporaryPresident: ''
                });
            }
            console.log('a fascist has been played');

            if (numberFascistPlayed === 5) {
                console.log('6 fascists played!');
                return doc.ref.update({
                    numberFascistPlayed: operations.increment(1),
                    status: constants.hitlerGameStatuses.Finished,
                    chancellor: '',
                    temporaryPresident: ''
                });
            }

            const nextMode = nextGameMode(numberOfPlayers, numberFascistPlayed + 1);
            console.log('next mode', nextMode);

            if (nextMode === constants.hitlerGameStatuses.Nominating) {
                console.log(`no power for the ${numberFascistPlayed + 1} card with ${numberOfPlayers} players`);
                return doc.ref.update({
                    previouslyInPower: [president, chancellor],
                    presidentCards: [],
                    chancellorCards: [],
                    chancellor: '',
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    numberFascistPlayed: operations.increment(1),
                    status: nextMode,
                    round: operations.increment(1),
                    temporaryPresident: ''
                });
            }
            console.log('there is a special power');

            if (nextMode === constants.hitlerGameStatuses.Investigate) {
                console.log('investigating');
                return doc.ref.update({
                    status: nextMode,
                    presidentCards: [],
                    chancellorCards: [],
                    chancellor: '',
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1)
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Transfer) {
                return doc.ref.update({
                    status: nextMode,
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    chancellor: ''
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Peek) {
                const newCardDeck = generateNewPackOfCards(cardDeck, newDiscardPile);
                const extraSecretInfo = {
                    president,
                    cards: newCardDeck.slice(0, 3),
                    type: constants.hitlerGameStatuses.Peek
                };
                return doc.ref.update({
                    status: constants.hitlerGameStatuses.Nominating,
                    cardDeck: newCardDeck,
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    chancellor: '',
                    hiddenInfo: operations.arrayUnion(extraSecretInfo),
                    presidentCards: [],
                    chancellorCards: [],
                    round: operations.increment(1),
                    temporaryPresident: '',
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers)
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Kill) {
                return doc.ref.update({
                    status: nextMode,
                    cardDeck: generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    chancellor: '',
                    presidentCards: [],
                    chancellorCards: [],
                    round: operations.increment(1),
                    temporaryPresident: ''
                });
            }

            return Promise.resolve();
        });
    });


exports.investigatePlayer = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Investigate) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not investigating currently');
            }

            if (!data.player) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }

            return doc.ref.update({
                playerToInvestigate: data.player
            });
        });
    });


exports.confirmInvestigation = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Investigate) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not investigating currently');
            }
            if (!doc.data().playerToInvestigate) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected to investigate');
            }

            const {
                playerToInvestigate, president, currentPlayers, deadPlayers
            } = doc.data();

            const extraSecretInfo = {
                president: context.auth.uid,
                investigated: playerToInvestigate,
                type: constants.hitlerGameStatuses.Investigate
            };

            return doc.ref.update({
                playerToInvestigate: '',
                status: constants.hitlerGameStatuses.Nominating,
                hiddenInfo: operations.arrayUnion(extraSecretInfo),
                chancellor: '',
                presidentCards: [],
                chancellorCards: [],
                president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                round: operations.increment(1),
                playerInvestigated: playerToInvestigate,
                temporaryPresident: ''
            });
        });
    });

exports.temporaryPresident = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Transfer) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not selecting that currently');
            }
            if (!data.player) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }

            return doc.ref.update({
                temporaryPresident: data.player
            });
        });
    });

exports.confirmTemporaryPresident = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Investigate) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not selecting that currently');
            }
            if (!doc.data().temporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }

            return doc.ref.update({
                temporaryPresident: doc.data().temporaryPresident,
                status: constants.hitlerGameStatuses.TemporaryPresident,
                chancellor: ''
            });
        });
    });


exports.killPlayer = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Kill) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not killing currently');
            }

            if (!data.player) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }
            if (data.player === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'You can\'t kill yourself');
            }
            if (doc.data().deadPlayers.includes(data.player)) {
                throw new functions.https.HttpsError('invalid-argument', 'You can\'t kill dead players');
            }

            return doc.ref.update({
                playerToKill: data.player
            });
        });
    });

exports.confirmKillPlayer = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.Kill) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not killing currently');
            }
            if (!doc.data().playerToKill) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }
            if (doc.data().deadPlayers.includes(doc.data().playerToKill)) {
                throw new functions.https.HttpsError('invalid-argument', 'That player is already dead');
            }

            const {
                president, currentPlayers, playerRoles, playerToKill, deadPlayers
            } = doc.data();

            const role = fp.get('role')(playerRoles.find(x => x.player === playerToKill));
            console.log('role of dead player', role);

            if (role === constants.hitlerRoles.Hitler) {
                return doc.ref.update({
                    status: constants.hitlerGameStatuses.Finished,
                    hitlerKilled: true,
                    president: '',
                    chancellor: '',
                    presidentCards: [],
                    chancellorCards: []
                });
            }

            return doc.ref.update({
                deadPlayers: operations.arrayUnion(playerToKill),
                playerToKill: '',
                status: constants.hitlerGameStatuses.Nominating,
                chancellor: '',
                presidentCards: [],
                chancellorCards: [],
                president: common.findNextUserHitler(president, currentPlayers, [...deadPlayers, playerToKill]),
                round: operations.increment(1),
                temporaryPresident: ''
            });
        });
    });


exports.initiateVeto = functions
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
                throw new functions.https.HttpsError('invalid-argument', 'We are not selecting that currently');
            }
            if (doc.data().requestingVeto) {
                throw new functions.https.HttpsError('invalid-argument', 'You are already trying to veto');
            }
            if (doc.data().vetoRejected) {
                throw new functions.https.HttpsError('invalid-argument', 'The request to veto has already been rejected');
            }

            return doc.ref.update({
                requestingVeto: true
            });
        });
    });

exports.replyToVeto = functions
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
            if (!doc.data().status === constants.hitlerGameStatuses.ChancellorDecidingCards) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not selecting that currently');
            }
            if (!doc.data().requestingVeto) {
                throw new functions.https.HttpsError('invalid-argument', 'Nobody is trying to veto');
            }
            if (doc.data().vetoRejected) {
                throw new functions.https.HttpsError('invalid-argument', 'You have already rejected the veto request');
            }

            const {
                cardDeck, consecutiveRejections, numberFascistPlayed, numberLiberalPlayed, discardPile,
                president, currentPlayers, deadPlayers, presidentCards
            } = doc.data();

            if (!data.isApprove) {
                return doc.ref.update({
                    requestingVeto: false,
                    vetoRejected: true
                });
            }
            console.log('Approving veto request');

            if (consecutiveRejections === 2) {
                console.log('have voted no 3 times, turning over the top card');

                const firstDiscardPile = discardPile.concat(presidentCards);
                console.log('discard pile + pres cards', firstDiscardPile);


                const nextCardDeck = generateNewPackOfCards(cardDeck, firstDiscardPile);
                const nextDiscardDeck = cardDeck.length < 3 ? [] : firstDiscardPile;

                console.log('after shuffling 3 pres cards into discard, new card deck = ', nextCardDeck);
                console.log('after shuffling 3 pres cards into discard, new discard pile = ', nextDiscardDeck);


                const topCard = fp.first(nextCardDeck);
                const remainingCards = nextCardDeck.slice(1);
                console.log('top card', topCard);

                const gameFinished = (topCard === 1 && numberLiberalPlayed === 4)
                || (topCard === -1 && numberFascistPlayed === 5);

                if (gameFinished) {
                    return doc.ref.update({
                        status: constants.hitlerGameStatuses.Finished,
                        numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                        numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                        previousChancellor: '',
                        previousPresident: '',
                        temporaryPresident: '',
                        requestingVeto: false,
                        vetoRejected: false
                    });
                }

                return doc.ref.update({
                    status: constants.hitlerGameStatuses.Nominating,
                    numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                    numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                    cardDeck: generateNewPackOfCards(remainingCards, nextDiscardDeck),
                    discardPile: remainingCards.length < 3 ? [] : nextDiscardDeck,
                    chancellor: '',
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    consecutiveRejections: 0,
                    round: operations.increment(1),
                    votesFor: [],
                    votesAgainst: [],
                    previousChancellor: '',
                    previousPresident: '',
                    temporaryPresident: '',
                    requestingVeto: false,
                    vetoRejected: false
                });
            }

            const nextDiscardDeck = discardPile.concat(presidentCards);


            return doc.ref.update({
                cardDeck: generateNewPackOfCards(cardDeck, nextDiscardDeck),
                chancellor: '',
                status: constants.hitlerGameStatuses.Nominating,
                votesAgainst: [],
                votesFor: [],
                consecutiveRejections: operations.increment(1),
                president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                temporaryPresident: '',
                requestingVeto: false,
                vetoRejected: false
            });
        });
    });
