const pre = 'TRANSFERS/';

export const FETCH_ALL_PLAYERS_REQUEST = `${pre}FETCH_ALL_PLAYERS_REQUEST`;
export const FETCH_ALL_PLAYERS_SUCCESS = `${pre}FETCH_ALL_PLAYERS_SUCCESS`;
export const FETCH_ALL_PLAYERS_ERROR = `${pre}FETCH_ALL_PLAYERS_ERROR`;
export const ALREADY_FETCHED_ALL_PLAYERS = `${pre}ALREADY_FETCHED_ALL_PLAYERS`;

export const FETCH_ALL_TEAMS_REQUEST = `${pre}FETCH_ALL_TEAMS_REQUEST`;
export const FETCH_ALL_TEAMS_SUCCESS = `${pre}FETCH_ALL_TEAMS_SUCCESS`;
export const FETCH_ALL_TEAMS_ERROR = `${pre}FETCH_ALL_TEAMS_ERROR`;

export const ADD_PLAYER_TO_CURRENT_TEAM_REQUEST = `${pre}ADD_PLAYER_TO_CURRENT_TEAM_REQUEST`;
export const ADD_PLAYER_TO_CURRENT_TEAM_SUCCESS = `${pre}ADD_PLAYER_TO_CURRENT_TEAM_SUCCESS`;
export const ADD_PLAYER_TO_CURRENT_TEAM_ERROR = `${pre}ADD_PLAYER_TO_CURRENT_TEAM_ERROR`;

export const REMOVE_PLAYER_FROM_CURRENT_TEAM = `${pre}REMOVE_PLAYER_FROM_CURRENT_TEAM`;
export const RESTORE_PLAYER_REQUEST = `${pre}RESTORE_PLAYER_REQUEST`;

export const REPLACE_PLAYER_REQUEST = `${pre}REPLACE_PLAYER_REQUEST`;
export const REPLACE_PLAYER_SUCCESS = `${pre}REPLACE_PLAYER_SUCCESS`;
export const REPLACE_PLAYER_ERROR = `${pre}REPLACE_PLAYER_ERROR`;

export const CLOSE_TRANSFERS_ERROR = `${pre}CLOSE_TRANSFERS_ERROR`;
export const UNDO_TRANSFER_CHANGES = `${pre}UNDO_TRANSFER_CHANGES`;

export const UPDATE_TEAM_REQUEST = `${pre}UPDATE_TEAM_REQUEST`;
export const UPDATE_TEAM_ERROR = `${pre}UPDATE_TEAM_ERROR`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const replacePlayerSuccess = (oldPlayer, newPlayer) => ({
    type: REPLACE_PLAYER_SUCCESS,
    oldPlayer,
    newPlayer
});

export const replacePlayerRequest = (oldPlayer, newPlayer) => ({
    type: REPLACE_PLAYER_REQUEST,
    oldPlayer,
    newPlayer
});

export const replacePlayerError = error => ({
    type: REPLACE_PLAYER_ERROR,
    error
});

export const restorePlayerRequest = playerId => ({
    type: RESTORE_PLAYER_REQUEST,
    playerId
});

export const alreadyFetchedAllPlayers = () => ({
    type: ALREADY_FETCHED_ALL_PLAYERS
});

export const updateTeamRequest = team => ({
    type: UPDATE_TEAM_REQUEST,
    team
});

export const updateTeamError = error => ({
    type: UPDATE_TEAM_ERROR,
    error
});

export const removePlayerFromCurrentTeam = player => ({
    type: REMOVE_PLAYER_FROM_CURRENT_TEAM,
    player
});

export const undoTransferChanges = () => ({
    type: UNDO_TRANSFER_CHANGES
});

export const closeTransfersError = () => ({
    type: CLOSE_TRANSFERS_ERROR
});

export const addPlayerToCurrentTeamError = error => ({
    type: ADD_PLAYER_TO_CURRENT_TEAM_ERROR,
    error
});

export const addPlayerToCurrentTeamRequest = player => ({
    type: ADD_PLAYER_TO_CURRENT_TEAM_REQUEST,
    player
});

export const addPlayerToCurrentTeamSuccess = player => ({
    type: ADD_PLAYER_TO_CURRENT_TEAM_SUCCESS,
    player
});

export const fetchAllPlayersRequest = () => ({
    type: FETCH_ALL_PLAYERS_REQUEST
});

export const fetchAllPlayersSuccess = players => ({
    type: FETCH_ALL_PLAYERS_SUCCESS,
    players
});

export const fetchAllPlayersError = error => ({
    type: FETCH_ALL_PLAYERS_ERROR,
    error
});

export const fetchAllTeamsRequest = () => ({
    type: FETCH_ALL_TEAMS_REQUEST
});

export const fetchAllTeamsSuccess = teams => ({
    type: FETCH_ALL_TEAMS_SUCCESS,
    teams
});

export const fetchAllTeamsError = error => ({
    type: FETCH_ALL_TEAMS_ERROR,
    error
});
