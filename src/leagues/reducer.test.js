import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Leagues reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch leagues success', () => {
        const leagues = ['all', 'the', 'leagues'];
        const action = actions.fetchLeaguesSuccess(leagues);
        expect(reducer({
            ...initialState,
            fetchingLeagues: true
        }, action)).toEqual({
            ...initialState,
            leagues,
            fetchingLeagues: false
        });
    });

    it('fetch leagues error', () => {
        const action = actions.fetchLeaguesError(null);
        expect(reducer({
            ...initialState,
            fetchingLeagues: true
        }, action)).toEqual({
            ...initialState,
            fetchingLeagues: false
        });
    });

    it('already fetched leagues', () => {
        const action = actions.alreadyFetchedLeagues(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            fetchingLeagues: false
        });
    });

    it('create league success', () => {
        const leagues = ['a', 'b', 'c'];
        const action = actions.createLeagueSuccess(leagues);
        expect(reducer({
            ...initialState,
            creatingLeague: true
        }, action)).toEqual({
            ...initialState,
            leagues,
            creatingLeague: false
        });
    });

    it('create league request', () => {
        const action = actions.createLeagueRequest(null, null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            creatingLeague: true
        });
    });

    it('join league request', () => {
        const action = actions.joinLeagueRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            joiningLeague: true
        });
    });

    it('leave league request', () => {
        const action = actions.leaveLeagueRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            leavingLeague: true
        });
    });

    it('join league success', () => {
        const leagues = ['a', 'b', 'c'];
        const action = actions.joinLeagueSuccess(leagues);
        expect(reducer({
            ...initialState,
            leagues: [1, 2, 3]
        }, action)).toEqual({
            ...initialState,
            leagues
        });
    });

    it('join league error', () => {
        const action = actions.joinLeagueError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer({
            ...initialState,
            joiningLeague: true
        }, action)).toEqual({
            ...initialState,
            joiningLeague: false,
            joinLeagueError: 'Error message',
            joinLeagueErrorCode: 'Error code'
        });
    });

    it('close join league error', () => {
        const action = actions.closeJoinLeagueError();
        expect(reducer({
            ...initialState,
            joinLeagueError: 'abc',
            joinLeagueErrorCode: 'def'
        }, action)).toEqual({
            ...initialState,
            joinLeagueError: '',
            joinLeagueErrorCode: ''
        });
    });

    it('leave league success', () => {
        const leagues = ['a', 'b', 'c'];
        const action = actions.leaveLeagueSuccess(leagues);
        expect(reducer({
            ...initialState,
            leavingLeague: true
        }, action)).toEqual({
            ...initialState,
            leagues,
            leavingLeague: false
        });
    });

    it('leave league error', () => {
        const action = actions.leaveLeagueError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer({
            ...initialState,
            leavingLeague: true
        }, action)).toEqual({
            ...initialState,
            leavingLeague: false,
            leaveLeagueError: 'Error message',
            leaveLeagueErrorCode: 'Error code'
        });
    });

    it('fetch users in league success', () => {
        const usersInLeague = ['a', 'b', 'c'];
        const action = actions.fetchUsersInLeagueSuccess('leagueId', usersInLeague, 3, 'leagueName');
        expect(reducer({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: true
                }
            }
        }, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    users: usersInLeague,
                    fetching: false,
                    numberOfUsers: 3,
                    leagueName: 'leagueName'
                }
            }
        });
    });

    it('create league error', () => {
        const action = actions.createLeagueError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer({
            ...initialState,
            creatingLeague: true
        }, action)).toEqual({
            ...initialState,
            creatingLeague: false,
            createLeagueError: 'Error message',
            createLeagueErrorCode: 'Error code'
        });
    });

    it('close create league error', () => {
        const action = actions.closeCreateLeagueError();
        expect(reducer({
            ...initialState,
            createLeagueError: 'abc',
            createLeagueErrorCode: 'def'
        }, action)).toEqual({
            ...initialState,
            createLeagueError: '',
            createLeagueErrorCode: ''
        });
    });

    it('close leave league error', () => {
        const action = actions.closeLeaveLeagueError();
        expect(reducer({
            ...initialState,
            leaveLeagueError: 'abc',
            leaveLeagueErrorCode: 'def'
        }, action)).toEqual({
            ...initialState,
            leaveLeagueError: '',
            leaveLeagueErrorCode: ''
        });
    });

    it('fetch leagues request', () => {
        const action = actions.fetchLeaguesRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            fetchingLeagues: true
        });
    });

    it('fetching users in league', () => {
        const action = actions.fetchingUsersInLeague('leagueId');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: true
                }
            }
        });
    });

    it('fetching users in league error', () => {
        const action = actions.fetchUsersInLeagueError('leagueId', null);
        expect(reducer({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: true
                }
            }
        }, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: false
                }
            }
        });
    });

    it('already fetched users in league', () => {
        const action = actions.alreadyFetchedUsersInLeague('leagueId');
        expect(reducer({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: true
                }
            }
        }, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetching: false
                }
            }
        });
    });

    it('fetch more users in league success', () => {
        const oldUsers = [
            {
                id: 'userOne',
                position: 4
            },
            {
                id: 'userTwo',
                position: 1
            },
            {
                id: 'userThree',
                position: 2
            }
        ];
        const newUsers = [{
            id: 'userFour',
            position: 3
        }];
        const newOrder = [
            {
                id: 'userTwo',
                position: 1
            },
            {
                id: 'userThree',
                position: 2
            },
            {
                id: 'userFour',
                position: 3
            },
            {
                id: 'userOne',
                position: 4
            }
        ];
        const action = actions.fetchMoreUsersInLeagueSuccess('leagueId', newUsers);
        expect(reducer({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    users: oldUsers
                }
            }
        }, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    users: newOrder
                }
            }
        });
    });

    it('fetched all users in league', () => {
        const action = actions.fetchedAllUsersInLeague('leagueId');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            usersInLeague: {
                leagueId: {
                    fetchedAll: true
                }
            }
        });
    });
});
