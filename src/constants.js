export const REGION = 'europe-west2';

export const URL = {
    OVERVIEW: '/overview',
    PROFILE: '/profile',
    RESET_PASSWORD: '/reset-password',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    VERIFY_EMAIL: '/need-to-verify-email',
    MANAGE_USERS: '/manage-users',
    GAME: '/game'
};

// KEEP IN SYNC WITH SERVER
// This is the list of all existing permissions
// src/functions/constants
export const PERMISSIONS = {
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

export const successDelay = 3500;

export const gameModes = {
    Avalon: 'Avalon'
};

export const avalonRoles = {
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
