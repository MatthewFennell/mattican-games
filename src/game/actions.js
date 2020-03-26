const pre = 'GAME/';

export const GAME_ERROR = `${pre}GAME_ERROR`;
export const CLOSE_GAME_ERROR = `${pre}CLOSE_GAME_ERROR`;

export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;

export const READY_UP_REQUEST = `${pre}READY_UP_REQUEST`;

export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;

export const NOMINATE_PLAYER_FOR_QUEST_REQUEST = `${pre}NOMINATE_PLAYER_FOR_QUEST_REQUEST`;
export const NOMINATE_CHANCELLOR_REQUEST = `${pre}NOMINATE_CHANCELLOR_REQUEST`;

export const CONFIRM_NOMINATIONS_REQUEST = `${pre}CONFIRM_NOMINATIONS_REQUEST`;

export const MAKE_VOTE_REQUEST = `${pre}MAKE_VOTE_REQUEST`;

export const MAKE_QUEST_REQUEST = `${pre}MAKE_QUEST_REQUEST`;

export const GUESS_MERLIN_REQUEST = `${pre}GUESS_MERLIN_REQUEST`;

export const DESTROY_GAME_REQUEST = `${pre}DESTROY_GAME_REQUEST`;

export const LEAVE_MIDGAME_REQUEST = `${pre}LEAVE_MIDGAME_REQUEST`;

export const APPROVE_LEAVE_MIDGAME_REQUEST = `${pre}APPROVE_LEAVE_MIDGAME_REQUEST`;

export const gameError = (error, header) => ({
    type: GAME_ERROR,
    error,
    header
});

export const closeGameError = () => ({
    type: CLOSE_GAME_ERROR
});

export const leaveGameRequest = gameId => ({
    type: LEAVE_GAME_REQUEST,
    gameId
});

export const readyUpRequest = (gameId, isReady) => ({
    type: READY_UP_REQUEST,
    gameId,
    isReady
});

export const startGameRequest = (gameId, mode) => ({
    type: START_GAME_REQUEST,
    gameId,
    mode
});

export const nominatePlayerForQuest = (gameId, player, isOnQuest) => ({
    type: NOMINATE_PLAYER_FOR_QUEST_REQUEST,
    gameId,
    player,
    isOnQuest
});

export const nominateChancellorRequest = (gameId, player) => ({
    type: NOMINATE_CHANCELLOR_REQUEST,
    gameId,
    player
});

export const confirmNominationsRequest = (gameId, nominations) => ({
    type: CONFIRM_NOMINATIONS_REQUEST,
    gameId,
    nominations
});

export const makeVoteRequest = (gameId, vote) => ({
    type: MAKE_VOTE_REQUEST,
    gameId,
    vote
});

export const makeQuestRequest = (gameId, isSuccess) => ({
    type: MAKE_QUEST_REQUEST,
    gameId,
    isSuccess
});

export const guessMerlinRequest = (gameId, merlin) => ({
    type: GUESS_MERLIN_REQUEST,
    gameId,
    merlin
});

export const destroyGameRequest = gameId => ({
    type: DESTROY_GAME_REQUEST,
    gameId
});

export const leaveMidgameRequest = gameId => ({
    type: LEAVE_MIDGAME_REQUEST,
    gameId
});

export const approveLeaveMidgameRequest = (gameId, isApprove) => ({
    type: APPROVE_LEAVE_MIDGAME_REQUEST,
    gameId,
    isApprove
});
