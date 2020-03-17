import reducer, { initialState } from './reducer';
import * as actions from './actions';


describe('Points reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch user points for week', () => {
        const action = actions.fetchUserPointsForWeekSuccess('myUserId', 2, 'team');
        expect(reducer({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: true
                    }
                }
            }
        }, action)).toEqual({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetched: true,
                        fetching: false,
                        team: 'team'
                    }
                }
            }
        });
    });

    it('fetch user points for week error', () => {
        const action = actions.fetchUserPointsForWeekError('myUserId', 2, null);
        expect(reducer({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: true
                    }
                }
            }
        }, action)).toEqual({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: false
                    }
                }
            }
        });
    });

    it('fetch user points for week request', () => {
        const action = actions.fetchUserPointsForWeekRequest('myUserId', 2);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: true
                    }
                }
            }
        });
    });

    it('already fetched user points for week request', () => {
        const action = actions.alreadyFetchedPointsForWeek('myUserId', 2);
        expect(reducer({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: true
                    }
                }
            }
        }, action)).toEqual({
            ...initialState,
            userTeams: {
                myUserId: {
                    'week-2': {
                        fetching: false
                    }
                }
            }
        });
    });
});
