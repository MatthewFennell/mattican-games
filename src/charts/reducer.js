import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    allTeams: [],
    fetchingAllTeams: false
};

const chartsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_ALL_TEAMS_REQUEST: {
        return fp.set('fetchingAllTeams', true)(state);
    }
    case actions.FETCH_ALL_TEAMS_SUCCESS: {
        return {
            ...state,
            allTeams: action.allTeams,
            fetchingAllTeams: false
        };
    }
    case actions.FETCH_ALL_TEAMS_ERROR: {
        return fp.set('fetchingAllTeams', false)(state);
    }
    case actions.ALREADY_FETCHED_TEANS: {
        return fp.set('fetchingAllTeams', false)(state);
    }
    default:
        return state;
    }
};

export default chartsReducer;
