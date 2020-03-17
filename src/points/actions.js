const pre = 'POINTS/';

export const FETCH_USER_POINTS_FOR_WEEK_REQUEST = `${pre}FETCH_USER_POINTS_FOR_WEEK_REQUEST`;
export const FETCH_USER_POINTS_FOR_WEEK_SUCCESS = `${pre}FETCH_USER_POINTS_FOR_WEEK_SUCCESS`;
export const FETCH_USER_POINTS_FOR_WEEK_ERROR = `${pre}FETCH_USER_POINTS_FOR_WEEK_ERROR`;
export const ALREADY_FETCHED_POINTS_FOR_WEEK = `${pre}ALREADY_FETCHED_POINTS_FOR_WEEK`;

export const FETCH_USER_POINTS_FOR_WEEK_REQUEST_BACKGROUND = `${pre}FETCH_USER_POINTS_FOR_WEEK_REQUEST_BACKGROUND`;

export const fetchUserPointsForWeekRequest = (userId, week) => ({
    type: FETCH_USER_POINTS_FOR_WEEK_REQUEST,
    userId,
    week
});

export const fetchUserPointsForWeekRequestBackground = (userId, week) => ({
    type: FETCH_USER_POINTS_FOR_WEEK_REQUEST_BACKGROUND,
    userId,
    week
});

export const fetchUserPointsForWeekSuccess = (userId, week, team) => ({
    type: FETCH_USER_POINTS_FOR_WEEK_SUCCESS,
    userId,
    week,
    team
});

export const fetchUserPointsForWeekError = (userId, week, error) => ({
    type: FETCH_USER_POINTS_FOR_WEEK_ERROR,
    userId,
    week,
    error
});

export const alreadyFetchedPointsForWeek = (userId, week) => ({
    type: ALREADY_FETCHED_POINTS_FOR_WEEK,
    userId,
    week
});
