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

export const articulateGameMode = 'Articulate';
export const avalonGameMode = 'Avalon';
export const hitlerGameMode = 'Hitler';
export const othelloGameMode = 'Othello';
export const telestrations = 'Telestrations';
export const whoInHatGameMode = 'Who\'s in the Hat?';

export const gameModes = {
    Articulate: articulateGameMode,
    Avalon: avalonGameMode,
    Hitler: hitlerGameMode,
    Othello: othelloGameMode,
    Telestrations: telestrations,
    WhosInTheHat: whoInHatGameMode
};

export const hitlerRoles = {
    Fascist: 'Fascist',
    Hitler: 'Hitler',
    Liberal: 'Liberal'
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
        name: 'RegularBad',
        isSpecial: false
    }
};

export const avalonGameStatuses = {
    Nominating: 'Nominating',
    Voting: 'Voting',
    Questing: 'Questing',
    Finished: 'Finished',
    GuessingMerlin: 'GuessingMerlin'
};

export const hitlerGameStatuses = {
    ChancellorDecidingCards: 'ChancellorDecidingCards',
    Finished: 'Finished',
    Nominating: 'Nominating',
    PresidentDecidingCards: 'PresidentDecidingCards',
    Investigate: 'Investigate',
    Kill: 'Kill',
    Peek: 'Peek',
    Transfer: 'Transfer',
    Voting: 'Voting',
    TemporaryPresident: 'TemporaryPresident'
};

export const whoInHatGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    ScoreCapReached: 'ScoreCapReached',
    NoCardsLeft: 'NoCardsLeft'
};

export const telestrationGameStatuses = {
    AddingWords: 'AddingWords',
    Drawing: 'Drawing'
};

export const articulateGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    GameFinished: 'GameFinished'
};

// round -> num players
export const fivePlayerGame = {
    1: 2,
    2: 3,
    3: 2,
    4: 3,
    5: 3
};

export const sixPlayerGame = {
    1: 2,
    2: 3,
    3: 4,
    4: 3,
    5: 4
};

export const sevenPlayerGame = {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 4
};

export const eightPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

export const ninePlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

export const tenPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

export const avalonRounds = {
    5: fivePlayerGame,
    6: sixPlayerGame,
    7: sevenPlayerGame,
    8: eightPlayerGame,
    9: ninePlayerGame,
    10: tenPlayerGame
};

export const historyTypes = {
    Vote: 'Vote',
    Quest: 'Quest',
    TopCardFlipped: 'TopCardFlipped',
    PlayChancellorCard: 'PlayChancellorCard',
    Investigate: 'Investigate',
    TransferPresident: 'TransferPresident',
    Veto: 'Veto',
    Peek: 'Peek',
    Kill: 'Kill'
};

export const whoInHatSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

export const articulateSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

export const articulateCategories = {
    Action: 'Action',
    Nature: 'Nature',
    Person: 'Person',
    Random: 'Random',
    Spade: 'Spade',
    World: 'World',
    Object: 'Object'
};

export const articulateMaxScore = 20;

export const othelloPlayerTypes = {
    Human: 'Human',
    Computer: 'Computer'
};

export const othelloAIDifficulties = {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard'
};

export const othelloDifficulties = [
    othelloAIDifficulties.Easy,
    othelloAIDifficulties.Medium,
    othelloAIDifficulties.Hard
];
