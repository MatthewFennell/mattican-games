import {
    all, call, takeEvery, put, delay, fork
} from 'redux-saga/effects';
import firebase from 'firebase';
import { push } from 'connected-react-router';
import { constants } from 'react-redux-firebase';
import * as actions from './actions';
import * as authApi from './api';
import * as consts from '../constants';

const actionCodeSettings = {
    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    handleCodeInApp: true
};

export function* signOut() {
    try {
        yield firebase.auth().signOut();
        yield put(actions.signOutSuccess());
    } catch (error) {
        yield put(actions.signOutError(error));
    }
}

export function* setAppLoading() {
    yield put(actions.setLoadingApp(true));
    yield delay(3000);
    yield put(actions.setLoadingApp(false));
}


export function* loggingIn() {
    try {
        yield fork(setAppLoading);
        // const user = yield firebase.auth().currentUser.getIdTokenResult();
        // const rolePermissions = yield call(api.getRolePermissions);
        // yield put(actions.setPermissionsMappingsAndRoles(rolePermissions));

        // yield all(rolePermissions.allRoles.map(role => {
        //     if (user.claims[role]) {
        //         const permissions = rolePermissions.mappings[role];
        //         return put(actions.addPermissions(permissions));
        //     }
        //     return null;
        // }));
        yield put(actions.setLoadedPermissions(true));
        yield put(push(consts.URL.OVERVIEW));
    } catch (error) {
        yield put(actions.signInError(error));
    }
}

export function* signUp(api, action) {
    try {
        yield firebase.auth().createUserWithEmailAndPassword(action.email, action.password);
        yield delay(5000);
        yield call(api.updateDisplayName, ({ displayName: action.displayName }));
    } catch (error) {
        yield put(actions.signUpError(error));
    }
}

export function* signIn(action) {
    try {
        yield firebase
            .auth()
            .signInWithEmailAndPassword(action.email, action.password);
        yield put(actions.signInSuccess());
    } catch (error) {
        yield put(actions.signInError(error));
    }
}

export function* sendResetPasswordEmail(action) {
    try {
        yield firebase.auth().sendPasswordResetEmail(action.email);
    } catch (error) {
        yield put(actions.sendPasswordResetEmailError(error));
    }
}

export function* resendVerificationEmall() {
    try {
        yield firebase.auth().currentUser.sendEmailVerification(actionCodeSettings);
        yield put(actions.resendEmailVerificationSuccess());
    } catch (error) {
        yield put(actions.resendEmailVerificationError(error));
    }
}

export function* editDisabledPage(api, action) {
    try {
        yield call(api.editDisabledPages, ({
            page: action.page,
            isDisabled: action.isDisabled
        }));
    } catch (error) {
        yield put(actions.editDisabledPageError(error));
    }
}

export default function* authSaga() {
    yield all([
        takeEvery(actions.SIGN_OUT, signOut),
        takeEvery(constants.actionTypes.LOGIN, loggingIn, authApi),
        takeEvery(actions.SIGN_UP, signUp, authApi),
        takeEvery(actions.SIGN_IN, signIn),
        takeEvery(actions.SEND_PASSWORD_RESET_EMAIL, sendResetPasswordEmail),
        takeEvery(actions.RESEND_VERIFICATION_EMAIL_REQUEST, resendVerificationEmall),
        takeEvery(actions.EDIT_DISABLED_PAGE_REQUEST, editDisabledPage, authApi)
    ]);
}
