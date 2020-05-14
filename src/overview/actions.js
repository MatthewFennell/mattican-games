const pre = 'OVERVIEW/';

export const CREATE_GAME_SUCCESS = `${pre}CREATE_GAME_SUCCESS`;
export const STOP_CREATE_GAME = `${pre}STOP_CREATE_GAME`;
export const JOIN_GAME_REQUEST = `${pre}JOIN_GAME_REQUEST`;
export const STOP_JOIN_GAME = `${pre}STOP_JOIN_GAME`;
export const JOIN_TEAM_MIDGAME_REQUEST = `${pre}JOIN_TEAM_MIDGAME_REQUEST`;

export const CREATE_GAME_REQUEST = `${pre}CREATE_GAME_REQUEST`;

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

export const joinTeamMidgameRequest = gameId => ({
    type: JOIN_TEAM_MIDGAME_REQUEST,
    gameId
});

export const createGameRequest = (mode, gameInfo) => ({
    type: CREATE_GAME_REQUEST,
    mode,
    gameInfo
});
