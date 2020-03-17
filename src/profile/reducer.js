import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    attemptedEmailToLink: '',
    linkAccountErrorCode: '',
    linkAccountError: '',

    updatingDisplayName: false,
    updateDisplayNameError: '',
    updateDisplayNameErrorCode: '',

    updatingTeamName: false,
    updateTeamNameError: '',
    updateTeamNameErrorCode: '',

    deletingAccount: false,
    deleteAccountError: '',
    deleteAccountErrorCode: ''
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.LINK_PROFILE_TO_FACEBOOK_ERROR: {
        return {
            ...state,
            attemptedEmailToLink: action.error.email,
            linkAccountErrorCode: action.error.code,
            linkAccountError: action.error.message
        };
    }
    case actions.LINK_PROFILE_TO_GOOGLE_ERROR: {
        return {
            ...state,
            attemptedEmailToLink: action.error.email,
            linkAccountErrorCode: action.error.code,
            linkAccountError: action.error.message
        };
    }
    case actions.CLOSE_ACCOUNT_LINK_ERROR: {
        return {
            ...state,
            attemptedEmailToLink: '',
            linkAccountError: '',
            linkAccountErrorCode: ''
        };
    }
    case actions.UPDATE_DISPLAY_NAME_REQUEST: {
        return fp.set('updatingDisplayName', true)(state);
    }
    case actions.UPDATE_DISPLAY_NAME_SUCCESS: {
        return fp.set('updatingDisplayName', false)(state);
    }
    case actions.UPDATE_DISPLAY_NAME_ERROR: {
        return {
            ...state,
            updatingDisplayName: false,
            updateDisplayNameError: action.error.message,
            updateDisplayNameErrorCode: action.error.code
        };
    }
    case actions.CLOSE_DISPLAY_NAME_ERROR: {
        return {
            ...state,
            updateDisplayNameError: '',
            updateDisplayNameErrorCode: ''
        };
    }
    case actions.UPDATE_TEAM_NAME_REQUEST: {
        return fp.set('updatingTeamName', true)(state);
    }
    case actions.UPDATE_TEAM_NAME_SUCCESS: {
        return fp.set('updatingTeamName', false)(state);
    }
    case actions.UPDATE_TEAM_NAME_ERROR: {
        return {
            ...state,
            updatingTeamName: false,
            updateTeamNameError: action.error.message,
            updateTeamNameErrorCode: action.error.code
        };
    }
    case actions.CLOSE_TEAM_NAME_ERROR: {
        return {
            ...state,
            updateTeamNameError: '',
            updateTeamNameErrorCode: ''
        };
    }
    case actions.DELETE_ACCOUNT_ERROR: {
        return {
            ...state,
            deleteAccountError: action.error.message,
            deleteAccountErrorCode: action.error.code
        };
    }
    case actions.CLOSE_DELETE_ACCOUNT_ERROR: {
        return {
            ...state,
            deleteAccountError: '',
            deleteAccountErrorCode: ''
        };
    }
    case actions.DELETE_ACCOUNT_REQUEST: {
        return fp.set('deletingAccount', true)(state);
    }
    case actions.DELETE_ACCOUNT_SUCCESS: {
        return fp.set('deletingAccount', false)(state);
    }
    default:
        return state;
    }
};

export default profileReducer;
