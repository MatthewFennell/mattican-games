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

module.exports.makeAvalonRoles = (roles, players) => {
    const numPlayers = players.length;
    let allRoles = [];

    const badRoles = roles.filter(role => !constants.avalonRoles[role].isGood);
    const goodRoles = roles.filter(role => constants.avalonRoles[role].isGood);
    allRoles = badRoles.concat(goodRoles);

    for (let x = badRoles.length; x < constants.ROLES_LOOKUP[numPlayers].bad; x += 1) {
        allRoles.push(constants.avalonRoles.RegularBad.name);
    }

    for (let x = goodRoles.length; x < constants.ROLES_LOOKUP[numPlayers].good; x += 1) {
        allRoles.push(constants.avalonRoles.RegularGood.name);
    }
    allRoles = fp.shuffle(allRoles);
    const roleAssignments = [];

    for (let x = 0; x < players.length; x += 1) {
        roleAssignments.push({
            role: allRoles[x],
            player: players[x]
        });
    }
    return roleAssignments;
};

module.exports.makeHitlerRoles = players => {
    const { Fascist, Liberal, Hitler } = constants.hitlerRoles;


    const roleMappings = {
        5: [Hitler, Fascist, Liberal, Liberal, Liberal],
        6: [Hitler, Fascist, Liberal, Liberal, Liberal, Liberal],
        7: [Hitler, Fascist, Fascist, Liberal, Liberal, Liberal, Liberal],
        8: [Hitler, Fascist, Fascist, Liberal, Liberal, Liberal, Liberal, Liberal],
        9: [Hitler, Fascist, Fascist, Fascist, Liberal, Liberal, Liberal, Liberal, Liberal],
        10: [Hitler, Fascist, Fascist, Fascist, Liberal, Liberal, Liberal, Liberal, Liberal, Liberal]
    };
    const allRoles = fp.shuffle(roleMappings[players.length]);

    const roleAssignments = [];

    for (let x = 0; x < players.length; x += 1) {
        roleAssignments.push({
            role: allRoles[x],
            player: players[x]
        });
    }
    return roleAssignments;
};


module.exports.isIntegerGreaterThanEqualZero = value => Number.isInteger(value) && value >= 0;
module.exports.isNumber = value => Boolean((Number(value) && value) >= 0 || Number(value) === 0);

module.exports.validNumberOfPlayers = (numPlayers, mode) => {
    if (mode === constants.gameModes.Avalon || mode === constants.gameModes.Hitler) {
        return numPlayers >= 5 && numPlayers <= 10;
    }
    return false;
};

// ------------------------------------------------------------------------------------------------- //
// Avalon helpers

module.exports.findNextUser = (leader, users) => {
    const index = users.findIndex(u => u === leader);
    const val = users[(index + 1) % users.length];
    return val;
};

module.exports.hasQuestFailed = (round, numberOfPlayers, numFail) => {
    if (round === 4 && numberOfPlayers >= 7 && numFail >= 2) {
        return true;
    }
    if (round !== 4 && numFail >= 1) {
        return true;
    }
    return false;
};

module.exports.validAvalonRoles = (numberOfPlayers, roles) => {
    const numberBad = roles.filter(role => !constants.avalonRoles[role].isGood).length;
    if (numberBad > 2 && numberOfPlayers <= 6) {
        return false;
    }
    return true;
};


// ------------------------------------------------------------------------------------------------- //
// Hitler helpers

module.exports.canNominatePlayer = (player, currentGame) => {
    const numberOfDeadPlayers = currentGame.deadPlayers.length;
    const remainingPlayers = currentGame.numberOfPlayers - numberOfDeadPlayers;

    if (remainingPlayers <= 5) {
        if (currentGame.previousChancellor === player) {
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

module.exports.generateNewPackOfCards = (cardDeck, discardPile) => {
    if (cardDeck.length >= 3) {
        return cardDeck;
    }
    const newList = cardDeck.concat(discardPile);
    return fp.shuffle(newList);
};

module.exports.findNextUserHitler = (leader, users, deadPlayers) => {
    const index = users.findIndex(u => u === leader);
    let jump = 1;
    let val = users[(index + jump) % users.length];

    while (deadPlayers.includes(val)) {
        jump += 1;
        val = users[(index + jump) % users.length];
    }
    return val;
};

module.exports.nextGameStatus = (numberOfPlayers, fascistNum) => {
    if (fascistNum === 4 || fascistNum === 5) {
        return constants.hitlerGameStatuses.Kill;
    }
    if (fascistNum === 3 && numberOfPlayers <= 6) {
        return constants.hitlerGameStatuses.Peek;
    }
    if (numberOfPlayers <= 6) {
        return constants.hitlerGameStatuses.Nominating;
    }
    if (fascistNum === 3) {
        return constants.hitlerGameStatuses.Transfer;
    }
    if (fascistNum === 2) {
        return constants.hitlerGameStatuses.Investigate;
    }
    if (fascistNum === 1 && numberOfPlayers >= 9) {
        return constants.hitlerGameStatuses.Investigate;
    }
    return constants.hitlerGameStatuses.Nominating;
};

// ------------------------------------------------------------------------------------------------- //
// Who In Hat helpers

const playerExistsInTeam = (game, playerId) => game.teams
    .some(team => team.members.includes(playerId));

module.exports.findPlayersNotInTeam = game => game.currentPlayers
    .filter(playerId => !playerExistsInTeam(game, playerId));

// ------------------------------------------------------------------------------------------------- //
// Articulate helpers

module.exports.getCategory = (teamScore, scoreCap) => {
    if (teamScore === scoreCap) {
        return constants.articulateCategories.Spade;
    }

    if (teamScore % 7 === 0) {
        return constants.articulateCategories.Object;
    }
    if (teamScore % 7 === 1) {
        return constants.articulateCategories.Action;
    }
    if (teamScore % 7 === 2) {
        return constants.articulateCategories.Spade;
    }
    if (teamScore % 7 === 3) {
        return constants.articulateCategories.World;
    }
    if (teamScore % 7 === 4) {
        return constants.articulateCategories.Person;
    }
    if (teamScore % 7 === 5) {
        return constants.articulateCategories.Random;
    }
    if (teamScore % 7 === 6) {
        return constants.articulateCategories.Nature;
    }
    return 'ERROR';
};

module.exports.findNextTeam = (activeTeam, teams) => {
    const index = teams.findIndex(team => team.name === activeTeam);
    return teams[(index + 1) % teams.length];
};

module.exports.findNextExplainerInTeam = team => {
    const index = team.members.findIndex(member => member === team.previousExplainer);
    return team.members[(index + 1) % team.members.length];
};
