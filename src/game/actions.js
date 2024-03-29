const pre = 'COMMON/';

export const GAME_ERROR = `${pre}GAME_ERROR`;
export const CLOSE_GAME_ERROR = `${pre}CLOSE_GAME_ERROR`;
export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;
export const READY_UP_REQUEST = `${pre}READY_UP_REQUEST`;
export const START_ANY_GAME_REQUEST = `${pre}START_ANY_GAME_REQUEST`;
export const DESTROY_GAME_REQUEST = `${pre}DESTROY_GAME_REQUEST`;
export const LEAVE_MIDGAME_REQUEST = `${pre}LEAVE_MIDGAME_REQUEST`;
export const APPROVE_LEAVE_MIDGAME_REQUEST = `${pre}APPROVE_LEAVE_MIDGAME_REQUEST`;
export const EDIT_DISPLAY_NAME = `${pre}EDIT_DISPLAY_NAME`;
export const ADD_TEAM_REQUEST = `${pre}ADD_TEAM_REQUEST`;
export const JOIN_TEAM_REQUEST = `${pre}JOIN_TEAM_REQUEST`;
export const GOT_WORD_REQUEST = `${pre}GOT_WORD_REQUEST`;
export const SKIP_WORD_WHO_IN_HAT_REQUEST = `${pre}SKIP_WORD_WHO_IN_HAT_REQUEST`;
export const TRASH_WORD_WHO_IN_HAT_REQUEST = `${pre}TRASH_WORD_WHO_IN_HAT_REQUEST`;
export const SET_WORD_CONFIRMED_REQUEST = `${pre}SET_WORD_CONFIRMED_REQUEST`;
export const LEAVE_UNCONSTRAINED_GAME_REQUEST = `${pre}LEAVE_UNCONSTRAINED_GAME_REQUEST`;
export const CANCEL_LEAVE_GAME = `${pre}CANCEL_LEAVE_GAME`;
export const JOIN_TEAM_MIDGAME_REQUEST = `${pre}JOIN_TEAM_MIDGAME_REQUEST`;
export const RANDOMISE_TEAMS_REQUEST = `${pre}RANDOMISE_TEAMS_REQUEST`;
export const REALIGN_CONFIRMED_WORDS = `${pre}REALIGN_CONFIRMED_WORDS`;
export const SET_IS_RANDOMISING_TEAMS = `${pre}SET_IS_RANDOMISING_TEAMS`;
export const SET_IS_ADDING_TEAM = `${pre}SET_IS_ADDING_TEAM`;
export const SET_IS_APPROVING_LEAVE_MIDGAME = `${pre}SET_IS_APPROVING_LEAVE_MIDGAME`;
export const DELETE_GAME_REQUEST = `${pre}DELETE_GAME_REQUEST`;
export const CANCEL_DELETING_GAME = `${pre}CANCEL_DELETING_GAME`;
export const SET_IS_STARTING_GAME = `${pre}SET_IS_STARTING_GAME`;
export const CANCEL_EDITING_DISPLAY_NAME = `${pre}CANCEL_EDITING_DISPLAY_NAME`;
export const PLAY_AGAIN_REQUEST = `${pre}PLAY_AGAIN_REQUEST`;
export const CANCEL_PLAY_AGAIN = `${pre}CANCEL_PLAY_AGAIN`;
export const KICK_USER_REQUEST = `${pre}KICK_USER_REQUEST`;
export const CANCEL_KICK_USER = `${pre}CANCEL_KICK_USER`;
export const SET_IS_DESTROYING_GAME = `${pre}SET_IS_DESTROYING_GAME`;
export const SET_IS_LEAVING_GAME = `${pre}SET_IS_LEAVING_GAME`;

export const setIsApprovingLeaveMidgame = isApproving => ({
    type: SET_IS_APPROVING_LEAVE_MIDGAME,
    isApproving
});

