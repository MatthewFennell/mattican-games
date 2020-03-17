
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../../enzyme';
import ManageUsers, { ManageUsersUnconnected } from './ManageUsers';
import { initialState } from '../reducer';
import { initialState as authinitialState } from '../../auth/reducer';

describe('Manage Users', () => {
    it('The Manage Users component renders without crashing', () => {
        const wrapper = shallow(<ManageUsersUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            rollOverToNextYearRequest={noop}
            fetchUsersWithExtraRolesRequest={noop}
            addUserRoleRequest={noop}
            clearDatabaseRequest={noop}
            deleteAllOldUsersRequest={noop}
            removeUserRoleRequest={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Manage Users connected', () => {
    it('Connected manage users', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: initialState,
            auth: authinitialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <ManageUsers />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
