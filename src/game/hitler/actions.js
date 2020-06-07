const pre = 'HITLER/';

export const NOMINATE_CHANCELLOR_REQUEST = `${pre}NOMINATE_CHANCELLOR_REQUEST`;
export const CONFIRM_CHANCELLOR_REQUEST = `${pre}CONFIRM_CHANCELLOR_REQUEST`;
export const MAKE_HITLER_VOTE_REQUEST = `${pre}MAKE_HITLER_VOTE_REQUEST`;
export const GIVE_CARDS_TO_CHANCELLOR_REQUEST = `${pre}GIVE_CARDS_TO_CHANCELLOR_REQUEST`;
export const PLAY_CHANCELLOR_CARD_REQUEST = `${pre}PLAY_CHANCELLOR_CARD_REQUEST`;
export const SELECT_INVESTIGATE_REQUEST = `${pre}SELECT_INVESTIGATE_REQUEST`;
export const CONFIRM_INVESIGATION_REQUEST = `${pre}CONFIRM_INVESIGATION_REQUEST`;
export const MAKE_TEMPORARY_PRESIDENT_REQUEST = `${pre}MAKE_TEMPORARY_PRESIDENT_REQUEST`;
export const CONFIRM_PRESIDENT_REQUEST = `${pre}CONFIRM_PRESIDENT_REQUEST`;
export const KILL_PLAYER_REQUEST = `${pre}KILL_PLAYER_REQUEST`;
export const CONFIRM_KILL_PLAYER_REQUEST = `${pre}CONFIRM_KILL_PLAYER_REQUEST`;
export const INITIATE_VETO_REQUEST = `${pre}INITIATE_VETO_REQUEST`;
export const REPLY_TO_VETO_REQUEST = `${pre}REPLY_TO_VETO_REQUEST`;
export const CLOSE_LOOK_AT_TOP_THREE_REQUEST = `${pre}CLOSE_LOOK_AT_TOP_THREE_REQUEST`;
export const EDIT_HITLER_GAME_REQUEST = `${pre}EDIT_HITLER_GAME_REQUEST`;
export const CLOSE_LOOK_AT_INVESTIGATION_REQUEST = `${pre}CLOSE_LOOK_AT_INVESTIGATION_REQUEST`;

export const nominateChancellorRequest = (gameId, chancellor) => ({
    type: NOMINATE_CHANCELLOR_REQUEST,
    gameId,
    chancellor
});

export const confirmChancellorRequest = (gameId, chancellor) => ({
    type: CONFIRM_CHANCELLOR_REQUEST,
    gameId,
    chancellor
});

export const makeVoteRequest = (gameId, vote) => ({
    type: MAKE_HITLER_VOTE_REQUEST,
    gameId,
    vote
});

export const giveCardsToChancellorRequest = (gameId, cards) => ({
    type: GIVE_CARDS_TO_CHANCELLOR_REQUEST,
    gameId,
    cards
});

export const playChancellorCardRequest = (gameId, card) => ({
    type: PLAY_CHANCELLOR_CARD_REQUEST,
    gameId,
    card
});

export const selectInvestigateRequest = (gameId, player) => ({
    type: SELECT_INVESTIGATE_REQUEST,
    gameId,
    player
});

export const confirmInvesigationRequest = (gameId, playerToInvestigate) => ({
    type: CONFIRM_INVESIGATION_REQUEST,
    gameId,
    playerToInvestigate
});

export const makeTemporaryPresidentRequest = (gameId, player) => ({
    type: MAKE_TEMPORARY_PRESIDENT_REQUEST,
    gameId,
    player
});

export const confirmPresidentRequest = gameId => ({
    type: CONFIRM_PRESIDENT_REQUEST,
    gameId
});

export const killPlayerRequest = (gameId, player) => ({
    type: KILL_PLAYER_REQUEST,
    gameId,
    player
});

export const confirmKillPlayerRequest = (gameId, playerToKill) => ({
    type: CONFIRM_KILL_PLAYER_REQUEST,
    gameId,
    playerToKill
});

export const initiateVetoRequest = gameId => ({
    type: INITIATE_VETO_REQUEST,
    gameId
});

export const replyToVetoRequest = (gameId, isApprove) => ({
    type: REPLY_TO_VETO_REQUEST,
    gameId,
    isApprove
});

export const closeLookAtTopThreeRequest = gameId => ({
    type: CLOSE_LOOK_AT_TOP_THREE_REQUEST,
    gameId
});

export const editGameRequest = (gameId, numberOfPlayers) => ({
    type: EDIT_HITLER_GAME_REQUEST,
    gameId,
    numberOfPlayers
});

export const closeLookAtInvestigationRequest = (gameId, isFirst) => ({
    type: CLOSE_LOOK_AT_INVESTIGATION_REQUEST,
    gameId,
    isFirst
});
