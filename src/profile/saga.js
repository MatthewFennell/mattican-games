import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import firebase from 'firebase';
import * as actions from './actions';
import * as profileApi from './api';
import { signOut } from '../auth/actions';

export function* linkProfileToGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        yield firebase.auth().currentUser.linkWithPopup(provider);
    } catch (error) {
        yield put(actions.linkProfileToGoogleError(error));
    }
}

export function* linkProfileToFacebook(api) {
    try {
        const provider = new firebase.auth.FacebookAuthProvider();
        yield firebase.auth().currentUser.linkWithPopup(provider);
        yield call(api.linkFacebookAccount);
    } catch (error) {
        yield put(actions.linkProfileToFacebookError(error));
    }
}

export function* updateDisplayName(api, action) {
    try {
        yield call(api.updateDisplayName, { displayName: action.displayName });
        yield put(actions.updateDisplayNameSuccess());
    } catch (error) {
        yield put(actions.updateDisplayNameError(error));
    }
}

export function* updateTeamName(api, action) {
    try {
        yield call(api.updateTeamName, { teamName: action.teamName });
        yield put(actions.updateTeamNameSuccess());
    } catch (error) {
        yield put(actions.updateTeamNameError(error));
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
        takeEvery(actions.LINK_PROFILE_TO_GOOGLE, linkProfileToGoogle, profileApi),
        takeEvery(actions.LINK_PROFILE_TO_FACEBOOK, linkProfileToFacebook, profileApi),
        takeEvery(actions.UPDATE_DISPLAY_NAME_REQUEST, updateDisplayName, profileApi),
        takeEvery(actions.UPDATE_TEAM_NAME_REQUEST, updateTeamName, profileApi),
        takeEvery(actions.DELETE_ACCOUNT_REQUEST, deleteAccount, profileApi),
        takeEvery(actions.UPDATE_PROFILE_PICTURE_REQUEST, updateProfilePicture, profileApi)
    ]);
}
