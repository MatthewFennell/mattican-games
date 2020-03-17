/* eslint-disable max-len */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fp = require('lodash/fp');
const constants = require('./constants');

module.exports.isAuthenticated = context => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to call this function');
    }
};

module.exports.isAdmin = uid => admin.auth().getUser(uid).then(user => {
    if (!fp.getOr(false, [constants.ROLES.ADMIN])(user.customClaims)) {
        throw new functions.https.HttpsError('unauthenticated', 'You are not authorized to perform this operation');
    }
});

module.exports.hasPermission = (uid, permission) => admin.auth().getUser(uid).then(user => {
    const userClaims = user.customClaims;

    // Iterate over claims (which represent their ROLES)
    // If their role includes the permission, return true
    if (userClaims === undefined || !Object.keys(userClaims).reduce((acc, curVal) => (userClaims[curVal] && constants.ROLE_PERMISSIONS[curVal]
        .includes(permission) ? true : acc), false)) {
        throw new functions.https.HttpsError('unauthenticated', 'You are not authorized to perform this operation');
    }
});


module.exports.isIntegerGreaterThanEqualZero = value => Number.isInteger(value) && value >= 0;
module.exports.isNumber = value => Boolean((Number(value) && value) >= 0 || Number(value) === 0);
