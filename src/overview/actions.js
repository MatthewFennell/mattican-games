const pre = 'OVERVIEW/';

export const CREATE_GAME_REQUEST = `${pre}CREATE_GAME_REQUEST`;
export const CREATE_GAME_SUCCESS = `${pre}CREATE_GAME_SUCCESS`;
export const CREATE_GAME_ERROR = `${pre}CREATE_GAME_ERROR`;

export const createGameRequest = (mode, numberOfPlayers, roles) => ({
    type: CREATE_GAME_REQUEST,
    mode,
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
