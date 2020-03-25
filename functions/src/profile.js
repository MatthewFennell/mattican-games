const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');
const constants = require('./constants');

const db = admin.firestore();


exports.updateDisplayName = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        if (!data.displayName) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid display name');
        }
        if (data.displayName.length > 16) {
            throw new functions.https.HttpsError('invalid-argument', 'Too long. Max length of 16');
        }
        common.isAuthenticated(context);
        return db.collection('users').doc(context.auth.uid).update({
            displayName: data.displayName
        });
    });


exports.updateProfilePicture = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('users').doc(context.auth.uid).update({
            photoUrl: data.photoUrl
        });
    });
