module.exports.region = 'europe-west2';

// A list of all existing permissions - keep in sync with UI
// src/constants.js
const PERMISSIONS = {
    CREATE_PLAYER: 'CREATE_PLAYER',
    DELETE_PLAYER: 'DELETE_PLAYER',
    CREATE_TEAM: 'CREATE_TEAM',
    DELETE_TEAM: 'DELETE_TEAM',
    SUBMIT_RESULT: 'SUBMIT_RESULT',
    TRIGGER_WEEK: 'TRIGGER_WEEK',
    EDIT_PLAYER: 'EDIT_PLAYER',
    MANAGE_USERS: 'MANAGE_USERS',
    APPROVE_HIGHLIGHTS: 'APPROVE_HIGHLIGHTS',
    ROLL_OVER_YEAR: 'ROLL_OVER_YEAR',
    MANAGE_SUBS: 'MANAGE_SUBS',
    TOGGLE_PAGES: 'TOGGLE_PAGES'
};

module.exports.PERMISSIONS = PERMISSIONS;

// A list of all existing roles - keep in sync with UI
module.exports.ROLES = {
    ADMIN: 'ADMIN',
    MAINTAINER: 'MAINTAINER',
    HIGHLIGHT_APPROVER: 'HIGHLIGHT_APPROVER',
    TREASURER: 'TREASURER'
};

// This dictates what each role is able to do
module.exports.ROLE_PERMISSIONS = {
    ADMIN: [
        PERMISSIONS.MANAGE_USERS, // Admin only
        PERMISSIONS.ROLL_OVER_YEAR, // Admin only
        PERMISSIONS.TOGGLE_PAGES, // Admin only
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.DELETE_PLAYER,
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.DELETE_TEAM,
        PERMISSIONS.SUBMIT_RESULT,
        PERMISSIONS.TRIGGER_WEEK,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.APPROVE_HIGHLIGHTS,
        PERMISSIONS.MANAGE_SUBS],
    MAINTAINER: [
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.DELETE_PLAYER,
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.DELETE_TEAM,
        PERMISSIONS.SUBMIT_RESULT,
        PERMISSIONS.TRIGGER_WEEK,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.APPROVE_HIGHLIGHTS],
    HIGHLIGHT_APPROVER: [
        PERMISSIONS.APPROVE_HIGHLIGHTS
    ],
    TREASURER: [
        PERMISSIONS.MANAGE_SUBS
    ]
};

module.exports.ROLES_LOOKUP = {
    5: {
        bad: 2,
        good: 3
    },
    6: {
        bad: 2,
        good: 4
    },
    7: {
        bad: 3,
        good: 4
    },
    8: {
        bad: 3,
        good: 5
    },
    9: {
        bad: 4,
        good: 5
    },
    10: {
        bad: 4,
        good: 6
    }
};

module.exports.avalonRoles = {
    Merlin: {
        isGood: true,
        name: 'Merlin',
        isSpecial: true
    },
    Percival: {
        isGood: true,
        name: 'Percival',
        isSpecial: true
    },
    Morgana: {
        isGood: false,
        name: 'Morgana',
        isSpecial: true
    },
    Mordred: {
        isGood: false,
        name: 'Mordred',
        isSpecial: true
    },
    Oberon: {
        isGood: false,
        name: 'Oberon',
        isSpecial: true
    },
    RegularGood: {
        isGood: true,
        name: 'RegularGood',
        isSpecial: false
    },
    RegularBad: {
        isGood: false,
        name: 'Regular Bad',
        isSpecial: false
    }
};