export const setIsAddingTeam = isAdding => ({
    type: SET_IS_ADDING_TEAM,
    isAdding
});

export const setIsRandomisingTeams = isRandomising => ({
    type: SET_IS_RANDOMISING_TEAMS,
    isRandomising
});

export const realignConfirmedWords = (gameId, confirmedWords) => ({
    type: REALIGN_CONFIRMED_WORDS,
    gameId,
    confirmedWords
});

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

export const startAnyGameRequest = (gameId, mode) => ({
    type: START_ANY_GAME_REQUEST,
    gameId,
    mode
});

export const destroyGameRequest = gameId => ({
    type: DESTROY_GAME_REQUEST,
    gameId
});

export const leaveMidgameRequest = (gameId, mode) => ({
    type: LEAVE_MIDGAME_REQUEST,
    gameId,
    mode
});

export const approveLeaveMidgameRequest = (gameId, isApprove) => ({
    type: APPROVE_LEAVE_MIDGAME_REQUEST,
    gameId,
    isApprove
});

export const editDisplayName = (gameId, displayName) => ({
    type: EDIT_DISPLAY_NAME,
    gameId,
    displayName
});

export const cancelEditingDisplayName = () => ({
    type: CANCEL_EDITING_DISPLAY_NAME
});

export const addTeamRequest = (gameId, teamName) => ({
    type: ADD_TEAM_REQUEST,
    gameId,
    teamName
});

export const joinTeamRequest = (gameId, teamName) => ({
    type: JOIN_TEAM_REQUEST,
    gameId,
    teamName
});

export const gotWordRequest = (gameId, word) => ({
    type: GOT_WORD_REQUEST,
    gameId,
    word
});

export const skipWordRequest = (gameId, word) => ({
    type: SKIP_WORD_WHO_IN_HAT_REQUEST,
    gameId,
    word
});

export const trashWordRequest = (gameId, word) => ({
    type: TRASH_WORD_WHO_IN_HAT_REQUEST,
    gameId,
    word
});

export const setWordConfirmedRequest = (gameId, word, isConfirmed) => ({
    type: SET_WORD_CONFIRMED_REQUEST,
    gameId,
    word,
    isConfirmed
});

export const leaveUnconstrainedGameRequest = gameId => ({
    type: LEAVE_UNCONSTRAINED_GAME_REQUEST,
    gameId
});

export const cancelLeaveGame = () => ({
    type: CANCEL_LEAVE_GAME
});

export const joinTeamMidgameRequest = (gameId, teamName) => ({
    type: JOIN_TEAM_MIDGAME_REQUEST,
    gameId,
    teamName
});

export const randomiseTeamsRequest = (gameId, numberOfTeams) => ({
    type: RANDOMISE_TEAMS_REQUEST,
    gameId,
    numberOfTeams
});

export const deleteGameRequest = (gameId, gameMode) => ({
    type: DELETE_GAME_REQUEST,
    gameId,
    gameMode
});

export const cancelDeletingGame = () => ({
    type: CANCEL_DELETING_GAME
});

export const setIsStartingGame = isStarting => ({
    type: SET_IS_STARTING_GAME,
    isStarting
});

export const playAgainRequest = (gameId, mode) => ({
    type: PLAY_AGAIN_REQUEST,
    gameId,
    mode
});

export const cancelPlayAgain = () => ({
    type: CANCEL_PLAY_AGAIN
});

export const kickUserRequest = (gameId, userId) => ({
    type: KICK_USER_REQUEST,
    gameId,
    userId
});

export const cancelKickUser = () => ({
    type: CANCEL_KICK_USER
});

export const setIsDestroyingGame = isDestroyingGame => ({
    type: SET_IS_DESTROYING_GAME,
    isDestroyingGame
});

export const setIsLeavingGame = isLeavingGame => ({
    type: SET_IS_LEAVING_GAME,
    isLeavingGame
});
