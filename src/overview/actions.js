const pre = 'OVERVIEW/';

export const CREATE_AVALON_GAME_REQUEST = `${pre}CREATE_AVALON_GAME_REQUEST`;
export const STOP_CREATE_GAME = `${pre}STOP_CREATE_GAME`;
export const CREATE_GAME_SUCCESS = `${pre}CREATE_GAME_SUCCESS`;

export const JOIN_GAME_REQUEST = `${pre}JOIN_GAME_REQUEST`;
export const STOP_JOIN_GAME = `${pre}STOP_JOIN_GAME`;

export const CREATE_HITLER_GAME_REQUEST = `${pre}CREATE_HITLER_GAME_REQUEST`;

export const CREATE_WHO_IN_HAT_GAME_REQUEST = `${pre}CREATE_WHO_IN_HAT_GAME_REQUEST`;

export const JOIN_WHO_IN_HAT_TEAM_MIDGAME_REQUEST = `${pre}JOIN_WHO_IN_HAT_TEAM_MIDGAME_REQUEST`;

export const CREATE_ARTICULATE_GAME_REQUEST = `${pre}CREATE_ARTICULATE_GAME_REQUEST`;

export const createAvalonGameRequest = (mode, gameName, numberOfPlayers, roles) => ({
    type: CREATE_AVALON_GAME_REQUEST,
    mode,
    gameName,
    numberOfPlayers,
    roles
});

export const createHiterGameRequest = (mode, gameName, numberOfPlayers) => ({
    type: CREATE_HITLER_GAME_REQUEST,
    mode,
    gameName,
    numberOfPlayers
});

export const createGameSuccess = () => ({
    type: CREATE_GAME_SUCCESS
});

export const stopCreateGame = () => ({
    type: STOP_CREATE_GAME
});

export const joinGameRequest = (gameId, mode) => ({
    type: JOIN_GAME_REQUEST,
    gameId,
    mode
});

export const stopJoinGame = () => ({
    type: STOP_JOIN_GAME
});

export const createWhoInHatGameRequest = (gameName, skippingRule,
    isCustomNames, scoreCap, timePerRound) => ({
    type: CREATE_WHO_IN_HAT_GAME_REQUEST,
    gameName,
    skippingRule,
    isCustomNames,
    scoreCap,
    timePerRound
});

export const joinWhoInHatTeamMidgameRequest = gameId => ({
    type: JOIN_WHO_IN_HAT_TEAM_MIDGAME_REQUEST,
    gameId
});

export const createArticulateGameRequest = (gameName, skippingRule, timePerRound, scoreCap) => ({
    type: CREATE_ARTICULATE_GAME_REQUEST,
    gameName,
    skippingRule,
    timePerRound,
    scoreCap
});
