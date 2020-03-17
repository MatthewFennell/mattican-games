import {
    all, call, takeEvery, put, select, delay, takeLatest
} from 'redux-saga/effects';
import * as actions from './actions';
import * as adminApi from './api';
import * as selectors from './selectors';
import { successDelay } from '../constants';


export function* usersWithExtraRoles(api) {
    try {
        const alreadyFetched = yield select(selectors.getUsersWithExtraRoles);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const extraRoles = yield call(api.getUsersWithExtraRoles);
            yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        } else {
            yield put(actions.alreadyFetchedUsersWithExtraRoles());
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Fetch User Roles Error'));
    }
}

export function* addUserRole(api, action) {
    try {
        yield put(actions.loadUsersWithExtraRoles());
        yield call(api.addUserRole, ({
            email: action.email,
            role: action.role
        }));
        const extraRoles = yield call(api.getUsersWithExtraRoles);
        yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        yield put(actions.setSuccessMessage('User role successfully added'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Add User Role Error'));
    }
}

export function* removeUserRole(api, action) {
    try {
        yield put(actions.loadUsersWithExtraRoles());
        yield call(api.removeUserRole, ({
            email: action.email,
            role: action.role
        }));
        const extraRoles = yield call(api.getUsersWithExtraRoles);
        yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        yield put(actions.setSuccessMessage('User role successfully removed'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Remove User Role Error'));
    }
}

export default function* adminSaga() {
    yield all([
        takeEvery(actions.FETCH_USERS_WITH_EXTRA_ROLES_REQUEST, usersWithExtraRoles, adminApi),
        takeLatest(actions.ADD_USER_ROLE_REQUEST, addUserRole, adminApi),
        takeLatest(actions.REMOVE_USER_ROLE_REQUEST, removeUserRole, adminApi)
    ]);
}
