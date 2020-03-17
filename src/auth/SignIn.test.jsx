
import firebase from 'firebase';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from '../enzyme';
import SignIn from './SignIn';

beforeAll(() => {
    firebase.auth = jest.fn().mockReturnValue({
        currentUser: true
    });
    firebase.auth.GoogleAuthProvider = 'GoogleProvider';
    firebase.auth.FacebookAuthProvider = 'FacebookProvider';
    firebase.auth.TwitterAuthProvider = 'TwitterProvider';
});

const mockStore = configureMockStore();

const state = {
    auth: {
        signInError: '',
        signInErrorCode: ''
    }
};

const store = mockStore(() => state);

describe('Sign In', () => {
    it('The Sign In component renders without crashing', () => {
        expect(() => shallow(
            <Provider store={store}>
                <Router>
                    <SignIn />
                </Router>
            </Provider>
        )).not.toThrow();
    });
});
