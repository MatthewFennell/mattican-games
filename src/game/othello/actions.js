const pre = 'OTHELLO/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;
export const PLACE_DISC_REQUEST = `${pre}PLACE_DISC_REQUEST`;
export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;
export const SET_MAKING_MOVE_ERROR = `${pre}SET_MAKING_MOVE_ERROR`;
export const REGENERATE_COMPUTER_MOVE = `${pre}REGENERATE_COMPUTER_MOVE`;
export const SET_GENERATING_MOVE = `${pre}SET_GENERATING_MOVE`;

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

export const regenerateComputerMove = gameId => ({
    type: REGENERATE_COMPUTER_MOVE,
    gameId
});

export const setGeneratingMove = isGenerating => ({
    type: SET_GENERATING_MOVE,
    isGenerating
});
