const pre = 'ARTICULATE/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;

export const editGameRequest = (gameId, skippingRule, timePerRound, scoreCap) => ({
    type: EDIT_GAME_REQUEST,
    gameId,
    skippingRule,
    timePerRound,
    scoreCap
});
