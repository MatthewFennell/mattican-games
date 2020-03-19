const pre = 'GAME/';

export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;
export const LEAVE_GAME_ERROR = `${pre}LEAVE_GAME_ERROR`;

export const READY_UP_REQUEST = `${pre}READY_UP_REQUEST`;
export const READY_UP_ERROR = `${pre}READY_UP_ERROR`;

export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;
export const START_GAME_ERROR = `${pre}START_GAME_ERROR`;

export const leaveGameRequest = gameId => ({
    type: LEAVE_GAME_REQUEST,
    gameId
});

export const leaveGameError = (error, header) => ({
    type: LEAVE_GAME_ERROR,
    error,
    header
});

export const readyUpRequest = (gameId, isReady) => ({
    type: READY_UP_REQUEST,
    gameId,
    isReady
});

export const readyUpError = (error, header) => ({
    type: READY_UP_ERROR,
    error,
    header
});

export const startGameRequest = gameId => ({
    type: START_GAME_REQUEST,
    gameId
});

export const startGameError = (error, header) => ({
    type: START_GAME_ERROR,
    error,
    header
});
