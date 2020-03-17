import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Stats reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch team stats by week request', () => {
        const action = actions.fetchTeamStatsByWeekRequest('teamId', 3, 7);
        expect(reducer({
            ...initialState,
            teamStatsByWeek: {
                teamId: {
                    fetching: [3, 4, 5]
                }
            }
        }, action)).toEqual({
            ...initialState,
            teamStatsByWeek: {
                teamId: {
                    fetching: [3, 4, 5, 6, 7]
                }
            }
        });
    });

    it('fetch team stats by week success', () => {
        const previousStats = ['a', 'b', 'c', 'd'];
        const previousWeeksFetched = [1, 2, 3];

        const previousFetching = [2, 3, 4, 5, 6, 7, 8];

        const newStats = ['c', 'd', 'e', 'f'];
        const action = actions.fetchTeamStatsByWeekSuccess('teamId', 3, 6, newStats);
        expect(reducer({
            ...initialState,
            teamStatsByWeek: {
                teamId: {
                    weeksFetched: previousWeeksFetched,
                    fetching: previousFetching,
                    stats: previousStats
                }
            }
        }, action)).toEqual({
            ...initialState,
            teamStatsByWeek: {
                teamId: {
                    fetching: [2, 7, 8],
                    stats: ['c', 'd', 'e', 'f', 'a', 'b'],
                    weeksFetched: [1, 2, 3, 4, 5, 6]
                }
            }
        });
    });
});
