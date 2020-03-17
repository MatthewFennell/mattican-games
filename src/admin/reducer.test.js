import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Admin reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch teams success', () => {
        const teams = ['a', 'b', 'c'];
        const action = actions.fetchTeamsSuccess(teams);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            allTeams: teams
        });
    });

    it('create player request', () => {
        const action = actions.createPlayerRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            creatingPlayer: true
        });
    });

    it('create player success', () => {
        const action = actions.createPlayerSuccess();
        expect(reducer({
            ...initialState,
            creatingPlayer: true
        }, action)).toEqual({
            ...initialState,
            creatingPlayer: false
        });
    });

    it('create team request', () => {
        const action = actions.createTeamRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            creatingTeam: true
        });
    });

    it('create team success', () => {
        const action = actions.createTeamSuccess();
        expect(reducer({
            ...initialState,
            creatingTeam: true
        }, action)).toEqual({
            ...initialState,
            creatingTeam: false
        });
    });

    it('fetch players for team success', () => {
        const players = ['a', 'b', 'c', 'd'];
        const action = actions.fetchPlayersForTeamSuccess('teamName', players);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            teamsWithPlayers: {
                teamName: players
            }
        });
    });

    it('delete player request', () => {
        const action = actions.deletePlayerRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            deletingPlayer: true
        });
    });

    it('delete team request', () => {
        const action = actions.deleteTeamRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            deletingTeam: true
        });
    });

    it('delete team success', () => {
        const action = actions.deleteTeamSuccess();
        expect(reducer({
            ...initialState,
            deletingTeam: true
        }, action)).toEqual({
            ...initialState,
            deletingTeam: false
        });
    });

    it('delete player success', () => {
        const action = actions.deletePlayerSuccess();
        expect(reducer({
            ...initialState,
            deletingPlayer: true
        }, action)).toEqual({
            ...initialState,
            deletingPlayer: false
        });
    });

    it('submit result request', () => {
        const action = actions.submitResultRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            submittingResult: true
        });
    });

    it('submit result success', () => {
        const action = actions.submitResultSuccess();
        expect(reducer({
            ...initialState,
            submittingResult: true
        }, action)).toEqual({
            ...initialState,
            submittingResult: false
        });
    });

    it('trigger week success', () => {
        const action = actions.triggerWeekSuccess();
        expect(reducer({
            ...initialState,
            triggeringWeek: true
        }, action)).toEqual({
            ...initialState,
            triggeringWeek: false
        });
    });

    it('trigger week request', () => {
        const action = actions.triggerWeekRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            triggeringWeek: true
        });
    });

    it('fetch player stats success', () => {
        const player = {
            assists: 5,
            cleanSheet: true,
            goals: 4,
            redCard: true,
            yellowCard: false,
            manOfTheMatch: false,
            dickOfTheDay: true,
            ownGoals: 10,
            penaltyMisses: 3,
            penaltySaves: 5
        };
        const action = actions.fetchPlayerStatsSuccess(player);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            playerStats: {
                ...player,
                fetching: false
            },
            fetchingPlayerStats: false
        });
    });

    it('fetch player stats request', () => {
        const action = actions.fetchPlayerStatsRequest(null, 3);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            fetchingPlayerStats: true
        });
    });

    it('fetch users with extra roles success', () => {
        const usersWithRoles = ['a', 'b', 'c', 'd'];
        const action = actions.fetchUsersWithExtraRolesSuccess(usersWithRoles);
        expect(reducer({
            ...initialState,
            fetchingUsersWithExtraRoles: true
        }, action)).toEqual({
            ...initialState,
            usersWithExtraRoles: usersWithRoles,
            fetchingUsersWithExtraRoles: false
        });
    });

    it('fetch users with extra roles request', () => {
        const action = actions.fetchUsersWithExtraRolesRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            fetchingUsersWithExtraRoles: true
        });
    });

    it('load users with extra roles request', () => {
        const action = actions.loadUsersWithExtraRoles();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            fetchingUsersWithExtraRoles: true
        });
    });

    it('already fetched users with extra roles', () => {
        const action = actions.alreadyFetchedUsersWithExtraRoles();
        expect(reducer({
            ...initialState,
            fetchingUsersWithExtraRoles: true
        }, action)).toEqual({
            ...initialState,
            fetchingUsersWithExtraRoles: false
        });
    });

    it('fetch highlights for approval success', () => {
        const highlights = ['a', 'b', 'c', 'd'];
        const action = actions.fetchHighlightsForApprovalSuccess(highlights);
        expect(reducer({
            ...initialState,
            loadingHighlightsForApproval: true
        }, action)).toEqual({
            ...initialState,
            loadingHighlightsForApproval: false,
            highlightsForApproval: highlights,
            loadedHighlightsForApproval: true
        });
    });

    it('fetch highlights for approval request', () => {
        const action = actions.fetchHighlightsForApprovalRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingHighlightsForApproval: true
        });
    });

    it('already fetched highlights for approval', () => {
        const action = actions.alreadyFetchedHighlightsForApproval();
        expect(reducer({
            ...initialState,
            loadingHighlightsForApproval: true
        }, action)).toEqual({
            ...initialState,
            loadingHighlightsForApproval: false
        });
    });

    it('approve highlight success', () => {
        const highlights = [{
            id: 'ignored',
            title: 'title'
        },
        {
            id: 'removed',
            title: 'remove me'
        }];
        const highlight = {
            id: 'removed',
            title: 'remove me'
        };
        const remaining = [{
            id: 'ignored',
            title: 'title'
        }];
        const action = actions.approveHighlightSuccess(highlight);
        expect(reducer({
            ...initialState,
            highlightsForApproval: highlights
        }, action)).toEqual({
            ...initialState,
            highlightsForApproval: remaining
        });
    });

    it('reject highlight success', () => {
        const highlights = [{
            id: 'ignored',
            title: 'title'
        },
        {
            id: 'removed',
            title: 'remove me'
        }];
        const highlight = {
            id: 'removed',
            title: 'remove me'
        };
        const remaining = [{
            id: 'ignored',
            title: 'title'
        }];
        const rejectedHighlights = [
            {
                id: 'alreadyRejected',
                title: 'a rejected highlight'
            }
        ];
        const action = actions.rejectHighlightSuccess(highlight);
        expect(reducer({
            ...initialState,
            highlightsForApproval: highlights,
            rejectedHighlights
        }, action)).toEqual({
            ...initialState,
            highlightsForApproval: remaining,
            rejectedHighlights: rejectedHighlights.concat(highlight)
        });
    });

    it('fetch all rejected highlights request', () => {
        const action = actions.fetchAllRejectedHighlightsRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: true
        });
    });

    it('reapprove rejected highlight request', () => {
        const action = actions.reapproveRejectedHighlightRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: true
        });
    });

    it('fetch all rejected highlights success', () => {
        const highlights = ['a', 'b', 'c', 'd'];
        const action = actions.fetchAllRejectedHighlightsSuccess(highlights);
        expect(reducer({
            ...initialState,
            loadedRejectedHighlights: true
        }, action)).toEqual({
            ...initialState,
            loadedRejectedHighlights: true,
            loadingRejectedHighlights: false,
            rejectedHighlights: highlights
        });
    });

    it('reapprove rejected highlights success', () => {
        const highlight = {
            id: 'id',
            title: 'title'
        };
        const rejectedHighlights = [
            {
                id: 'ignored',
                title: 'a'
            },
            {
                id: 'id',
                title: 'title'
            },
            {
                id: 'b',
                title: 'b'
            }
        ];
        const newHighlights = [
            {
                id: 'ignored',
                title: 'a'
            },
            {
                id: 'b',
                title: 'b'
            }
        ];
        const action = actions.reapproveRejectedHighlightSuccess(highlight);
        expect(reducer({
            ...initialState,
            loadingRejectedHighlights: true,
            rejectedHighlights
        }, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: false,
            rejectedHighlights: newHighlights
        });
    });

    it('delete highlight success', () => {
        const rejectedHighlights = [
            {
                id: 'firstRejected',
                title: 'hey'
            }
        ];
        const highlight = {
            id: 'gettingRejected',
            title: 'im getting rejected'
        };
        const action = actions.deleteHighlightSuccess(highlight);
        expect(reducer({
            ...initialState,
            rejectedHighlights,
            loadingRejectedHighlights: true
        }, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: false,
            rejectedHighlights: rejectedHighlights.concat(highlight)
        });
    });

    it('already fetched rejected highlights', () => {
        const action = actions.alreadyFetchedRejectedHighlights();
        expect(reducer({
            ...initialState,
            loadingRejectedHighlights: true
        }, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: false
        });
    });

    it('delete highlight request', () => {
        const action = actions.deleteHighlightRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingRejectedHighlights: true
        });
    });

    it('submit extra stats request', () => {
        const action = actions.submitExtraStatsRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            submittingExtraResults: true
        });
    });

    it('submit extra stats success', () => {
        const action = actions.submitExtraStatsSuccess();
        expect(reducer({
            ...initialState,
            submittingExtraResults: true
        }, action)).toEqual({
            ...initialState,
            submittingExtraResults: false
        });
    });

    it('edit player stats request', () => {
        const action = actions.editPlayerStatsRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            editingStats: true
        });
    });

    it('edit player stats success', () => {
        const action = actions.editPlayerStatsSuccess();
        expect(reducer({
            ...initialState,
            editingStats: true
        }, action)).toEqual({
            ...initialState,
            editingStats: false
        });
    });

    it('set success message', () => {
        const action = actions.setSuccessMessage('success message');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            successMessage: 'success message'
        });
    });

    it('close success message', () => {
        const action = actions.closeSuccessMessage();
        expect(reducer({
            ...initialState,
            successMessage: 'success message'
        }, action)).toEqual({
            ...initialState,
            successMessage: ''
        });
    });

    it('set admin error', () => {
        const action = actions.setAdminError({
            message: 'Error message',
            code: 'Error code'
        }, 'Error header');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header'
        });
    });

    it('close admin error', () => {
        const action = actions.closeAdminError();
        expect(reducer({
            ...initialState,
            errorMessage: 'abc',
            errorCode: 'def',
            errorHeader: 'ghi',
            creatingPlayer: true,
            creatingTeam: true,
            deletingPlayer: true,
            deletingTeam: true,
            submittingResult: true,
            triggeringWeek: true,
            fetchingPlayerStats: true,
            fetchingUsersWithExtraRoles: true,
            loadingHighlightsForApproval: true,
            loadingRejectedHighlights: true,
            editingStats: true
        }, action)).toEqual({
            ...initialState,
            errorMessage: '',
            errorCode: '',
            errorHeader: '',
            creatingPlayer: false,
            creatingTeam: false,
            deletingPlayer: false,
            deletingTeam: false,
            submittingResult: false,
            triggeringWeek: false,
            fetchingPlayerStats: false,
            fetchingUsersWithExtraRoles: false,
            loadingHighlightsForApproval: false,
            loadingRejectedHighlights: false,
            editingStats: false
        });
    });

    it('set has paid subs request', () => {
        const action = actions.setHasPaidSubsRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updatingSubs: true
        });
    });

    it('set has paid subs success', () => {
        const action = actions.setHasPaidSubsSuccess();
        expect(reducer({
            ...initialState,
            updatingSubs: true
        }, action)).toEqual({
            ...initialState,
            updatingSubs: false
        });
    });
});
