/* eslint-disable max-len */
const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.auth = require('./src/auth');
exports.articulate = require('./src/articulate');
exports.avalon = require('./src/avalon');
exports.hitler = require('./src/hitler');
exports.othello = require('./src/othello');
exports.profile = require('./src/profile');
exports.shared = require('./src/shared');
exports.telestration = require('./src/telestration');
exports.whoInHat = require('./src/whoInHat');

// currently at v8.13.0 for node

// // https://firebase.google.com/docs/reference/js/firebase.functions.html#functionserrorcod


