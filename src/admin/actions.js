const pre = 'ADMIN/';

export const FETCH_USERS_WITH_EXTRA_ROLES_REQUEST = `${pre}FETCH_USERS_WITH_EXTRA_ROLES_REQUEST`;
export const FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS = `${pre}FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS`;
export const LOAD_USERS_WITH_EXTRA_ROLES = `${pre}LOAD_USERS_WITH_EXTRA_ROLES`;
export const ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES = `${pre}ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES`;

export const FETCH_INITIAL_USERS_REQUEST = `${pre}FETCH_INITIAL_USERS_REQUEST`;
export const FETCH_INITIAL_USERS_SUCCESS = `${pre}FETCH_INITIAL_USERS_SUCCESS`;

export const ADD_USER_ROLE_REQUEST = `${pre}ADD_USER_ROLE_REQUEST`;
export const REMOVE_USER_ROLE_REQUEST = `${pre}REMOVE_USER_ROLE_REQUEST`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const SET_ADMIN_ERROR = `${pre}SET_ADMIN_ERROR`;
export const CLOSE_ADMIN_ERROR = `${pre}CLOSE_ADMIN_ERROR`;

export const setAdminError = (error, header) => ({
    type: SET_ADMIN_ERROR,
    error,
    header
});

export const closeAdminError = () => ({
    type: CLOSE_ADMIN_ERROR
});

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const alreadyFetchedUsersWithExtraRoles = () => ({
    type: ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES
});

export const loadUsersWithExtraRoles = () => ({
    type: LOAD_USERS_WITH_EXTRA_ROLES
});

export const addUserRoleRequest = (email, role) => ({
    type: ADD_USER_ROLE_REQUEST,
    email,
    role
});

export const removeUserRoleRequest = (email, role) => ({
    type: REMOVE_USER_ROLE_REQUEST,
    email,
    role
});

export const fetchUsersWithExtraRolesRequest = () => ({
    type: FETCH_USERS_WITH_EXTRA_ROLES_REQUEST
});

export const fetchUsersWithExtraRolesSuccess = usersWithExtraRoles => ({
    type: FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS,
    usersWithExtraRoles
});
