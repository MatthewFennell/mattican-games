
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import CurrentTeam, { CurrentTeamUnconnected } from './CurrentTeam';
import { initialState } from './reducer';

const mockHistory = {
    location: {
        pathname: 'pathname'
    },
    push: noop
};

const mockMatch = {
    params: {
        userId: 'userId'
    }
};

describe('CurrentTeam', () => {
    it('The CurrentTeam component renders without crashing', () => {
        const wrapper = shallow(<CurrentTeamUnconnected
            makeCaptainRequest={noop}
            fetchActiveTeamRequest={noop}
            history={mockHistory}
            userId=""
        />);
        expect(() => wrapper).not.toThrow();
    });
});


describe('CurrentTeam connected', () => {
    it('Connected current team', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            currentTeam: initialState,
            history: mockHistory,
            match: mockMatch
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <CurrentTeam />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
