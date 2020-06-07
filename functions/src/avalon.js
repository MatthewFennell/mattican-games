/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const constants = require('./constants');
const common = require('./common');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.createAvalonGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a game name');
        }

        if (data.name && data.name.length > 32) {
            throw new functions.https.HttpsError('invalid-argument', 'Game name too long. Max 32 characters');
        }

        if (!common.validNumberOfPlayers(data.numberOfPlayers, constants.gameModes.Avalon)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid number of players');
        }

        return db.collection('users').doc(context.auth.uid).get().then(response => {
            const { displayName } = response.data();
            return db.collection('games').where('name', '==', data.name).get().then(
                docs => {
                    if (docs.size > 0) {
                        throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                    }
                    return db.collection('games').add({
                        approveLeaveMidgame: [],
                        consecutiveRejections: 0,
                        currentPlayers: [context.auth.uid],
                        guessedMerlinCorrectly: false,
                        hasStarted: false,
                        history: [],
                        host: context.auth.uid,
                        leader: null,
                        mode: constants.gameModes.Avalon,
                        name: data.name,
                        numberOfPlayers: Math.min(data.numberOfPlayers, 10),
                        playersOnQuest: [],
                        playersReady: [],
                        playerToGuessMerlin: '',
                        questNominations: [],
                        questResult: [],
                        rejectLeaveMidgame: [],
                        requestToEndGame: '',
                        roles: data.roles,
                        round: null,
                        questSuccesses: [],
                        questFails: [],
                        votesFor: [],
                        votesAgainst: [],
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

            const playerRoles = common.makeAvalonRoles(doc.data().roles, doc.data().currentPlayers);
            const playerOrder = fp.shuffle(doc.data().currentPlayers);
            return doc.ref.update({
                currentPlayers: playerOrder,
                hasStarted: true,
                leader: fp.first(playerOrder),
                playerRoles,
                round: 1,
                status: constants.avalonGameStatuses.Nominating
            });
        });
    });

exports.editGameAvalon = functions
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
            if (!common.validAvalonRoles(data.numberOfPlayers, data.roles)) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid roles');
            }
            if (!common.isNumber(data.numberOfPlayers)) {
                throw new functions.https.HttpsError('invalid-argument', 'Must be a number');
            }

            return doc.ref.update({
                numberOfPlayers: data.numberOfPlayers,
                roles: data.roles
            });
        });
    });


exports.nominatePlayer = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().leader) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the leader');
            }
            if (!doc.data().status === constants.avalonGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }
            if (data.isOnQuest) {
                const { round, numberOfPlayers, questNominations } = doc.data();

                const maxNumberOfPlayersOnQuest = constants.avalonRounds[numberOfPlayers][round];

                if (questNominations.length < maxNumberOfPlayersOnQuest) {
                    return doc.ref.update({
                        questNominations: operations.arrayUnion(data.player)
                    });
                }
            }
            return doc.ref.update({
                questNominations: operations.arrayRemove(data.player)
            });
        });
    });


exports.confirmNominations = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().leader) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not the leader');
            }
            if (!doc.data().status === constants.avalonGameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }

            const {
                numberOfPlayers, round, consecutiveRejections
            } = doc.data();

            if (data.nominations.length !== constants.avalonRounds[numberOfPlayers][round]) {
                throw new functions.https.HttpsError('invalid-argument', 'Not enough players on quest');
            }

            if (consecutiveRejections === 4) {
                return doc.ref.update({
                    status: constants.avalonGameStatuses.Questing,
                    questNominations: [],
                    votesAgainst: [],
                    votesFor: [],
                    playersOnQuest: data.nominations,
                    consecutiveRejections: 0,
                    history: [{
                        type: constants.historyTypes.Vote,
                        leader: doc.data().leader,
                        forcedByConsecutiveRejections: true,
                        votesYes: [],
                        votesNo: [],
                        round: doc.data().round,
                        nominated: data.nominations
                    },
                    ...doc.data().history]
                });
            }

            return doc.ref.update({
                questNominations: data.nominations,
                status: constants.avalonGameStatuses.Voting
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
            if (!doc.data().status === constants.avalonGameStatuses.Voting) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not voting currently');
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
                    votesFor, votesAgainst, numberOfPlayers, questNominations,
                    leader, currentPlayers, history
                } = doc.data();

                if (votesFor.length + votesAgainst.length === numberOfPlayers) {
                    if (votesFor.length > votesAgainst.length) {
                        return doc.ref.update({
                            questNominations: [],
                            status: constants.avalonGameStatuses.Questing,
                            votesAgainst: [],
                            votesFor: [],
                            playersOnQuest: questNominations,
                            consecutiveRejections: 0,
                            history: [
                                {
                                    type: constants.historyTypes.Vote,
                                    leader,
                                    forcedByConsecutiveRejections: false,
                                    round: doc.data().round,
                                    votesYes: votesFor,
                                    votesNo: votesAgainst,
                                    nominated: questNominations
                                }, ...history
                            ]
                        });
                    }
                    return doc.ref.update({
                        questNominations: [],
                        status: constants.avalonGameStatuses.Nominating,
                        votesAgainst: [],
                        votesFor: [],
                        playersOnQuest: [],
                        consecutiveRejections: operations.increment(1),
                        leader: common.findNextUser(leader, currentPlayers),
                        history: [{
                            type: constants.historyTypes.Vote,
                            leader,
                            forcedByConsecutiveRejections: false,
                            votesYes: votesFor,
                            votesNo: votesAgainst,
                            round: doc.data().round,
                            nominated: questNominations
                        }, ...history]
                    });
                }
                return Promise.resolve();
            }));
    });


