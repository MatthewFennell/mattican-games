
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import Leagues, { LeaguesUnconnected } from './Leagues';
import { initialState } from './reducer';

const mockHistory = {
    location: {
        pathname: 'pathname'
    },
    push: noop
};

describe('Leagues', () => {
    it('The Leagues component renders without crashing', () => {
        const wrapper = shallow(<LeaguesUnconnected
            fetchLeaguesRequest={noop}
            joinLeagueRequest={noop}
            createLeagueRequest={noop}
            closeJoinLeagueError={noop}
            closeCreateLeagueError={noop}
            history={mockHistory}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Leagues connected', () => {
    it('Connected leagues', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            leagues: initialState,
            history: mockHistory
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <Leagues />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
