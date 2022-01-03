import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    updatingDisplayName: false,
    updateDisplayNameError: '',
    updateDisplayNameErrorCode: '',

    deletingAccount: false,
    deleteAccountError: '',
    deleteAccountErrorCode: ''
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
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
