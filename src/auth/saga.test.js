import { push } from 'connected-react-router';
import firebase from 'firebase';
import { noop } from 'lodash';
import { constants } from 'react-redux-firebase';
import { expectSaga } from 'redux-saga-test-plan';
import * as consts from '../constants';
import * as actions from './actions';
import * as sagas from './saga';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const adminPermissions = ['PERMISSION_ONE', 'PERMISSION_TWO'];
const editorPermissions = ['PERMISSION_FOUR', 'PERMISSION_FIVE'];

const rolePermissions = {
    mappings: {
        ADMIN: adminPermissions,
        MAINTAINER: ['PERMISSION_THREE', 'PERMISSION_FOUR'],
        EDITOR: editorPermissions
    },
    allRoles: ['ADMIN', 'MAINTAINER', 'EDITOR']
};

const api = {
    getRolePermissions: () => rolePermissions,
    updateDisplayName: noop
};

describe('Auth saga', () => {
    const onAuthStateChanged = jest.fn();

    const getRedirectResult = jest.fn(() => Promise.resolve({
        user: {
            displayName: 'redirectResultTestDisplayName',
            email: 'redirectTest@test.com',
            emailVerified: true
        }
    }));

    const sendEmailVerification = jest.fn(() => Promise.resolve('result of sendEmailVerification'));
    const signOut = jest.fn(() => Promise.resolve('result of sendEmailVerification'));

    const sendPasswordResetEmail = jest.fn(() => Promise.resolve());

    const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve('result of createUserWithEmailAndPassword'));

    const signInWithEmailAndPassword = jest.fn(() => Promise.resolve('result of signInWithEmailAndPassword'));

    const signInWithRedirect = jest.fn(() => Promise.resolve('result of signInWithRedirect'));

    jest.spyOn(firebase, 'initializeApp')
        .mockImplementation(() => ({
            auth: () => ({
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                currentUser: {
                    sendEmailVerification
                },
                signInWithRedirect,
                signOut
            })
        }));

    jest.spyOn(firebase, 'auth').mockImplementation(() => ({
        onAuthStateChanged,
        currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true,
            providerData: ['google', 'facebook'],
            sendEmailVerification: noop,
            getIdTokenResult: () => ({
                claims: {
                    ADMIN: true,
                    EDITOR: true
                }
            })
        },
        getRedirectResult,
        sendPasswordResetEmail,
        signOut,
        createUserWithEmailAndPassword: noop,
        signInWithEmailAndPassword: noop

    }));

    firebase.auth.FacebookAuthProvider = jest.fn(() => {});
    firebase.auth.GoogleAuthProvider = jest.fn(() => {});

    firebase.auth().signOut = jest.fn(noop);

    it('sign out success', () => {
        const action = actions.signOut();
        return expectSaga(sagas.signOut, api, action)
            .put(actions.signOutSuccess())
            .run();
    });

    it('logging in email verified', () => {
        const action = {
            type: constants.actionTypes.LOGIN,
            auth: {
                emailVerified: true
            }
        };
        return expectSaga(sagas.loggingIn, api, action)
            .not.put(push(consts.URL.VERIFY_EMAIL))
            .run();
    });

    it('sign up', () => {
        const action = actions.signUp('email', 'password', 'display');
        return expectSaga(sagas.signUp, api, action)
            .run();
    });

    it('sign in', () => {
        const action = actions.signIn('email', 'password');
        return expectSaga(sagas.signIn, api, action)
            .put(actions.signInSuccess())
            .run();
    });

    it('resend email verification', () => {
        const action = actions.resendEmailVerificationRequest();
        return expectSaga(sagas.resendVerificationEmall, api, action)
            .put(actions.resendEmailVerificationSuccess())
            .run();
    });
});
