
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import Stats, { StatsUnconnected } from './Stats';
import { initialState } from './reducer';
import { initialState as admininitialState } from '../admin/reducer';
import { initialState as overviewinitialState } from '../overview/reducer';

const mockHistory = {
    location: {
        pathname: 'pathname'
    },
    push: noop
};

describe('Stats', () => {
    it('The Stats component renders without crashing', () => {
        const wrapper = shallow(<StatsUnconnected
            fetchTeamsRequest={noop}
            fetchTeamStatsByWeekRequest={noop}
            history={mockHistory}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Stats connected', () => {
    it('Connected stats', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: admininitialState,
            overview: overviewinitialState,
            stats: initialState,
            history: mockHistory
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <Stats history={mockHistory} />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
