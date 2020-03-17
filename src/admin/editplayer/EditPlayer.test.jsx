
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../../enzyme';
import EditPlayer, { EditPlayerUnconnected } from './EditPlayer';
import { initialState } from '../reducer';
import { initialState as overviewinitialState } from '../../overview/reducer';

describe('Edit Player', () => {
    it('The Edit Player component renders without crashing', () => {
        const wrapper = shallow(<EditPlayerUnconnected
            editingStats={false}
            closeSuccessMessage={noop}
            closeAdminError={noop}
            editPlayerStatsRequest={noop}
            fetchPlayerStatsRequest={noop}
            fetchPlayersForTeamRequest={noop}
            fetchTeamsRequest={noop}
            allTeams={[]}
            fetchingPlayerStats={false}
            maxGameWeek={0}
            playerStats={{}}
            teamsWithPlayers={{}}
            history={{ push: noop }}
        />);
        expect(() => wrapper).not.toThrow();
    });

    it('Loading Edit Player sends a fetch teams request', () => {
        const mockFn = jest.fn(noop);
        mount(<EditPlayerUnconnected
            editingStats={false}
            closeSuccessMessage={noop}
            closeAdminError={noop}
            editPlayerStatsRequest={noop}
            fetchPlayerStatsRequest={noop}
            fetchPlayersForTeamRequest={noop}
            fetchTeamsRequest={mockFn}
            allTeams={[]}
            fetchingPlayerStats={false}
            maxGameWeek={0}
            playerStats={{}}
            teamsWithPlayers={{}}
            history={{ push: noop }}
        />);
        expect(mockFn.mock.calls.length).toBe(1);
    });
});

describe('Edit Player connected', () => {
    it('Connected edit player', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: initialState,
            overview: overviewinitialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <EditPlayer />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
