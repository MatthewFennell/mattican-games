import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    usersWithExtraRoles: [],
    fetchingUsersWithExtraRoles: false,

    successMessage: '',
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS: {
        return {
            ...state,
            usersWithExtraRoles: action.usersWithExtraRoles,
            fetchingUsersWithExtraRoles: false
        };
    }
    case actions.FETCH_USERS_WITH_EXTRA_ROLES_REQUEST: {
        return fp.set('fetchingUsersWithExtraRoles', true)(state);
    }
    case actions.LOAD_USERS_WITH_EXTRA_ROLES: {
        return fp.set('fetchingUsersWithExtraRoles', true)(state);
    }
    case actions.ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES: {
        return fp.set('fetchingUsersWithExtraRoles', false)(state);
    }
    case actions.SET_SUCCESS_MESSAGE: {
        return fp.set('successMessage', action.message)(state);
    }
    case actions.CLOSE_SUCCESS_MESSAGE: {
        return fp.set('successMessage', '')(state);
    }
    case actions.SET_ADMIN_ERROR: {
        return {
            ...state,
            errorMessage: action.error.message,
            errorCode: action.error.code,
            errorHeader: action.header
        };
    }
    case actions.CLOSE_ADMIN_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: '',
            creatingPlayer: false,
            creatingTeam: false,
            deletingPlayer: false,
            deletingTeam: false,
            submittingResult: false,
            triggeringWeek: false,
            fetchingPlayerStats: false,
            fetchingUsersWithExtraRoles: false,
            loadingHighlightsForApproval: false,
            loadingRejectedHighlights: false,
            editingStats: false
        };
    }
    default:
        return state;
    }
};

export default adminReducer;
