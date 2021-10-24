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
        name: 'RegularBad',
        isSpecial: false
    }
};

module.exports.hitlerRoles = {
    Fascist: 'Fascist',
    Hitler: 'Hitler',
    Liberal: 'Liberal'
};

const fivePlayerGame = {
    1: 2,
    2: 3,
    3: 2,
    4: 3,
    5: 3
};

const sixPlayerGame = {
    1: 2,
    2: 3,
    3: 4,
    4: 3,
    5: 4
};

const sevenPlayerGame = {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 4
};

const eightPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

const ninePlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

const tenPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

module.exports.avalonRounds = {
    5: fivePlayerGame,
    6: sixPlayerGame,
    7: sevenPlayerGame,
    8: eightPlayerGame,
    9: ninePlayerGame,
    10: tenPlayerGame
};

module.exports.avalonGameStatuses = {
    Finished: 'Finished',
    GuessingMerlin: 'GuessingMerlin',
    Nominating: 'Nominating',
    Questing: 'Questing',
    Voting: 'Voting'
};

module.exports.hitlerGameStatuses = {
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

module.exports.whoInHatGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    ScoreCapReached: 'ScoreCapReached',
    NoCardsLeft: 'NoCardsLeft'
};

module.exports.articulateGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    GameFinished: 'GameFinished'
};

module.exports.telestrationGameStatuses = {
    AddingWords: 'AddingWords',
    Drawing: 'Drawing'
};

module.exports.telestrationObjects = ['Dinosaur', 'Pikachu', 'Dragon']

module.exports.articulateCategories = {
    Action: 'Action',
    Nature: 'Nature',
    Person: 'Person',
    Random: 'Random',
    Spade: 'Spade',
    World: 'World',
    Object: 'Object'
};

module.exports.historyTypes = {
    Vote: 'Vote',
    Quest: 'Quest',
    TopCardFlipped: 'TopCardFlipped',
    PlayChancellorCard: 'PlayChancellorCard',
    Investigate: 'Investigate',
    TransferPresident: 'TransferPresident',
    Kill: 'Kill',
    Veto: 'Veto',
    Peek: 'Peek'
};

module.exports.gameModes = {
    Avalon: 'Avalon',
    Hitler: 'Hitler',
    Othello: 'Othello',
    Telestrations: 'Telestrations',
    WhosInTheHat: 'Who\'s in the Hat'
};

const defaultTeamNames = {
    Collywobble: 'Collywobble Clowns',
    Electric: 'Electric Boogaloo',
    TeamZero: 'Noxus',
    UndefinedName: 'Ionia',
    LastTeam: 'Shurima'
};

module.exports.defaultTeamNames = defaultTeamNames;

module.exports.initialTeams = [
    {
        name: defaultTeamNames.Collywobble,
        members: [],
        score: 0,
        previousExplainer: null
    },
    {
        name: defaultTeamNames.Electric,
        members: [],
        score: 0,
        previousExplainer: null
    }
];

module.exports.whoInHatSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

module.exports.articulateSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

module.exports.gameModes = {
    Articulate: 'Articulate',
    Avalon: 'Avalon',
    Hitler: 'Hitler',
    WhosInTheHat: 'Who\'s in the Hat?'
};

module.exports.articulateMaxScore = 15;

const othelloAIDifficulties = {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard'
};

module.exports.othelloAIDifficulties = othelloAIDifficulties;

module.exports.othelloDifficulties = [
    othelloAIDifficulties.Easy,
    othelloAIDifficulties.Medium,
    othelloAIDifficulties.Hard
];

module.exports.othelloPlayerTypes = {
    Human: 'Human',
    Computer: 'Computer'
};

module.exports.statsId = 'game-stats-id';

module.exports.whoInHatNames = ['Superman', 'Mickey Mouse', 'Bugs Bunny', 'Han Solo', 'Peter Pan', 'Indiana Jones', 'Homer Simpson', 'King Kong', 'The Joker', 'Mary Poppins', 'Willy Wonka', 'Scooby-Doo', 'Pikachu', 'Optimus Prime', 'Sonic the Hedgehog', 'Edna Mode', 'Maximus', 'Inspector Clouseau', 'Gromit', 'Primrose Everdeen', 'Trump', 'Cristiano Ronaldo', 'Taylor Swift', 'Bill Gates', 'Nelson Mandela', 'Elvis', 'Greta Thunburg', 'Cleopatra', 'Anne Frank', 'Shakira', 'Coco', 'Time Berners Lee', 'Brad Pitt', 'David Attenborough', 'The Monopoly Man', 'Tinkerbell', 'Boris Johnson', 'Micheal Phelps', 'Pablo Picasso', 'Pele', 'Zeus', 'Loki', 'Roger Federer', 'Will Smith', 'Winston Churchill', 'George Clooney', 'Angelina Jolie', 'Robert de Niro', 'Morgan Freeman', 'Bowser', 'Matt Damon', 'Gary Linekar', 'Alan Shearer', 'Ricky Gervais', 'Jim Carey', 'Dobby', 'George Weasley', 'Thomas Edison', 'Cinderella', 'Rickon Stark', 'Helen of Troy', 'Simon Cowell', 'Sacha Baron Cohen', 'Prince Harry', 'Dwayne Johnson', 'Moana', 'Rihanna', 'Alan Turing', 'Roald Dahl', 'Tom Brady', 'Anya Taylor-Joy', 'Pedro Pascal', 'Gal Gadot', 'Wall-E', 'Jane Austen', 'Zelda', 'Andy Murray', 'Beethover', 'Hans Zimmer', 'Catherine of Aragon', 'Malfoy', 'Jessica Ennis-Hill', 'Steve Redgrave', 'Tiger Woods', 'Usain Bolt'];
