const pre = 'STATS/';

export const FETCH_TEAM_STATS_BY_WEEK_REQUEST = `${pre}FETCH_TEAM_STATS_BY_WEEK_REQUEST`;
export const FETCH_TEAM_STATS_BY_WEEK_SUCCESS = `${pre}FETCH_TEAM_STATS_BY_WEEK_SUCCESS`;
export const FETCH_TEAM_STATS_BY_WEEK_ERROR = `${pre}FETCH_TEAM_STATS_BY_WEEK_ERROR`;

export const fetchTeamStatsByWeekRequest = (teamId, minWeek, maxWeek) => ({
    type: FETCH_TEAM_STATS_BY_WEEK_REQUEST,
    teamId,
    minWeek,
    maxWeek
});

export const fetchTeamStatsByWeekSuccess = (teamId, minWeek, maxWeek, stats) => ({
    type: FETCH_TEAM_STATS_BY_WEEK_SUCCESS,
    teamId,
    minWeek,
    maxWeek,
    stats
});

export const fetchTeamStatsByWeekError = error => ({
    type: FETCH_TEAM_STATS_BY_WEEK_ERROR,
    error
});
