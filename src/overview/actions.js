const pre = 'OVERVIEW/';

export const CREATE_GAME_REQUEST = `${pre}CREATE_GAME_REQUEST`;
export const CREATE_GAME_SUCCESS = `${pre}CREATE_GAME_SUCCESS`;
export const CREATE_GAME_ERROR = `${pre}CREATE_GAME_ERROR`;

export const JOIN_GAME_REQUEST = `${pre}JOIN_GAME_REQUEST`;
export const STOP_JOIN_GAME = `${pre}STOP_JOIN_GAME`;
export const JOIN_GAME_ERROR = `${pre}JOIN_GAME_ERROR`;

export const createGameRequest = (mode, gameName, numberOfPlayers, roles) => ({
    type: CREATE_GAME_REQUEST,
    mode,
    gameName,
    numberOfPlayers,
    roles
});

export const createGameSuccess = () => ({
    type: CREATE_GAME_SUCCESS
});

export const createGameError = (error, header) => ({
    type: CREATE_GAME_ERROR,
    error,
    header
});

export const joinGameRequest = (gameId, mode) => ({
    type: JOIN_GAME_REQUEST,
    gameId,
    mode
});

export const stopJoinGame = () => ({
    type: STOP_JOIN_GAME
});

export const joinGameError = (error, header) => ({
    type: JOIN_GAME_ERROR,
    error,
    header
});
