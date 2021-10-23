const pre = 'TELESTRATION/';

export const ADD_WORD_REQUEST = `${pre}ADD_WORD_REQUEST`;
export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;

export const addWordRequest = (gameId, word) => ({
    type: ADD_WORD_REQUEST,
    gameId,
    word
});

export const startGameRequest = gameId => ({
    type: START_GAME_REQUEST,
    gameId
});
