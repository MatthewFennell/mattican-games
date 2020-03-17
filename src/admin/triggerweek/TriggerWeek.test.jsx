
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../../enzyme';
import TriggerWeek, { TriggerWeekUnconnected } from './TriggerWeek';
import { initialState } from '../reducer';
import { initialState as overviewinitialState } from '../../overview/reducer';

describe('Trigger Week', () => {
    it('The Trigger Week component renders without crashing', () => {
        const wrapper = shallow(<TriggerWeekUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            triggerWeekRequest={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Trigger Week connected', () => {
    it('Connected trigger week', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: initialState,
            overview: overviewinitialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <TriggerWeek />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
