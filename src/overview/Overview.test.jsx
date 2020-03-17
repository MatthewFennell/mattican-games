
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from '../enzyme';
import Overview, { OverviewUnconnected } from './Overview';
import { initialState } from './reducer';

const mockHistory = {
    location: {
        pathname: 'pathname'
    },
    push: noop
};

describe('Overview', () => {
    it('The Overview component renders without crashing', () => {
        const wrapper = shallow(<OverviewUnconnected
            fetchUserStatsRequest={noop}
            fetchUserInfoForWeekRequestBackground={noop}
            fetchUserInfoForWeekRequest={noop}
            history={mockHistory}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Overview connected', () => {
    it('Connected overview', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            overview: initialState,
            history: mockHistory
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <Overview history={mockHistory} />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
