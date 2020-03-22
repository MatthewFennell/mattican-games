const pre = 'GAME/';

export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;
export const LEAVE_GAME_ERROR = `${pre}LEAVE_GAME_ERROR`;

export const READY_UP_REQUEST = `${pre}READY_UP_REQUEST`;
export const READY_UP_ERROR = `${pre}READY_UP_ERROR`;

export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;
export const START_GAME_ERROR = `${pre}START_GAME_ERROR`;

export const NOMINATE_PLAYER_FOR_QUEST_REQUEST = `${pre}NOMINATE_PLAYER_FOR_QUEST_REQUEST`;
export const NOMINATE_PLAYER_FOR_QUEST_ERROR = `${pre}NOMINATE_PLAYER_FOR_QUEST_ERROR`;

export const CONFIRM_NOMINATIONS_REQUEST = `${pre}CONFIRM_NOMINATIONS_REQUEST`;
export const CONFIRM_NOMINATIONS_ERROR = `${pre}CONFIRM_NOMINATIONS_ERROR`;

export const MAKE_VOTE_REQUEST = `${pre}MAKE_VOTE_REQUEST`;
export const MAKE_VOTE_ERROR = `${pre}MAKE_VOTE_ERROR`;

export const MAKE_QUEST_REQUEST = `${pre}MAKE_QUEST_REQUEST`;
export const MAKE_QUEST_ERROR = `${pre}MAKE_QUEST_ERROR`;

export const GUESS_MERLIN_REQUEST = `${pre}GUESS_MERLIN_REQUEST`;
export const GUESS_MERLIN_ERROR = `${pre}GUESS_MERLIN_ERROR`;

export const DESTROY_GAME_REQUEST = `${pre}DESTROY_GAME_REQUEST`;
export const DESTROY_GAME_ERROR = `${pre}DESTROY_GAME_ERROR`;

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

export const nominatePlayerForQuest = (gameId, player, isOnQuest) => ({
    type: NOMINATE_PLAYER_FOR_QUEST_REQUEST,
    gameId,
    player,
    isOnQuest
});

export const nominatePlayerForError = (error, header) => ({
    type: NOMINATE_PLAYER_FOR_QUEST_ERROR,
    error,
    header
});

export const confirmNominationsRequest = (gameId, nominations) => ({
    type: CONFIRM_NOMINATIONS_REQUEST,
    gameId,
    nominations
});

export const confirmNominationsError = (error, header) => ({
    type: CONFIRM_NOMINATIONS_ERROR,
    error,
    header
});

export const makeVoteRequest = (gameId, vote) => ({
    type: MAKE_VOTE_REQUEST,
    gameId,
    vote
});

export const makeVoteError = (error, header) => ({
    type: MAKE_VOTE_ERROR,
    error,
    header
});

export const makeQuestRequest = (gameId, isSuccess) => ({
    type: MAKE_QUEST_REQUEST,
    gameId,
    isSuccess
});

export const makeQuestError = (error, header) => ({
    type: MAKE_QUEST_ERROR,
    error,
    header
});

export const guessMerlinRequest = (gameId, merlin) => ({
    type: GUESS_MERLIN_REQUEST,
    gameId,
    merlin
});

export const guessMerlinError = (error, header) => ({
    type: GUESS_MERLIN_ERROR,
    error,
    header
});

export const destroyGameRequest = gameId => ({
    type: DESTROY_GAME_REQUEST,
    gameId
});

export const destroyGameError = (error, header) => ({
    type: DESTROY_GAME_ERROR,
    error,
    header
});
