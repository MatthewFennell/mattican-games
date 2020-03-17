
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import Fixtures, { FixturesUnconnected } from './Fixtures';
import { initialState } from './reducer';

describe('Fixtures', () => {
    it('The Fixtures component renders without crashing', () => {
        const wrapper = shallow(<FixturesUnconnected />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Fixtures connected', () => {
    it('Connected Fixtures', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            fixtures: initialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <Fixtures />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
