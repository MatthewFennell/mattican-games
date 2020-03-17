import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    authError: null,

    passwordResetErrorCode: '',
    passwordResetError: '',

    signUpErrorCode: '',
    signUpError: '',

    signInErrorCode: '',
    signInError: '',

    sendingEmailVerification: false,

    userPermissions: [],
    loadedPermissions: false,

    resendVerificationEmailError: '',
    resendVerificationEmailErrorCode: '',

    permissionMappings: {},
    allRoles: [],

    disabledPages: ['only one']
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SIGN_UP_ERROR: {
        return {
            ...state,
            signUpError: action.error.message,
            signUpErrorCode: action.error.code
        };
    }
    case actions.SIGN_IN_ERROR: {
        return {
            ...state,
            signInError: action.error.message,
            signInErrorCode: action.error.code
        };
    }
    case actions.SEND_PASSWORD_RESET_EMAIL_ERROR: {
        return {
            ...state,
            passwordResetError: action.error.message,
            passwordResetErrorCode: action.error.code
        };
    }
    case actions.RESEND_VERIFICATION_EMAIL_REQUEST: {
        return fp.set('sendingEmailVerification', true)(state);
    }
    case actions.RESEND_VERIFICATION_EMAIL_SUCCESS: {
        return fp.set('sendingEmailVerification', false)(state);
    }
    case actions.RESEND_VERIFICATION_EMAIL_ERROR: {
        return {
            ...state,
            sendingEmailVerification: false,
            resendVerificationEmailError: action.error.message,
            resendVerificationEmailErrorCode: action.error.code
        };
    }
    case actions.CLOSE_EMAIL_VERIFICATION_ERROR: {
        return {
            ...state,
            resendVerificationEmailError: '',
            resendVerificationEmailErrorCode: ''
        };
    }
    case actions.ADD_PERMISSIONS: {
        return fp.set('userPermissions', fp.union(action.permissions)(state.userPermissions))(state);
    }
    case actions.SET_LOADED_PERMISSIONS: {
        return fp.set('loadedPermissions', action.loaded)(state);
    }
    case actions.SET_PERMISSIONS_MAPPINGS_AND_ROLES: {
        return {
            ...state,
            permissionMappings: action.authInfo.mappings,
            allRoles: action.authInfo.allRoles
        };
    }
    case actions.CLOSE_AUTH_ERROR: {
        return {
            ...state,
            signUpError: '',
            signUpErrorCode: '',
            signInError: '',
            signInErrorCode: ''
        };
    }
    default:
        return state;
    }
};

export default authReducer;
