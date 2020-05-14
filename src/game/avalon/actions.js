const pre = 'AVALON/';

export const EDIT_GAME_REQUEST = `${pre}EDIT_GAME_REQUEST`;
export const NOMINATE_PLAYER_FOR_QUEST_REQUEST = `${pre}NOMINATE_PLAYER_FOR_QUEST_REQUEST`;
export const CONFIRM_NOMINATIONS_REQUEST = `${pre}CONFIRM_NOMINATIONS_REQUEST`;
export const MAKE_AVALON_VOTE_REQUEST = `${pre}MAKE_AVALON_VOTE_REQUEST`;
export const MAKE_QUEST_REQUEST = `${pre}MAKE_QUEST_REQUEST`;
export const GUESS_MERLIN_REQUEST = `${pre}GUESS_MERLIN_REQUEST`;

export const editGameRequest = (gameId, numberOfPlayers, roles) => ({
    type: EDIT_GAME_REQUEST,
    gameId,
    numberOfPlayers,
    roles
});

export const nominatePlayerForQuest = (gameId, player, isOnQuest) => ({
    type: NOMINATE_PLAYER_FOR_QUEST_REQUEST,
    gameId,
    player,
    isOnQuest
});

export const confirmNominationsRequest = (gameId, nominations) => ({
    type: CONFIRM_NOMINATIONS_REQUEST,
    gameId,
    nominations
});

export const makeVoteRequest = (gameId, vote) => ({
    type: MAKE_AVALON_VOTE_REQUEST,
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
