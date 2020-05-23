const pre = 'OTHELLO/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;

export const editGameRequest = (gameId, opponent, difficulty) => ({
    type: EDIT_GAME_REQUEST,
    gameId,
    opponent,
    difficulty
});
