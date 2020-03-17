import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    userInfo: { },
    userStats: { },
    maxGameWeek: null
};

const overviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_USER_STATS_REQUEST: {
        return fp.set(`userStats.${action.userId}.fetching`, true)(state);
    }
    case actions.ALREADY_FETCHED_USER_STATS: {
        return fp.set(`userStats.${action.userId}.fetching`, false)(state);
    }
    case actions.FETCH_USER_STATS_SUCCESS: {
        return fp.flow(
            fp.set(`userStats.${action.userId}.remainingBudget`, action.stats.remainingBudget),
            fp.set(`userStats.${action.userId}.remainingTransfers`, action.stats.remainingTransfers),
            fp.set(`userStats.${action.userId}.totalPoints`, action.stats.totalPoints),
            fp.set(`userStats.${action.userId}.fetching`, false),
            fp.set(`userStats.${action.userId}.fetched`, true),
        )(state);
    }
    case actions.FETCH_MAX_GAMEWEEK_SUCCESS: {
        return fp.set('maxGameWeek', action.gameWeek)(state);
    }
    case actions.FETCH_USER_INFO_FOR_WEEK_REQUEST: {
        return fp.set(`userInfo.${action.userId}.week-${action.week}.fetching`, true)(state);
    }
    case actions.FETCH_USER_INFO_FOR_WEEK_SUCCESS: {
        return fp.flow(
            fp.set(`userInfo.${action.userId}.week-${action.week}.weekPoints`, action.userInfo.weekPoints),
            fp.set(`userInfo.${action.userId}.week-${action.week}.averagePoints`, action.userInfo.averagePoints),
            fp.set(`userInfo.${action.userId}.week-${action.week}.highestPoints`, action.userInfo.highestPoints),
            fp.set(`userInfo.${action.userId}.week-${action.week}.fetched`, true),
            fp.set(`userInfo.${action.userId}.week-${action.week}.fetching`, false)
        )(state);
    }
    case actions.ALREADY_FETCHED_USER_INFO_FOR_WEEK: {
        return fp.set(`userInfo.${action.userId}.week-${action.week}.fetching`, false)(state);
    }
    case actions.FETCH_USER_INFO_FOR_WEEK_ERROR: {
        return fp.set(`userInfo.${action.userId}.week-${action.week}.fetching`, false)(state);
    }
    case actions.FETCH_USER_STATS_ERROR: {
        return fp.set(`userStats.${action.userId}.fetching`, false)(state);
    }
    default:
        return state;
    }
};

export default overviewReducer;
