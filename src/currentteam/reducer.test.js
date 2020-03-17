import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Current team reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch active team success', () => {
        const activeTeam = ['a', 'b', 'c'];
        const action = actions.fetchActiveTeamSuccess('userId', activeTeam, 'captain');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            activeTeam: {
                userId: {
                    players: activeTeam,
                    fetching: false,
                    fetched: true,
                    captain: 'captain'
                }
            }
        });
    });

    it('fetch active team error', () => {
        const action = actions.fetchActiveTeamError('userId', null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            activeTeam: {
                userId: {
                    fetching: false
                }
            }
        });
    });

    it('fetch active team request', () => {
        const action = actions.fetchActiveTeamRequest('userId');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            activeTeam: {
                userId: {
                    fetching: true
                }
            }
        });
    });

    it('already fetched active team', () => {
        const action = actions.alreadyFetchedActiveTeam('userId');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            activeTeam: {
                userId: {
                    fetching: false
                }
            }
        });
    });
});
