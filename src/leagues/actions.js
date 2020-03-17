const pre = 'LEAGUES/';

export const FETCH_LEAGUES_REQUEST = `${pre}FETCH_LEAGUES_REQUEST`;
export const FETCH_LEAGUES_SUCCESS = `${pre}FETCH_LEAGUES_SUCCESS`;
export const FETCH_LEAGUES_ERROR = `${pre}FETCH_LEAGUES_ERROR`;
export const ALREADY_FETCHED_LEAGUES = `${pre}ALREADY_FETCHED_LEAGUES`;

export const FETCH_USERS_IN_LEAGUE_REQUEST = `${pre}FETCH_USERS_IN_LEAGUE_REQUEST`;
export const FETCH_USERS_IN_LEAGUE_SUCCESS = `${pre}FETCH_USERS_IN_LEAGUE_SUCCESS`;
export const FETCH_USERS_IN_LEAGUE_ERROR = `${pre}FETCH_USERS_IN_LEAGUE_ERROR`;
export const ALREADY_FETCHED_USERS_IN_LEAGUE = `${pre}ALREADY_FETCHED_USERS_IN_LEAGUE`;
export const FETCH_MORE_USER_IN_LEAGUE_SUCCESS = `${pre}FETCH_MORE_USER_IN_LEAGUE_SUCCESS`;
export const FETCHED_ALL_USERS_IN_LEAGUE = `${pre}FETCHED_ALL_USERS_IN_LEAGUE`;
export const FETCHING_USERS_IN_LEAGUE = `${pre}FETCHING_USERS_IN_LEAGUE`;

export const CREATE_LEAGUE_REQUEST = `${pre}CREATE_LEAGUE_REQUEST`;
export const CREATE_LEAGUE_SUCCESS = `${pre}CREATE_LEAGUE_SUCCESS`;
export const CREATE_LEAGUE_ERROR = `${pre}CREATE_LEAGUE_ERROR`;
export const CLOSE_CREATE_LEAGUE_ERROR = `${pre}CLOSE_CREATE_LEAGUE_ERROR`;

export const JOIN_LEAGUE_REQUEST = `${pre}JOIN_LEAGUE_REQUEST`;
export const JOIN_LEAGUE_SUCCESS = `${pre}JOIN_LEAGUE_SUCCESS`;
export const JOIN_LEAGUE_ERROR = `${pre}JOIN_LEAGUE_ERROR`;
export const CLOSE_JOIN_LEAGUE_ERROR = `${pre}CLOSE_JOIN_LEAGUE_ERROR`;

export const LEAVE_LEAGUE_REQUEST = `${pre}LEAVE_LEAGUE_REQUEST`;
export const LEAVE_LEAGUE_SUCCESS = `${pre}LEAVE_LEAGUE_SUCCESS`;
export const LEAVE_LEAGUE_ERROR = `${pre}LEAVE_LEAGUE_ERROR`;
export const CLOSE_LEAVE_LEAGUE_ERROR = `${pre}CLOSE_LEAVE_LEAGUE_ERROR`;

export const fetchingUsersInLeague = leagueId => ({
    type: FETCHING_USERS_IN_LEAGUE,
    leagueId
});

export const fetchMoreUsersInLeagueSuccess = (leagueId, newUsers, previousId) => ({
    type: FETCH_MORE_USER_IN_LEAGUE_SUCCESS,
    leagueId,
    newUsers,
    previousId
});

export const fetchedAllUsersInLeague = leagueId => ({
    type: FETCHED_ALL_USERS_IN_LEAGUE,
    leagueId
});

export const alreadyFetchedLeagues = () => ({
    type: ALREADY_FETCHED_LEAGUES
});

export const fetchLeaguesRequest = () => ({
    type: FETCH_LEAGUES_REQUEST
});

export const fetchLeaguesSuccess = leagues => ({
    type: FETCH_LEAGUES_SUCCESS,
    leagues
});

export const fetchLeaguesError = error => ({
    type: FETCH_LEAGUES_ERROR,
    error
});

export const alreadyFetchedUsersInLeague = leagueId => ({
    type: ALREADY_FETCHED_USERS_IN_LEAGUE,
    leagueId
});


export const fetchUsersInLeagueRequest = (
    leagueId, maxGameWeek, requestedSize, pageNumber, rowsPerPage
) => ({
    type: FETCH_USERS_IN_LEAGUE_REQUEST,
    leagueId,
    maxGameWeek,
    requestedSize,
    pageNumber,
    rowsPerPage
});

export const fetchUsersInLeagueSuccess = (leagueId, usersInLeague, numberOfUsers, leagueName) => ({
    type: FETCH_USERS_IN_LEAGUE_SUCCESS,
    leagueId,
    usersInLeague,
    numberOfUsers,
    leagueName
});

export const fetchUsersInLeagueError = (leagueId, error) => ({
    type: FETCH_USERS_IN_LEAGUE_ERROR,
    leagueId,
    error
});

export const createLeagueRequest = (leagueName, startWeek) => ({
    type: CREATE_LEAGUE_REQUEST,
    leagueName,
    startWeek
});

export const createLeagueSuccess = leagues => ({
    type: CREATE_LEAGUE_SUCCESS,
    leagues
});

export const createLeagueError = error => ({
    type: CREATE_LEAGUE_ERROR,
    error
});

export const closeCreateLeagueError = () => ({
    type: CLOSE_CREATE_LEAGUE_ERROR
});

export const joinLeagueRequest = leagueName => ({
    type: JOIN_LEAGUE_REQUEST,
    leagueName
});

export const joinLeagueSuccess = leagues => ({
    type: JOIN_LEAGUE_SUCCESS,
    leagues
});

export const joinLeagueError = error => ({
    type: JOIN_LEAGUE_ERROR,
    error
});

export const closeJoinLeagueError = () => ({
    type: CLOSE_JOIN_LEAGUE_ERROR
});

export const leaveLeagueRequest = leagueId => ({
    type: LEAVE_LEAGUE_REQUEST,
    leagueId
});

export const leaveLeagueSuccess = leagues => ({
    type: LEAVE_LEAGUE_SUCCESS,
    leagues
});

export const leaveLeagueError = error => ({
    type: LEAVE_LEAGUE_ERROR,
    error
});

export const closeLeaveLeagueError = () => ({
    type: CLOSE_LEAVE_LEAGUE_ERROR
});
