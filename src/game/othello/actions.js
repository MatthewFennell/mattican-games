const pre = 'OTHELLO/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;
export const PLACE_DISC_REQUEST = `${pre}PLACE_DISC_REQUEST`;
export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;

export const editGameRequest = (gameId, opponent, difficulty) => ({
    type: EDIT_GAME_REQUEST,
    gameId,
    opponent,
    difficulty
});

export const placeDiscRequest = (gameId, row, column) => ({
    type: PLACE_DISC_REQUEST,
    gameId,
    row,
    column
});

export const leaveGameRequest = gameId => ({
    type: LEAVE_GAME_REQUEST,
    gameId
});
