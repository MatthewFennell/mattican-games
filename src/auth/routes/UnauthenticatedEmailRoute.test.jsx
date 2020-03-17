
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { noop } from 'lodash';
import { shallow, mount } from '../../enzyme';
import UnauthenticatedEmailRoute, { UnauthenticatedEmailRouteUnconnected } from './UnauthenticatedEmailRoute';
import { initialState } from '../reducer';

const mockfirebaseStore = {
    auth: {
        email: 'email',
        uid: 'uid'
    }
};

describe('Unauthenticated Route', () => {
    it('The Unauthenticated Route component renders without crashing', () => {
        const wrapper = shallow(<UnauthenticatedEmailRouteUnconnected
            component={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Unauthenticated Route connected', () => {
    it('Connected unauthenticated route', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            auth: initialState,
            firebase: mockfirebaseStore
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <UnauthenticatedEmailRoute component={() => <div />} />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