exports.goOnQuest = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().status === constants.avalonGameStatuses.Questing) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not questing currently');
            }

            const { playersOnQuest, questSuccesses, questFails } = doc.data();

            if (!playersOnQuest.includes(context.auth.uid)) {
                throw new functions.https.HttpsError('invalid-argument', 'You are not on this quest');
            }

            if (questSuccesses.includes(context.auth.uid) || questFails.includes(context.auth.uid)) {
                throw new functions.https.HttpsError('invalid-argument', 'You have already voted');
            }

            return doc.ref.update({
                questSuccesses: data.isSuccess ? operations.arrayUnion(context.auth.uid) : questSuccesses,
                questFails: !data.isSuccess ? operations.arrayUnion(context.auth.uid) : questFails
            });
        })
            .then(() => db.collection('games').doc(data.gameId).get().then(doc => {
                const {
                    questFails, questSuccesses, numberOfPlayers, round, leader, history,
                    currentPlayers, questResult, status, playerRoles, playerToGuessMerlin, playersOnQuest
                } = doc.data();

                const requiredNumberOfQuesters = constants.avalonRounds[numberOfPlayers][round];
                const numberOfQuesters = questFails.length + questSuccesses.length;

                const playingWithMerlin = playerRoles.some(x => x.role === constants.avalonRoles.Merlin.name);

                if (numberOfQuesters === requiredNumberOfQuesters) {
                    const questFailed = common.hasQuestFailed(round, numberOfPlayers, questFails.length);

                    const newQuestResult = [...questResult, questFailed ? -1 : 1];

                    const numFail = newQuestResult.filter(x => x === -1).length;
                    const numSuc = newQuestResult.filter(x => x === 1).length;

                    let nextStatus = status;

                    let randomBadGuyToGuessMerlin = playerToGuessMerlin;

                    if (numFail === 3) {
                        nextStatus = constants.avalonGameStatuses.Finished;
                    }
                    if (numSuc === 3 && playingWithMerlin) {
                        nextStatus = constants.avalonGameStatuses.GuessingMerlin;

                        const badPlayers = playerRoles.filter(r => !constants.avalonRoles[r.role].isGood).map(r => r.player);

                        randomBadGuyToGuessMerlin = badPlayers[Math.floor(Math.random() * badPlayers.length)];
                    }
                    if (numSuc < 3 && numFail < 3) {
                        nextStatus = constants.avalonGameStatuses.Nominating;
                    }

                    return doc.ref.update({
                        questResult: newQuestResult,
                        playersOnQuest: [],
                        leader: common.findNextUser(leader, currentPlayers),
                        round: operations.increment(1),
                        status: nextStatus,
                        questSuccesses: [],
                        questFails: [],
                        playerToGuessMerlin: randomBadGuyToGuessMerlin,
                        history: [
                            {
                                type: constants.historyTypes.Quest,
                                questers: playersOnQuest,
                                succeeds: questSuccesses.length,
                                fails: questFails.length,
                                round
                            }, ...history
                        ]
                    });
                }
                return Promise.resolve();
            }));
    });


exports.guessMerlin = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().playerToGuessMerlin === context.auth.uid) {
                throw new functions.https.HttpsError('invalid-argument', 'You aren\'t the one to guess Merlin');
            }
            const merlin = doc.data().playerRoles.filter(r => r.role === constants.avalonRoles.Merlin.name).map(r => r.player);

            return doc.ref.update({
                guessedMerlinCorrectly: merlin.includes(data.merlin),
                status: constants.avalonGameStatuses.Finished
            });
        });
    });
