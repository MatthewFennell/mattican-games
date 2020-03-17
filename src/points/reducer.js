import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    userTeams: {}
};

const pointsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_USER_POINTS_FOR_WEEK_SUCCESS: {
        return fp.flow(
            fp.set(`userTeams.${action.userId}.week-${action.week}.fetched`, true),
            fp.set(`userTeams.${action.userId}.week-${action.week}.fetching`, false),
            fp.set(`userTeams.${action.userId}.week-${action.week}.team`, action.team),
        )(state);
    }
    case actions.FETCH_USER_POINTS_FOR_WEEK_ERROR: {
        return fp.set(`userTeams.${action.userId}.week-${action.week}.fetching`, false)(state);
    }
    case actions.FETCH_USER_POINTS_FOR_WEEK_REQUEST: {
        return fp.set(`userTeams.${action.userId}.week-${action.week}.fetching`, true)(state);
    }
    case actions.ALREADY_FETCHED_POINTS_FOR_WEEK: {
        return fp.set(`userTeams.${action.userId}.week-${action.week}.fetching`, false)(state);
    }
    default:
        return state;
    }
};

export default pointsReducer;
