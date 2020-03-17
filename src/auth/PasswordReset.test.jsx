
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../enzyme';
import PasswordReset, { PasswordResetUnconnected } from './PasswordReset';
import { initialState } from './reducer';

describe('Reset Password', () => {
    it('The Reset Password component renders without crashing', () => {
        const wrapper = shallow(<PasswordResetUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            sendPasswordResetEmail={noop}
            closeAuthError={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});


describe('Password Reset connected', () => {
    it('Connected password reset', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            auth: initialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <PasswordReset />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
