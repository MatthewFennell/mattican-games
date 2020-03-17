const pre = 'FIXTURES/';

export const FETCH_FIXTURES_REQUEST = `${pre}FETCH_FIXTURES_REQUEST`;
export const FETCH_FIXTURES_SUCCESS = `${pre}FETCH_FIXTURES_SUCCESS`;
export const FETCH_FIXTURES_ERROR = `${pre}FETCH_FIXTURES_ERROR`;
export const ALREADY_FETCHED_FIXTURES = `${pre}ALREADY_FETCHED_FIXTURES`;

export const SET_MY_TEAM_REQUEST = `${pre}SET_MY_TEAM_REQUEST`;
export const SET_MY_TEAM_ERROR = `${pre}SET_MY_TEAM_ERROR`;

export const FETCH_MY_TEAM_REQUEST = `${pre}FETCH_MY_TEAM_REQUEST`;

export const SET_MY_TEAM = `${pre}SET_MY_TEAM`;

export const SET_FIXTURES_ERROR = `${pre}SET_FIXTURES_ERROR`;
export const CLOSE_FIXTURES_ERROR = `${pre}CLOSE_FIXTURES_ERROR`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const closeFixturesError = () => ({
    type: CLOSE_FIXTURES_ERROR
});

export const setFixturesError = (error, header) => ({
    type: SET_FIXTURES_ERROR,
    error,
    header
});

export const setMyTeam = team => ({
    type: SET_MY_TEAM,
    team
});

export const fetchFixturesRequest = () => ({
    type: FETCH_FIXTURES_REQUEST
});

export const alreadyFetchedFixtures = () => ({
    type: ALREADY_FETCHED_FIXTURES
});

export const fetchFixturesSuccess = fixtures => ({
    type: FETCH_FIXTURES_SUCCESS,
    fixtures
});

export const fetchFixturesError = error => ({
    type: FETCH_FIXTURES_ERROR,
    error
});

export const setMyTeamRequest = team => ({
    type: SET_MY_TEAM_REQUEST,
    team
});

export const setMyTeamError = error => ({
    type: SET_MY_TEAM_ERROR,
    error
});

export const fetchMyTeamRequest = () => ({
    type: FETCH_MY_TEAM_REQUEST
});
