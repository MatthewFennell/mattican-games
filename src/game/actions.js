const pre = 'GAME/';

export const GAME_ERROR = `${pre}GAME_ERROR`;
export const CLOSE_GAME_ERROR = `${pre}CLOSE_GAME_ERROR`;

export const LEAVE_GAME_REQUEST = `${pre}LEAVE_GAME_REQUEST`;

export const READY_UP_REQUEST = `${pre}READY_UP_REQUEST`;

export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;

export const NOMINATE_PLAYER_FOR_QUEST_REQUEST = `${pre}NOMINATE_PLAYER_FOR_QUEST_REQUEST`;
export const NOMINATE_CHANCELLOR_REQUEST = `${pre}NOMINATE_CHANCELLOR_REQUEST`;

export const CONFIRM_NOMINATIONS_REQUEST = `${pre}CONFIRM_NOMINATIONS_REQUEST`;
export const CONFIRM_CHANCELLOR_REQUEST = `${pre}CONFIRM_CHANCELLOR_REQUEST`;

export const MAKE_AVALON_VOTE_REQUEST = `${pre}MAKE_AVALON_VOTE_REQUEST`;
export const MAKE_HITLER_VOTE_REQUEST = `${pre}MAKE_HITLER_VOTE_REQUEST`;

export const MAKE_QUEST_REQUEST = `${pre}MAKE_QUEST_REQUEST`;

export const GUESS_MERLIN_REQUEST = `${pre}GUESS_MERLIN_REQUEST`;

export const DESTROY_GAME_REQUEST = `${pre}DESTROY_GAME_REQUEST`;

export const LEAVE_MIDGAME_REQUEST = `${pre}LEAVE_MIDGAME_REQUEST`;

export const APPROVE_LEAVE_MIDGAME_REQUEST = `${pre}APPROVE_LEAVE_MIDGAME_REQUEST`;

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

export const CLOSE_LOOK_AT_INVESTIGATION_REQUEST = `${pre}CLOSE_LOOK_AT_INVESTIGATION_REQUEST`;

export const EDIT_HITLER_GAME_REQUEST = `${pre}EDIT_HITLER_GAME_REQUEST`;

export const EDIT_AVALON_GAME_REQUEST = `${pre}EDIT_AVALON_GAME_REQUEST`;

export const EDIT_DISPLAY_NAME = `${pre}EDIT_DISPLAY_NAME`;

export const ADD_TEAM_REQUEST = `${pre}ADD_TEAM_REQUEST`;

export const JOIN_TEAM_REQUEST = `${pre}JOIN_TEAM_REQUEST`;

export const GOT_WORD_REQUEST = `${pre}GOT_WORD_REQUEST`;

export const SKIP_WORD_WHO_IN_HAT_REQUEST = `${pre}SKIP_WORD_WHO_IN_HAT_REQUEST`;

export const TRASH_WORD_WHO_IN_HAT_REQUEST = `${pre}TRASH_WORD_WHO_IN_HAT_REQUEST`;

export const SET_WORD_CONFIRMED_REQUEST = `${pre}SET_WORD_CONFIRMED_REQUEST`;

export const LEAVE_UNCONSTRAINED_GAME_REQUEST = `${pre}LEAVE_UNCONSTRAINED_GAME_REQUEST`;

export const JOIN_TEAM_MIDGAME_REQUEST = `${pre}JOIN_TEAM_MIDGAME_REQUEST`;

export const RANDOMISE_TEAMS_REQUEST = `${pre}RANDOMISE_TEAMS_REQUEST`;

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

export const nominateChancellorRequest = (gameId, chancellor) => ({
    type: NOMINATE_CHANCELLOR_REQUEST,
    gameId,
    chancellor
});

export const confirmChancellorRequest = gameId => ({
    type: CONFIRM_CHANCELLOR_REQUEST,
    gameId
});

export const confirmNominationsRequest = (gameId, nominations) => ({
    type: CONFIRM_NOMINATIONS_REQUEST,
    gameId,
    nominations
});

export const makeAvalonVoteRequest = (gameId, vote) => ({
    type: MAKE_AVALON_VOTE_REQUEST,
    gameId,
    vote
});

export const makeHitlerVoteRequest = (gameId, vote) => ({
    type: MAKE_HITLER_VOTE_REQUEST,
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

export const confirmInvesigationRequest = gameId => ({
    type: CONFIRM_INVESIGATION_REQUEST,
    gameId
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

export const confirmKillPlayerRequest = gameId => ({
    type: CONFIRM_KILL_PLAYER_REQUEST,
    gameId
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

export const closeLookAtInvestigationRequest = (gameId, isFirst) => ({
    type: CLOSE_LOOK_AT_INVESTIGATION_REQUEST,
    gameId,
    isFirst
});

export const editHitlerGameRequest = (gameId, numberOfPlayers) => ({
    type: EDIT_HITLER_GAME_REQUEST,
    gameId,
    numberOfPlayers
});

export const editAvalonGameRequest = (gameId, numberOfPlayers, roles) => ({
    type: EDIT_AVALON_GAME_REQUEST,
    gameId,
    numberOfPlayers,
    roles
});

export const editDisplayName = (gameId, displayName) => ({
    type: EDIT_DISPLAY_NAME,
    gameId,
    displayName
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
