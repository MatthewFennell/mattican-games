const pre = 'CURRENT_TEAM/';

export const RELOAD_ACTIVE_TEAM_REQUEST = `${pre}RELOAD_ACTIVE_TEAM_REQUEST`;
export const FETCH_ACTIVE_TEAM_REQUEST = `${pre}FETCH_ACTIVE_TEAM_REQUEST`;
export const FETCH_ACTIVE_TEAM_SUCCESS = `${pre}FETCH_ACTIVE_TEAM_SUCCESS`;
export const FETCH_ACTIVE_TEAM_ERROR = `${pre}FETCH_ACTIVE_TEAM_ERROR`;
export const ALREADY_FETCHED_ACTIVE_TEAM = `${pre}ALREADY_FETCHED_ACTIVE_TEAM`;

export const MAKE_CAPTAIN_REQUEST = `${pre}MAKE_CAPTAIN_REQUEST`;
export const MAKE_CAPTAIN_ERROR = `${pre}MAKE_CAPTAIN_ERROR`;

export const makeCaptainError = error => ({
    type: MAKE_CAPTAIN_ERROR,
    error
});

export const makeCaptainRequest = playerId => ({
    type: MAKE_CAPTAIN_REQUEST,
    playerId
});

export const fetchActiveTeamRequest = userId => ({
    type: FETCH_ACTIVE_TEAM_REQUEST,
    userId
});

export const reloadActiveTeamRequest = userId => ({
    type: RELOAD_ACTIVE_TEAM_REQUEST,
    userId
});

export const fetchActiveTeamError = (userId, error) => ({
    type: FETCH_ACTIVE_TEAM_ERROR,
    userId,
    error
});

export const fetchActiveTeamSuccess = (userId, activeTeam, captain) => ({
    type: FETCH_ACTIVE_TEAM_SUCCESS,
    userId,
    activeTeam,
    captain
});

export const alreadyFetchedActiveTeam = userId => ({
    type: ALREADY_FETCHED_ACTIVE_TEAM,
    userId
});
