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

exports.createAvalonGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        return db.collection('games').where('name', '==', data.name).get().then(
            docs => {
                if (docs.size > 0) {
                    throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                }
                return db.collection('games').add({
                    mode: data.mode,
                    name: data.name,
                    numberOfPlayers: Math.min(data.numberOfPlayers, 10),
                    roles: data.roles,
                    hasStarted: false,
                    currentPlayers: [context.auth.uid],
                    host: context.auth.uid,
                    playersReady: [],
                    questResult: [],
                    playersOnQuest: [],
                    consecutiveRejections: 0,
                    questSuccesses: [],
                    questFails: [],
                    playerToGuessMerlin: '',
                    guessedMerlinSuccessfully: false
                });
            }
        );
    });

exports.joinAvalonGame = functions
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
            return doc.ref.update({
                currentPlayers: operations.arrayUnion(context.auth.uid)
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
                if (doc.data().status !== constants.gameStatuses.Finished) {
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

exports.startGame = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            const playerRoles = common.makeRoles(doc.data().roles, doc.data().currentPlayers);
            const playerOrder = fp.shuffle(doc.data().currentPlayers);
            return doc.ref.update({
                currentPlayers: playerOrder,
                playerRoles,
                round: 1,
                leader: fp.first(playerOrder),
                questNominations: [],
                votesFor: [],
                votesAgainst: [],
                history: [],
                hasStarted: true
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
            if (!doc.data().status === constants.gameStatuses.Nominating) {
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
            if (!doc.data().status === constants.gameStatuses.Nominating) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not nominating currently');
            }

            const {
                numberOfPlayers, round, consecutiveRejections, questNominations
            } = doc.data();

            if (data.nominations.length !== constants.avalonRounds[numberOfPlayers][round]) {
                throw new functions.https.HttpsError('invalid-argument', 'Not enough players on quest');
            }

            if (consecutiveRejections === 4) {
                console.log('Quest forced to go ahead due to multiple no votes');
                return doc.ref.update({
                    status: constants.gameStatuses.Questing,
                    questNominations: [],
                    votesAgainst: [],
                    votesFor: [],
                    playersOnQuest: questNominations,
                    consecutiveRejections: 0
                });
            }

            return doc.ref.update({
                status: constants.gameStatuses.Voting
            });
        });
    });

const findNextUser = (leader, users) => {
    const index = users.findIndex(u => u === leader);
    const val = users[(index + 1) % users.length];
    return val;
};

exports.makeVote = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().status === constants.gameStatuses.Voting) {
                throw new functions.https.HttpsError('invalid-argument', 'We are not voting currently');
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
                    votesFor, votesAgainst, numberOfPlayers, questNominations, leader, currentPlayers
                } = doc.data();
                console.log('votes for', votesFor);
                console.log('votes for', votesAgainst);
                console.log('questNominations', questNominations);

                if (votesFor.length + votesAgainst.length === numberOfPlayers) {
                    console.log('voting finished');

                    if (votesFor.length > votesAgainst.length) {
                        console.log('majority voted yes');
                        return doc.ref.update({
                            questNominations: [],
                            status: constants.gameStatuses.Questing,
                            votesAgainst: [],
                            votesFor: [],
                            playersOnQuest: questNominations,
                            consecutiveRejections: 0
                        });
                    }
                    return doc.ref.update({
                        questNominations: [],
                        status: constants.gameStatuses.Nominating,
                        votesAgainst: [],
                        votesFor: [],
                        playersOnQuest: [],
                        consecutiveRejections: operations.increment(1),
                        leader: findNextUser(leader, currentPlayers)
                    });
                }
                console.log('not enough votes yet');
            }));
    });

const hasQuestFailed = (round, numberOfPlayers, numFail) => {
    if (round === 4 && numberOfPlayers >= 7 && numFail >= 2) {
        return true;
    }
    if (numFail >= 1) {
        return true;
    }
    return false;
};


exports.goOnQuest = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (!doc.data().status === constants.gameStatuses.Questing) {
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
                    questFails, questSuccesses, numberOfPlayers, round, leader, currentPlayers, questResult, status, playerRoles, playerToGuessMerlin
                } = doc.data();

                const requiredNumberOfQuesters = constants.avalonRounds[numberOfPlayers][round];
                console.log('required number of players = ', requiredNumberOfQuesters);

                const numberOfQuesters = questFails.length + questSuccesses.length;

                if (numberOfQuesters === requiredNumberOfQuesters) {
                    console.log('quest has been completed');
                    const questFailed = hasQuestFailed(round, numberOfPlayers, questFails.length);
                    console.log('quest failed = ', questFailed);

                    const newQuestResult = [...questResult, questFailed ? -1 : 1];

                    const numFail = newQuestResult.filter(x => x === -1).length;
                    const numSuc = newQuestResult.filter(x => x === 1).length;

                    console.log('new quest result', newQuestResult);
                    console.log('num fail, num Succ', numFail, ',', numSuc);

                    let nextStatus = status;

                    let randomBadGuyToGuessMerlin = playerToGuessMerlin;

                    if (numFail === 3) {
                        nextStatus = constants.gameStatuses.Finished;
                    }
                    if (numSuc === 3) {
                        console.log('num succ === 3');
                        nextStatus = constants.gameStatuses.GuessingMerlin;

                        const badPlayers = playerRoles.filter(r => !constants.avalonRoles[r.role].isGood).map(r => r.player);

                        randomBadGuyToGuessMerlin = badPlayers[Math.floor(Math.random() * badPlayers.length)];

                        console.log('bad players', badPlayers);
                    }
                    if (numSuc < 3 && numFail < 3) {
                        nextStatus = constants.gameStatuses.Nominating;
                    }

                    return doc.ref.update({
                        questResult: newQuestResult,
                        playersOnQuest: [],
                        leader: findNextUser(leader, currentPlayers),
                        round: operations.increment(1),
                        status: nextStatus,
                        questSuccesses: [],
                        questFails: [],
                        previousQuestSuccesses: questSuccesses.length,
                        previousQuestFailures: questFails.length,
                        playerToGuessMerlin: randomBadGuyToGuessMerlin
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
            const merlin = doc.data().playerRoles.filter(r => r.role === constants.avalonRoles.Merlin).map(r => r.player);

            console.log('merlin actually is', merlin);

            console.log(`guessed merlin was ${data.merlin}`);

            return doc.ref.update({
                guessedMerlinCorrectly: merlin === data.merlin,
                status: constants.gameStatuses.Finished
            });
        });
    });
