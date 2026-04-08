
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import Profile, { ProfileUnconnected } from './Profile';
import { initialState } from './reducer';

jest.mock('firebase', () => {
    const sendEmailVerification = jest.fn(() => Promise.resolve('result of sendEmailVerification'));
    const sendPasswordResetEmail = jest.fn(() => Promise.resolve());
    const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve('result of createUserWithEmailAndPassword'));
    const signInWithEmailAndPassword = jest.fn(() => Promise.resolve('result of signInWithEmailAndPassword'));
    const signInWithRedirect = jest.fn(() => Promise.resolve('result of signInWithRedirect'));
    const onAuthStateChanged = jest.fn();
    const getRedirectResult = jest.fn(() => Promise.resolve({
        user: {
            displayName: 'redirectResultTestDisplayName',
            email: 'redirectTest@test.com',
            emailVerified: true
        }
    }));

    const auth = () => ({
        onAuthStateChanged,
        currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true,
            providerData: ['google', 'facebook'],
            sendEmailVerification
        },
        getRedirectResult,
        sendPasswordResetEmail,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithRedirect
    });
    auth.FacebookAuthProvider = jest.fn(() => {});
    auth.GoogleAuthProvider = jest.fn(() => {});

    return {
        __esModule: true,
        default: { initializeApp: jest.fn(), auth },
        initializeApp: jest.fn(),
        auth
    };
});

const mockHistory = {
    location: {
        pathname: 'pathname'
    },
    push: noop
};

const mockfirebaseStore = {
    auth: {
        email: 'email',
        uid: 'uid'
    }
};

describe('Profile', () => {
    it('The Profile component renders without crashing', () => {
        const wrapper = shallow(<ProfileUnconnected
            updateProfilePictureRequest={noop}
            updateTeamNameRequest={noop}
            updateDisplayNameRequest={noop}
            linkProfileToGoogle={noop}
            linkProfileToFacebook={noop}
            deleteAccountRequest={noop}
            closeTeamNameError={noop}
            closeDisplayNameError={noop}
            closeDeleteAccountError={noop}
            closeAccountLinkError={noop}
            history={mockHistory}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Profile connected', () => {
    it('Connected profile', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            firebase: mockfirebaseStore,
            history: mockHistory,
            profile: initialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <Profile />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
