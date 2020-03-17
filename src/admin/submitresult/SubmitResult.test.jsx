
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../../enzyme';
import SubmitResult, { SubmitResultUnconnected } from './SubmitResult';
import { initialState } from '../reducer';
import { initialState as overviewinitialState } from '../../overview/reducer';

describe('Submit Result', () => {
    it('The Submit Result component renders without crashing', () => {
        const wrapper = shallow(<SubmitResultUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            teamsWithPlayers={{}}
            submittingExtraResult={false}
            submitExtraStatsRequest={noop}
            submittingResult={false}
            submitResultRequest={noop}
            fetchPlayersForTeamRequest={noop}
            fetchTeamsRequest={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});

describe('Submit Result connected', () => {
    it('Connected submit result', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: initialState,
            overview: overviewinitialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <SubmitResult />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });

    it('Submitting a result', () => {
        const mockCallback = jest.fn(noop);

        const wrapper = mount(
            <SubmitResultUnconnected
                allTeams={[
                    {
                        id: 'teamOne',
                        text: 'teamOne',
                        value: 'teamOne'
                    },
                    {
                        id: 'teamTwo',
                        text: 'teamTwo',
                        value: 'teamTwo'
                    },
                    {
                        id: 'teamThree',
                        text: 'teamThree',
                        value: 'teamThree'
                    }
                ]}
                fetchPlayersForTeamRequest={mockCallback}
                fetchTeamsRequest={noop}
                submitExtraStatsRequest={noop}
                submittingExtraResult={false}
                submittingResult={false}
                teamsWithPlayers={{}}
                submitResultRequest={noop}
                closeSuccessMessage={noop}
                closeAdminError={noop}
            />
        );


        wrapper.find('.MuiInputBase-inputSelect').at(0).simulate('click');
        wrapper.find('ul').childAt(2).simulate('click');
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe('teamTwo');
        expect(() => wrapper).not.toThrow();
    });
});
