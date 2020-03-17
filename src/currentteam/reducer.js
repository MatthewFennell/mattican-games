import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    activeTeam: {}
};

const activeTeamReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_ACTIVE_TEAM_SUCCESS: {
        return fp.flow(
            fp.set(`activeTeam.${action.userId}.players`, action.activeTeam),
            fp.set(`activeTeam.${action.userId}.fetching`, false),
            fp.set(`activeTeam.${action.userId}.fetched`, true),
            fp.set(`activeTeam.${action.userId}.captain`, action.captain),
        )(state);
    }
    case actions.FETCH_ACTIVE_TEAM_ERROR: {
        return fp.set(`activeTeam.${action.userId}.fetching`, false)(state);
    }
    case actions.FETCH_ACTIVE_TEAM_REQUEST: {
        return fp.set(`activeTeam.${action.userId}.fetching`, true)(state);
    }
    case actions.ALREADY_FETCHED_ACTIVE_TEAM: {
        return fp.set(`activeTeam.${action.userId}.fetching`, false)(state);
    }
    default:
        return state;
    }
};

export default activeTeamReducer;
