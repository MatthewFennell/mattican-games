const pre = 'ARTICULATE/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;
export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;
export const START_ROUND_REQUEST = `${pre}START_ROUND_REQUEST`;
export const LOAD_SUMMARY_REQUEST = `${pre}LOAD_SUMMARY_REQUEST`;
export const CONFIRM_SCORE_REQUEST = `${pre}CONFIRM_SCORE_REQUEST`;
export const SPADE_ROUND_WINNER_REQUEST = `${pre}SPADE_ROUND_WINNER_REQUEST`;
export const CONFIRM_WINNER = `${pre}CONFIRM_WINNER`;

export const editGameRequest = (gameId, skippingRule, timePerRound, scoreCap) => ({
    type: EDIT_GAME_REQUEST,
    gameId,
    skippingRule,
    timePerRound,
    scoreCap
});

export const startGameRequest = gameId => ({
    type: START_GAME_REQUEST,
    gameId
});

export const startRoundRequest = gameId => ({
    type: START_ROUND_REQUEST,
    gameId
});

export const loadSummaryRequest = gameId => ({
    type: LOAD_SUMMARY_REQUEST,
    gameId
});

export const confirmScoreRequest = (gameId, confirmedWords) => ({
    type: CONFIRM_SCORE_REQUEST,
    gameId,
    confirmedWords
});

export const spadeRoundWinnerRequest = (gameId, name) => ({
    type: SPADE_ROUND_WINNER_REQUEST,
    gameId,
    name
});

export const confirmWinner = gameId => ({
    type: CONFIRM_WINNER,
    gameId
});
