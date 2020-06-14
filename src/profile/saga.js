import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import firebase from 'firebase';
import * as actions from './actions';
import * as profileApi from './api';
import { signOut } from '../auth/actions';

export function* updateDisplayName(api, action) {
    try {
        yield call(api.updateDisplayName, { displayName: action.displayName });
        yield put(actions.updateDisplayNameSuccess());
    } catch (error) {
        yield put(actions.updateDisplayNameError(error));
    }
}

export function* deleteAccount(api, action) {
    try {
        const currentEmail = firebase.auth().currentUser.email;
        if (currentEmail !== action.email) {
            yield put(actions.deleteAccountError({ code: 'not-found', message: 'That is not your email' }));
        } else {
            yield call(api.deleteUser, { email: action.email });
            yield put(actions.deleteAccountSuccess());
            yield put(signOut());
        }
    } catch (error) {
        yield put(actions.deleteAccountError(error));
    }
}

export function* updateProfilePicture(api, action) {
    try {
        yield call(api.updateProfilePicture, ({
            photoUrl: action.photoUrl
        }));
        const userId = firebase.auth().currentUser.uid;
        yield put(actions.updateProfilePictureSuccess(action.photoUrl, userId));
    } catch (error) {
        yield put(actions.updateProfilePictureError(error));
    }
}

export default function* authSaga() {
    yield all([
        takeEvery(actions.UPDATE_DISPLAY_NAME_REQUEST, updateDisplayName, profileApi),
        takeEvery(actions.DELETE_ACCOUNT_REQUEST, deleteAccount, profileApi),
        takeEvery(actions.UPDATE_PROFILE_PICTURE_REQUEST, updateProfilePicture, profileApi)
    ]);
}
