const pre = 'AUTH/';

export const SIGN_UP = `${pre}SIGN_UP`;
export const SIGN_UP_ERROR = `${pre}SIGN_UP_ERROR`;
export const VERIFY_EMAIL_ADDRESS = `${pre}VERIFY_EMAIL_ADDRESS`;
export const CLOSE_AUTH_ERROR = `${pre}CLOSE_AUTH_ERROR`;

export const SIGN_OUT = `${pre}SIGN_OUT`;
export const SIGN_OUT_SUCCESS = `${pre}SIGN_OUT_SUCCESS`;
export const SIGN_OUT_ERROR = `${pre}SIGN_OUT_ERROR`;

export const SIGN_IN = `${pre}SIGN_IN`;
export const SIGN_IN_SUCCESS = `${pre}SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${pre}SIGN_IN_ERROR`;

export const LINK_PROFILE_TO_GOOGLE = `${pre}LINK_PROFILE_TO_GOOGLE`;
export const LINK_PROFILE_TO_GOOGLE_ERROR = `${pre}LINK_PROFILE_TO_GOOGLE_ERROR`;

export const LINK_PROFILE_TO_FACEBOOK = `${pre}LINK_PROFILE_TO_FACEBOOK`;
export const LINK_PROFILE_TO_FACEBOOK_ERROR = `${pre}LINK_PROFILE_TO_FACEBOOK_ERROR`;

export const UPDATE_DISPLAY_NAME = `${pre}UPDATE_DISPLAY_NAME`;
export const UPDATE_DISPLAY_NAME_ERROR = `${pre}UPDATE_DISPLAY_NAME_ERROR`;

export const SEND_PASSWORD_RESET_EMAIL = `${pre}SEND_PASSWORD_RESET_EMAIL`;
export const SEND_PASSWORD_RESET_EMAIL_ERROR = `${pre}SEND_PASSWORD_RESET_EMAIL_ERROR`;

export const RESEND_VERIFICATION_EMAIL_REQUEST = `${pre}RESEND_VERIFICATION_EMAIL_REQUEST`;
export const RESEND_VERIFICATION_EMAIL_SUCCESS = `${pre}RESEND_VERIFICATION_EMAIL_SUCCESS`;
export const RESEND_VERIFICATION_EMAIL_ERROR = `${pre}RESEND_VERIFICATION_EMAIL_ERROR`;
export const CLOSE_EMAIL_VERIFICATION_ERROR = `${pre}CLOSE_EMAIL_VERIFICATION_ERROR`;

export const ADD_PERMISSIONS = `${pre}ADD_PERMISSIONS`;
export const SET_LOADED_PERMISSIONS = `${pre}SET_LOADED_PERMISSIONS`;
export const SET_PERMISSIONS_MAPPINGS_AND_ROLES = `${pre}SET_PERMISSIONS_MAPPINGS_AND_ROLES`;

export const EDIT_DISABLED_PAGE_REQUEST = `${pre}EDIT_DISABLED_PAGE_REQUEST`;
export const EDIT_DISABLED_PAGE_ERROR = `${pre}EDIT_DISABLED_PAGE_ERROR`;

export const editDisabledPageRequest = (page, isDisabled) => ({
    type: EDIT_DISABLED_PAGE_REQUEST,
    page,
    isDisabled
});

export const editDisabledPageError = error => ({
    type: EDIT_DISABLED_PAGE_ERROR,
    error
});

export const setPermissionsMappingsAndRoles = authInfo => ({
    type: SET_PERMISSIONS_MAPPINGS_AND_ROLES,
    authInfo
});

export const setLoadedPermissions = loaded => ({
    type: SET_LOADED_PERMISSIONS,
    loaded
});

export const addPermissions = permissions => ({
    type: ADD_PERMISSIONS,
    permissions
});

export const resendEmailVerificationRequest = () => ({
    type: RESEND_VERIFICATION_EMAIL_REQUEST
});

export const resendEmailVerificationSuccess = () => ({
    type: RESEND_VERIFICATION_EMAIL_SUCCESS
});

export const resendEmailVerificationError = error => ({
    type: RESEND_VERIFICATION_EMAIL_ERROR,
    error
});

export const closeEmailVerificationError = () => ({
    type: CLOSE_EMAIL_VERIFICATION_ERROR
});

export const closeAuthError = () => ({
    type: CLOSE_AUTH_ERROR
});

export const updateDisplayName = displayName => ({
    type: UPDATE_DISPLAY_NAME,
    displayName
});

export const updateDisplayNameError = error => ({
    type: UPDATE_DISPLAY_NAME,
    error
});

export const sendPasswordResetEmail = email => ({
    type: SEND_PASSWORD_RESET_EMAIL,
    email
});

export const sendPasswordResetEmailError = error => ({
    type: SEND_PASSWORD_RESET_EMAIL_ERROR,
    error
});

export const linkProfileToGoogle = () => ({
    type: LINK_PROFILE_TO_GOOGLE
});

export const linkProfileToGoogleError = error => ({
    type: LINK_PROFILE_TO_GOOGLE_ERROR,
    error
});

export const linkProfileToFacebook = () => ({
    type: LINK_PROFILE_TO_FACEBOOK
});

export const linkProfileToFacebookError = error => ({
    type: LINK_PROFILE_TO_FACEBOOK_ERROR,
    error
});

export const signUpError = error => ({
    type: SIGN_UP_ERROR,
    error
});

export const signUp = (email, password, displayName) => ({
    type: SIGN_UP,
    email,
    password,
    displayName
});

export const verifyEmailAddress = () => ({
    type: VERIFY_EMAIL_ADDRESS
});

export const signOut = () => ({
    type: SIGN_OUT
});

export const signOutSuccess = () => ({
    type: SIGN_OUT_SUCCESS
});

export const signOutError = error => ({
    type: SIGN_OUT_ERROR,
    error
});

export const signIn = (email, password) => ({
    type: SIGN_IN,
    email,
    password
});

export const signInSuccess = () => ({
    type: SIGN_IN_SUCCESS
});

export const signInError = error => ({
    type: SIGN_IN_ERROR,
    error
});
