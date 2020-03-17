export const REGION = 'europe-west2';

export const URL = {
    LEAGUES: '/leagues',
    OVERVIEW: '/overview',
    PROFILE: '/profile',
    RESET_PASSWORD: '/reset-password',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    VERIFY_EMAIL: '/need-to-verify-email',
    CURRENT_TEAM: '/current-team',
    POINTS: '/points',
    TRANSFERS: '/transfers',
    STATS: '/stats',
    CHARTS: '/charts',
    HIGHLIGHTS: '/highlights',
    FIXTURES: '/fixtures',
    FEATURE_REQUEST: '/feature-request',

    CREATE_PLAYER: '/create-player',
    DELETE_PLAYER: '/delete-player',
    CREATE_TEAM: '/create-team',
    DELETE_TEAM: '/delete-team',
    SUBMIT_RESULT: '/submit-result',
    TRIGGER_WEEK: '/trigger-week',
    EDIT_PLAYER: '/edit-player',
    APPROVE_HIGHLIGHTS: '/approve-highlights',
    MANAGE_SUBS: '/manage-subs',
    MANAGE_USERS: '/manage-users',
    TOGGLE_PAGES: '/toggle-pages'
};

export const POSITIONS = {
    GOALKEEPER: 'GOALKEEPER',
    DEFENDER: 'DEFENDER',
    MIDFIELDER: 'MIDFIELDER',
    ATTACKER: 'ATTACKER',
    OUTFIELD: 'OUTFIELD'
};

export const POINTS = {
    GOAL: {
        [POSITIONS.ATTACKER]: 4,
        [POSITIONS.MIDFIELDER]: 5,
        [POSITIONS.DEFENDER]: 6,
        [POSITIONS.GOALKEEPER]: 6
    },
    ASSIST: 3,
    CLEAN_SHEET: {
        [POSITIONS.GOALKEEPER]: 6,
        [POSITIONS.DEFENDER]: 4,
        [POSITIONS.MIDFIELDER]: 1,
        [POSITIONS.ATTACKER]: 0
    },
    RED_CARD: -3,
    YELLOW_CARD: -1,
    MOTM: 3,
    DOTD: -3,
    OWN_GOAL: -2,
    PENALTY_SAVE: 3,
    PENALTY_MISS: -3
};

export const maxPerPosition = {
    [POSITIONS.GOALKEEPER]: 1,
    [POSITIONS.DEFENDER]: 5,
    [POSITIONS.MIDFIELDER]: 5,
    [POSITIONS.ATTACKER]: 3
};

export const minPerPosition = {
    [POSITIONS.GOALKEEPER]: 1,
    [POSITIONS.DEFENDER]: 3,
    [POSITIONS.MIDFIELDER]: 3,
    [POSITIONS.ATTACKER]: 1
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
export const matchLengthMinutes = 100;

// Things to fix

// Cancel button focus goes blue?
