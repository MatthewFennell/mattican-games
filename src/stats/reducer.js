import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    teamStatsByWeek: {}
};

const statsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_TEAM_STATS_BY_WEEK_REQUEST: {
        const range = fp.range(action.minWeek, action.maxWeek + 1);
        const currentLoading = fp.getOr([], 'fetching')(state.teamStatsByWeek[action.teamId]);
        return fp.set(`teamStatsByWeek.${action.teamId}.fetching`, fp.union(range, currentLoading))(state);
    }
    case actions.FETCH_TEAM_STATS_BY_WEEK_ERROR: {
        return fp.set(`teamStatsByWeek.${action.teamId}.fetching`, [])(state);
    }
    case actions.FETCH_TEAM_STATS_BY_WEEK_SUCCESS: {
        const fetchInfo = property => fp.flow(
            fp.get(action.teamId),
            fp.get(property)
        )(state.teamStatsByWeek) || [];

        const currentStats = fetchInfo('stats');
        const weeksFetched = fetchInfo('weeksFetched');

        return fp.flow(
            fp.set(`teamStatsByWeek.${action.teamId}.stats`, fp.union(currentStats, action.stats)),
            fp.set(`teamStatsByWeek.${action.teamId}.fetching`, state.teamStatsByWeek[action.teamId].fetching.filter(x => x < action.minWeek || x > action.maxWeek)),
            fp.set(`teamStatsByWeek.${action.teamId}.weeksFetched`, fp.union(fp.range(action.minWeek, action.maxWeek + 1), weeksFetched).sort())
        )(state);
    }
    default:
        return state;
    }
};

export default statsReducer;

// TO;DO - refactor so it doesn't need teamStatsByWeek - everything uses it, may as well remove
