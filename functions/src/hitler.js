/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const constants = require('./constants');
const common = require('./common');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.createHitlerGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (data.name && data.name.length > 32) {
            throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 32 characters');
        }

        if (!common.validNumberOfPlayers(data.numberOfPlayers, constants.gameModes.Hitler)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid number of players');
        }

        return db.collection('users').doc(context.auth.uid).get().then(userDoc => {
            const { displayName } = userDoc.data();
            return db.collection('games').where('name', '==', data.name).get().then(
                docs => {
                    if (docs.size > 0) {
                        throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                    }
                    return db.collection('games').add({
                        approveLeaveMidgame: [],
                        cardDeck: [],
                        chancellor: '',
                        chancellorCards: [],
                        consecutiveRejections: 0,
                        currentPlayers: [context.auth.uid],
                        deadPlayers: [],
                        discardPile: [],
                        firstInvestigation: {
                            player: '',
                            role: ''
                        },
                        secondInvestigation: {
                            player: '',
                            role: ''
                        },
                        hasStarted: false,
                        hiddenInfo: [],
                        hitlerKilled: false,
                        history: [],
                        hitlerElected: false,
                        host: context.auth.uid,
                        mode: constants.gameModes.Hitler,
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
                        playerInvestigated: '',
                        peakingAtTopThree: {
                            player: '',
                            cards: []
                        },
                        requestingVeto: false,
                        previousChancellor: '',
                        previousPresident: '',
                        rejectLeaveMidgame: [],
                        requestToEndGame: '',
                        temporaryPresident: '',
                        round: null,
                        votesFor: [],
                        votesAgainst: [],
                        vetoRejected: false,
                        usernameMappings: {
                            [context.auth.uid]: displayName
                        }
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
            if (!common.canNominatePlayer(data.chancellor, doc.data())) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid chancellor candidate');
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

            if (!data.chancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid chancellor');
            }
            if (data.chancellor === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate yourself');
            }
            if (doc.data().deadPlayers.includes(data.chancellor)) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot nominate a dead player');
            }
            if (!common.canNominatePlayer(data.chancellor, doc.data())) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid chancellor candidate');
            }

            return doc.ref.update({
                chancellor: data.chancellor,
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
                return Promise.resolve();
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
                    chancellor, temporaryPresident, history, playerRoles
                } = doc.data();

                if (votesFor.length + votesAgainst.length === numberOfPlayers - deadPlayers.length) {
                    if (votesFor.length > votesAgainst.length) {
                        if (numberFascistPlayed >= 3) {
                            const role = fp.get('role')(playerRoles.find(x => x.player === chancellor));
                            if (role === constants.hitlerRoles.Hitler) {
                                return doc.ref.update({
                                    hitlerElected: true,
                                    chancellor,
                                    president: temporaryPresident || president,
                                    status: constants.hitlerGameStatuses.Finished,
                                    history: [
                                        {
                                            type: constants.historyTypes.Vote,
                                            president: temporaryPresident || president,
                                            chancellor,
                                            round: doc.data().round,
                                            votesYes: votesFor,
                                            votesNo: votesAgainst
                                        }, ...history
                                    ]
                                });
                            }
                        }


                        const presidentCards = cardDeck.slice(0, 3);
                        const remainingCards = cardDeck.slice(3);

                        return doc.ref.update({
                            presidentCards,
                            cardDeck: remainingCards,
                            status: constants.hitlerGameStatuses.PresidentDecidingCards,
                            votesAgainst: [],
                            votesFor: [],
                            history: [
                                {
                                    type: constants.historyTypes.Vote,
                                    president: temporaryPresident || president,
                                    chancellor,
                                    round: doc.data().round,
                                    votesYes: votesFor,
                                    votesNo: votesAgainst
                                }, ...history
                            ]
                        });
                    }

                    if (consecutiveRejections === 2) {
                        const topCard = fp.first(cardDeck);
                        const remainingCards = cardDeck.slice(1);

                        const gameFinished = (topCard === 1 && numberLiberalPlayed === 4)
                        || (topCard === -1 && numberFascistPlayed === 5);

                        if (gameFinished) {
                            return doc.ref.update({
                                status: constants.hitlerGameStatuses.Finished,
                                numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                                numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                                temporaryPresident: '',
                                history: [
                                    {
                                        type: constants.historyTypes.TopCardFlipped,
                                        card: topCard,
                                        round: doc.data().round
                                    },
                                    {
                                        type: constants.historyTypes.Vote,
                                        president: temporaryPresident || president,
                                        chancellor,
                                        round: doc.data().round,
                                        votesYes: votesFor,
                                        votesNo: votesAgainst
                                    }, ...history
                                ]
                            });
                        }

                        return doc.ref.update({
                            status: constants.hitlerGameStatuses.Nominating,
                            numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                            numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                            cardDeck: common.generateNewPackOfCards(remainingCards, discardPile),
                            discardPile: remainingCards.length < 3 ? [] : discardPile,
                            previouslyInPower: [],
                            chancellor: '',
                            president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                            consecutiveRejections: 0,
                            round: operations.increment(1),
                            previousPresident: '',
                            previousChancellor: '',
                            votesFor: [],
                            votesAgainst: [],
                            temporaryPresident: '',
                            history: [
                                {
                                    type: constants.historyTypes.TopCardFlipped,
                                    card: topCard,
                                    round: doc.data().round
                                },
                                {
                                    type: constants.historyTypes.Vote,
                                    president: temporaryPresident || president,
                                    chancellor,
                                    round: doc.data().round,
                                    votesYes: votesFor,
                                    votesNo: votesAgainst
                                }, ...history
                            ]
                        });
                    }

                    return doc.ref.update({
                        chancellor: '',
                        status: constants.hitlerGameStatuses.Nominating,
                        votesAgainst: [],
                        votesFor: [],
                        consecutiveRejections: operations.increment(1),
                        president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                        temporaryPresident: '',
                        history: [
                            {
                                type: constants.historyTypes.Vote,
                                president: temporaryPresident || president,
                                chancellor,
                                round: doc.data().round,
                                votesYes: votesFor,
                                votesNo: votesAgainst
                            }, ...history
                        ]
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
                chancellor, numberFascistPlayed, numberOfPlayers, deadPlayers, history, temporaryPresident,
                previousChancellor
            } = doc.data();

            if (context.auth.uid === previousChancellor) {
                throw new functions.https.HttpsError('invalid-argument', 'You have already played your card');
            }

            const cardNotPlayed = chancellorCards[0] === data.card ? chancellorCards[1] : chancellorCards[0];
            const newDiscardPile = [...discardPile, cardNotPlayed];

            if (data.card === 1) {
                if (numberLiberalPlayed === 4) {
                    return doc.ref.update({
                        numberLiberalPlayed: operations.increment(1),
                        status: constants.hitlerGameStatuses.Finished,
                        chancellor: '',
                        previousChancellor: chancellor,
                        president: '',
                        temporaryPresident: '',
                        previousPresident: temporaryPresident || president,
                        vetoRejected: false,
                        consecutiveRejections: 0,
                        history: [
                            {
                                type: constants.historyTypes.PlayChancellorCard,
                                president: temporaryPresident || president,
                                chancellor,
                                round: doc.data().round,
                                card: data.card
                            }, ...history
                        ]
                    });
                }


                return doc.ref.update({
                    cardDeck: common.generateNewPackOfCards(cardDeck, newDiscardPile),
                    chancellor: '',
                    previousChancellor: chancellor,
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    chancellorCards: [],
                    presidentCards: [],
                    consecutiveRejections: 0,
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    previousPresident: temporaryPresident || president,
                    numberLiberalPlayed: operations.increment(1),
                    status: constants.hitlerGameStatuses.Nominating,
                    round: operations.increment(1),
                    temporaryPresident: '',
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president: temporaryPresident || president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            if (numberFascistPlayed === 5) {
                return doc.ref.update({
                    numberFascistPlayed: operations.increment(1),
                    status: constants.hitlerGameStatuses.Finished,
                    chancellor: '',
                    consecutiveRejections: 0,
                    previousChancellor: chancellor,
                    temporaryPresident: '',
                    vetoRejected: false,
                    previousPresident: temporaryPresident || president,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president: temporaryPresident || president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            const nextMode = common.nextGameStatus(numberOfPlayers, numberFascistPlayed + 1);

            if (nextMode === constants.hitlerGameStatuses.Nominating) {
                return doc.ref.update({
                    previouslyInPower: [president, chancellor],
                    presidentCards: [],
                    chancellorCards: [],
                    chancellor: '',
                    consecutiveRejections: 0,
                    previousChancellor: chancellor,
                    cardDeck: common.generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    numberFascistPlayed: operations.increment(1),
                    previousPresident: temporaryPresident || president,
                    status: nextMode,
                    round: operations.increment(1),
                    temporaryPresident: '',
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president: temporaryPresident || president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Investigate) {
                return doc.ref.update({
                    status: nextMode,
                    presidentCards: [],
                    chancellorCards: [],
                    chancellor: '',
                    consecutiveRejections: 0,
                    previousChancellor: chancellor,
                    cardDeck: common.generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Transfer) {
                return doc.ref.update({
                    status: nextMode,
                    cardDeck: common.generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    chancellor: '',
                    consecutiveRejections: 0,
                    previousChancellor: chancellor,
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Peek) {
                const newCardDeck = common.generateNewPackOfCards(cardDeck, newDiscardPile);
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
                    previousPresident: temporaryPresident || president,
                    chancellor: '',
                    consecutiveRejections: 0,
                    previousChancellor: chancellor,
                    hiddenInfo: operations.arrayUnion(extraSecretInfo),
                    presidentCards: [],
                    peakingAtTopThree: {
                        player: president,
                        cards: newCardDeck.slice(0, 3)
                    },
                    chancellorCards: [],
                    round: operations.increment(1),
                    vetoRejected: false,
                    temporaryPresident: '',
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    history: [
                        {
                            type: constants.historyTypes.Peek,
                            president,
                            round: doc.data().round
                        },
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
                });
            }

            if (nextMode === constants.hitlerGameStatuses.Kill) {
                return doc.ref.update({
                    status: nextMode,
                    cardDeck: common.generateNewPackOfCards(cardDeck, newDiscardPile),
                    discardPile: cardDeck.length < 3 ? [] : newDiscardPile,
                    numberFascistPlayed: operations.increment(1),
                    chancellor: '',
                    previousChancellor: chancellor,
                    presidentCards: [],
                    consecutiveRejections: 0,
                    chancellorCards: [],
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.PlayChancellorCard,
                            president: temporaryPresident || president,
                            chancellor,
                            round: doc.data().round,
                            card: data.card
                        }, ...history
                    ]
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
            if (data.player === doc.data().playerInvestigated) {
                throw new functions.https.HttpsError('invalid-argument', 'That player has already been investigated. Not allowed twice');
            }

            if (data.player === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'You cannot investigate yourself');
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

            const { playerToInvestigate } = data;

            if (!playerToInvestigate) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected to investigate');
            }

            const {
                president, currentPlayers, deadPlayers, history, numberFascistPlayed,
                firstInvestigation, secondInvestigation, playerRoles
            } = doc.data();

            const extraSecretInfo = {
                president: context.auth.uid,
                investigated: playerToInvestigate,
                type: constants.hitlerGameStatuses.Investigate
            };

            const playerInvestigated = playerRoles.find(x => x.player === playerToInvestigate);

            return doc.ref.update({
                playerToInvestigate: '',
                status: constants.hitlerGameStatuses.Nominating,
                hiddenInfo: operations.arrayUnion(extraSecretInfo),
                presidentCards: [],
                firstInvestigation: numberFascistPlayed === 1 ? {
                    player: context.auth.uid,
                    role: fp.get('role')(playerInvestigated),
                    investigated: fp.get('player')(playerInvestigated)
                } : firstInvestigation,
                secondInvestigation: numberFascistPlayed === 2 ? {
                    player: context.auth.uid,
                    role: fp.get('role')(playerInvestigated),
                    investigated: fp.get('player')(playerInvestigated)
                } : secondInvestigation,
                chancellorCards: [],
                previousPresident: president,
                president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                round: operations.increment(1),
                playerInvestigated: playerToInvestigate,
                temporaryPresident: '',
                history: [
                    {
                        type: constants.historyTypes.Investigate,
                        president,
                        investigated: playerToInvestigate,
                        round: doc.data().round
                    }, ...history
                ]
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
            if (context.auth.uid === data.player) {
                throw new functions.https.HttpsError('invalid-argument', 'Cannot select yourself');
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

            const { tempPresident } = data;

            if (!tempPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }

            const alreadyAdded = doc.data().history.some(x => x.type === constants.historyTypes.TransferPresident);

            return doc.ref.update({
                temporaryPresident: tempPresident,
                status: constants.hitlerGameStatuses.TemporaryPresident,
                previousPresident: doc.data().president,
                round: operations.increment(1),
                history: alreadyAdded ? doc.data().history : [
                    {
                        type: constants.historyTypes.TransferPresident,
                        president: doc.data().president,
                        temporaryPresident: tempPresident,
                        round: doc.data().round
                    }, ...doc.data().history
                ]
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
            if (context.auth.uid !== doc.data().president && !doc.data().temporaryPresident) {
                return Promise.resolve();
            }
            if (doc.data().temporaryPresident && context.auth.uid !== doc.data().temporaryPresident) {
                return Promise.resolve();
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
            if (context.auth.uid !== doc.data().president && !doc.data().temporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the President');
            }
            if (doc.data().temporaryPresident && context.auth.uid !== doc.data().temporaryPresident) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the Prestident');
            }
            if (!doc.data().status === constants.hitlerGameStatuses.Kill) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not killing currently');
            }
            if (!data.playerToKill) {
                throw new functions.https.HttpsError('invalid-argument', 'No player selected');
            }
            if (doc.data().deadPlayers.includes(data.playerToKill)) {
                throw new functions.https.HttpsError('invalid-argument', 'That player is already dead');
            }

            const {
                president, currentPlayers, playerRoles, deadPlayers, temporaryPresident,
                history
            } = doc.data();

            const { playerToKill } = data;

            const role = fp.get('role')(playerRoles.find(x => x.player === playerToKill));

            if (role === constants.hitlerRoles.Hitler) {
                return doc.ref.update({
                    status: constants.hitlerGameStatuses.Finished,
                    hitlerKilled: true,
                    president: '',
                    presidentCards: [],
                    chancellorCards: [],
                    previousPresident: temporaryPresident || president,
                    history: [
                        {
                            type: constants.historyTypes.Kill,
                            president: temporaryPresident || president,
                            killed: playerToKill,
                            round: doc.data().round
                        }, ...history
                    ]
                });
            }

            return doc.ref.update({
                deadPlayers: operations.arrayUnion(playerToKill),
                playerToKill: '',
                status: constants.hitlerGameStatuses.Nominating,
                presidentCards: [],
                chancellorCards: [],
                previousPresident: temporaryPresident || president,
                president: common.findNextUserHitler(president, currentPlayers, [...deadPlayers, playerToKill]),
                round: operations.increment(1),
                temporaryPresident: '',
                history: [
                    {
                        type: constants.historyTypes.Kill,
                        president: temporaryPresident || president,
                        killed: playerToKill,
                        round: doc.data().round
                    }, ...history
                ]
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
                president, currentPlayers, deadPlayers, chancellor, history, chancellorCards
            } = doc.data();

            if (!data.isApprove) {
                return doc.ref.update({
                    requestingVeto: false,
                    vetoRejected: true,
                    history: [
                        {
                            type: constants.historyTypes.Veto,
                            president,
                            chancellor,
                            approvedVeto: data.isApprove,
                            round: doc.data().round
                        }, ...history
                    ]
                });
            }

            if (consecutiveRejections === 2) {
                const firstDiscardPile = discardPile.concat(chancellorCards);

                const nextCardDeck = common.generateNewPackOfCards(cardDeck, firstDiscardPile);
                const nextDiscardDeck = cardDeck.length < 3 ? [] : firstDiscardPile;


                const topCard = fp.first(nextCardDeck);
                const remainingCards = nextCardDeck.slice(1);

                const gameFinished = (topCard === 1 && numberLiberalPlayed === 4)
                || (topCard === -1 && numberFascistPlayed === 5);

                if (gameFinished) {
                    return doc.ref.update({
                        status: constants.hitlerGameStatuses.Finished,
                        numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                        numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                        previousChancellor: '',
                        previousPresident: '',
                        chancellorCards: [],
                        presidentCards: [],
                        temporaryPresident: '',
                        requestingVeto: false,
                        vetoRejected: false,
                        history: [
                            {
                                type: constants.historyTypes.TopCardFlipped,
                                card: topCard,
                                round: doc.data().round
                            },
                            {
                                type: constants.historyTypes.Veto,
                                president,
                                chancellor,
                                approvedVeto: data.isApprove,
                                round: doc.data().round
                            }, ...history
                        ]
                    });
                }

                return doc.ref.update({
                    status: constants.hitlerGameStatuses.Nominating,
                    numberFascistPlayed: topCard === -1 ? operations.increment(1) : numberFascistPlayed,
                    numberLiberalPlayed: topCard === 1 ? operations.increment(1) : numberLiberalPlayed,
                    cardDeck: common.generateNewPackOfCards(remainingCards, nextDiscardDeck),
                    discardPile: remainingCards.length < 3 ? [] : nextDiscardDeck,
                    chancellor: '',
                    president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                    consecutiveRejections: 0,
                    round: operations.increment(1),
                    votesFor: [],
                    votesAgainst: [],
                    previousPresident: '',
                    temporaryPresident: '',
                    requestingVeto: false,
                    vetoRejected: false,
                    history: [
                        {
                            type: constants.historyTypes.TopCardFlipped,
                            card: topCard,
                            round: doc.data().round
                        },
                        {
                            type: constants.historyTypes.Veto,
                            president,
                            chancellor,
                            approvedVeto: data.isApprove,
                            round: doc.data().round
                        }, ...history
                    ]
                });
            }

            const nextDiscardDeck = discardPile.concat(chancellorCards);

            return doc.ref.update({
                cardDeck: common.generateNewPackOfCards(cardDeck, nextDiscardDeck),
                discardPile: cardDeck < 3 ? [] : nextDiscardDeck,
                chancellor: '',
                status: constants.hitlerGameStatuses.Nominating,
                chancellorCards: [],
                presidentCards: [],
                votesAgainst: [],
                votesFor: [],
                consecutiveRejections: operations.increment(1),
                president: common.findNextUserHitler(president, currentPlayers, deadPlayers),
                temporaryPresident: '',
                requestingVeto: false,
                vetoRejected: false,
                history: [
                    {
                        type: constants.historyTypes.Veto,
                        president,
                        chancellor,
                        approvedVeto: data.isApprove,
                        round: doc.data().round
                    }, ...history
                ]
            });
        });
    });

exports.closeTopThree = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            return doc.ref.update({
                peakingAtTopThree: {
                    player: '',
                    cards: []
                }
            });
        });
    });

exports.editGameHitler = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (data.numberOfPlayers < 5) {
                throw new functions.https.HttpsError('invalid-argument', 'Can\'t have less than 5 players');
            }
            if (doc.data().currentPlayers.length > data.numberOfPlayers) {
                throw new functions.https.HttpsError('invalid-argument', 'You already have too many players for that');
            }
            if (!common.isNumber(data.numberOfPlayers)) {
                throw new functions.https.HttpsError('invalid-argument', 'Must be a number');
            }
            return doc.ref.update({
                numberOfPlayers: data.numberOfPlayers
            });
        });
    });

exports.closeInvestigation = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            return doc.ref.update({
                firstInvestigation: data.isFirst ? {
                    player: '',
                    role: '',
                    investigated: ''
                } : doc.data().firstInvestigation,
                secondInvestigation: data.isFirst ? doc.data().secondInvestigation : {
                    player: '',
                    role: '',
                    investigated: ''
                }
            });
        });
    });
