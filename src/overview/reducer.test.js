import reducer, { initialState } from './reducer';
import * as actions from './actions';


describe('Overview reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should set fetching stats loading for the user id', () => {
        const action = actions.fetchUserStatsRequest('myUserId');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: true
                }
            }
        });
    });

    it('already fetched a users stats', () => {
        const action = actions.alreadyFetchedUserStats('myUserId');
        expect(reducer({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: true
                }
            }
        }, action)).toEqual({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: false
                }
            }
        });
    });

    it('fetch user stats success', () => {
        const userStats = {
            remainingBudget: 100,
            remainingTransfers: 5,
            totalPoints: 10
        };
        const action = actions.fetchUserStatsSuccess('myUserId', userStats);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: false,
                    fetched: true,
                    remainingBudget: 100,
                    remainingTransfers: 5,
                    totalPoints: 10
                }
            }
        });
    });

    it('fetch max gameweek success', () => {
        const action = actions.fetchMaxGameWeekSuccess(10);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            maxGameWeek: 10
        });
    });

    it('fetch user info for week request', () => {
        const action = actions.fetchUserInfoForWeekRequest('myUserId', 5);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: true
                    }
                }
            }
        });
    });

    it('fetch user info for week success', () => {
        const userInfo = {
            weekPoints: 159,
            averagePoints: 53,
            highestPoints: 900
        };
        const action = actions.fetchUserInfoForWeekSuccess('myUserId', 5, userInfo);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: false,
                        fetched: true,
                        weekPoints: 159,
                        averagePoints: 53,
                        highestPoints: 900
                    }
                }
            }
        });
    });

    it('already fetched a users info', () => {
        const action = actions.alreadyFetchedUserInfoForWeek('myUserId', 5);
        expect(reducer({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: true
                    }
                }
            }
        }, action)).toEqual({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: false
                    }
                }
            }
        });
    });

    it('fetch user info for week error', () => {
        const action = actions.fetchUserInfoForWeekError('myUserId', 5, null);
        expect(reducer({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: true
                    }
                }
            }
        }, action)).toEqual({
            ...initialState,
            userInfo: {
                myUserId: {
                    'week-5': {
                        fetching: false
                    }
                }
            }
        });
    });

    it('fetch user stats error', () => {
        const action = actions.fetchUserStatsError('myUserId', null);
        expect(reducer({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: true
                }
            }
        }, action)).toEqual({
            ...initialState,
            userStats: {
                myUserId: {
                    fetching: false
                }
            }
        });
    });
});
