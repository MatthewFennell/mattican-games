
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../enzyme';
import Charts, { ChartsUnconnected } from './Charts';
import { initialState } from './reducer';
import { initialState as overviewinitialState } from '../overview/reducer';
import { initialState as fixturesInitialState } from '../fixtures/reducer';

describe('Charts', () => {
    it('The Charts component renders without crashing', () => {
        const wrapper = shallow(<ChartsUnconnected
            fetchAllTeamsRequest={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});


describe('Charts connected', () => {
    it('Connected charts', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            charts: initialState,
            overview: overviewinitialState,
            fixtures: fixturesInitialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Charts />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
