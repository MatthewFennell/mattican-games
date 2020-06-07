/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const constants = require('./src/constants');
const common = require('./src/common');
const queries = require('./src/othelloLogic/queries');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.auth = require('./src/auth');
exports.articulate = require('./src/articulate');
exports.avalon = require('./src/avalon');
exports.hitler = require('./src/hitler');
exports.othello = require('./src/othello');
exports.profile = require('./src/profile');
exports.shared = require('./src/shared');
exports.whoInHat = require('./src/whoInHat');

const operations = admin.firestore.FieldValue;
// currently at v8.13.0 for node

// // https://firebase.google.com/docs/reference/js/firebase.functions.html#functionserrorcod

exports.realignQuestNominations = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('games').doc(data.gameId).get().then(doc => {
            if (!doc.exists) {
                throw new functions.https.HttpsError('not-found', 'Game not found. Contact Matt');
            }
            if (context.auth.uid !== doc.data().leader) {
                return Promise.resolve();
            }
            if (!doc.data().status === constants.avalonGameStatuses.Nominating) {
                return Promise.resolve();
            }

            if (!data.nominations) {
                return Promise.resolve();
            }

            const { round, numberOfPlayers } = doc.data();

            const maxNumberOfPlayersOnQuest = constants.avalonRounds[numberOfPlayers][round];

            if (data.nominations.length <= maxNumberOfPlayersOnQuest) {
                return doc.ref.update({
                    questNominations: data.nominations
                });
            }
            return Promise.resolve();
        });
    });
