
import React from 'react';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from '../../enzyme';
import CreatePlayer, { CreatePlayerUnconnected } from './CreatePlayer';
import StyledButton from '../../common/StyledButton/StyledButton';
import styles from './CreatePlayer.module.scss';
import { initialState } from '../reducer';

describe('Create Player', () => {
    it('The Create Player component renders without crashing', () => {
        const wrapper = shallow(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer={false}
            createPlayerRequest={noop}
            fetchTeamsRequest={noop}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        expect(() => wrapper).not.toThrow();
    });

    it('Rendering Create Player sends a fetch all teams request', () => {
        const mockFn = jest.fn(noop);

        mount(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer={false}
            createPlayerRequest={noop}
            fetchTeamsRequest={mockFn}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        expect(mockFn.mock.calls.length).toBe(1);
    });

    it('Create player should have a single Create Player button', () => {
        const wrapper = shallow(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer={false}
            createPlayerRequest={noop}
            fetchTeamsRequest={noop}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        expect(wrapper.find(StyledButton)).toHaveLength(1);
    });

    it('Clicking Create Player sends a Create Player request', () => {
        const mockFn = jest.fn(noop);
        const wrapper = shallow(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer={false}
            createPlayerRequest={mockFn}
            fetchTeamsRequest={noop}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        wrapper.find(StyledButton).simulate('click');
        expect(mockFn.mock.calls.length).toBe(1);
    });

    it('There is a class with hidden only if the player is not being created', () => {
        const wrapper = shallow(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer={false}
            createPlayerRequest={noop}
            fetchTeamsRequest={noop}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        expect(wrapper.find({ className: styles.hidden })).toHaveLength(1);
    });

    it('There is not a class with hidden only if the player being created', () => {
        const wrapper = shallow(<CreatePlayerUnconnected
            closeSuccessMessage={noop}
            closeAdminError={noop}
            creatingPlayer
            createPlayerRequest={noop}
            fetchTeamsRequest={noop}
            createPlayerError=""
            createPlayerErrorCode=""
        />);
        expect(wrapper.find({ className: styles.hidden })).toHaveLength(0);
    });
});


describe('Create Player connected', () => {
    it('Connected create player', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            admin: initialState
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <CreatePlayer />
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
