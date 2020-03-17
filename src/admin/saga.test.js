import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { noop } from 'lodash';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';
import { successDelay } from '../constants';
import { fetchMaxGameWeekRequest } from '../overview/actions';
import { signOut } from '../auth/actions';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    addUserRole: noop,
    approveHighlight: () => 'highlight',
    clearDatabase: noop,
    createPlayer: noop,
    createTeam: noop,
    deleteAllOldUsers: noop,
    deleteHighlight: () => 'deleted highlight',
    deletePlayer: noop,
    deleteTeam: noop,
    editStats: noop,
    getAllTeams: () => 'all teams',
    getHighlightsForApproval: () => 'highlights approval',
    getPlayersInTeam: () => 'players in team',
    getPlayerStats: () => 'player stats',
    getUsersWithExtraRoles: () => 'extra roles',
    reapproveRejectedHighlight: () => 'reapproved rejected highlight',
    rejectHighlight: () => 'rejected highlight',
    rejectedHighlights: () => 'all rejected highlights',
    removeUserRole: noop,
    rollOverToNextYear: noop,
    setHasPaidSubs: noop,
    submitExtraResults: noop,
    submitResult: noop,
    triggerWeeklyTeams: noop
};

describe('Admin saga', () => {
    const provideDelay = ({ fn }, next) => ((fn.name === 'delayP') ? null : next());

    const alreadyFetchedInfo = fetched => ({ selector }, next) => {
        if (selector === selectors.getAllTeams) {
            return fetched ? [1, 2, 3] : [];
        }
        if (selector === selectors.getPlayersInTeam) {
            return fetched;
        }
        if (selector === selectors.getUsersWithExtraRoles) {
            return fetched ? [1, 2, 3] : [];
        }
        if (selector === selectors.fetchedHighlightsForApproval) {
            return fetched;
        }
        if (selector === selectors.fetchedRejectedHighlights) {
            return fetched;
        }
        return next();
    };

    it('already fetched teams', () => {
        const action = actions.fetchTeamsRequest();
        return expectSaga(sagas.fetchTeams, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(true)
                }
            ])
            .not.put(actions.fetchTeamsSuccess('all teams'))
            .run();
    });

    it('fetch teams', () => {
        const action = actions.fetchTeamsRequest();
        return expectSaga(sagas.fetchTeams, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(false)
                }
            ])
            .put(actions.fetchTeamsSuccess('all teams'))
            .run();
    });

    it('fetch teams error', () => {
        const error = new Error('error');
        const action = actions.fetchTeamsRequest();
        return expectSaga(sagas.fetchTeams, api, action)
            .provide([
                [matchers.call.fn(api.getAllTeams), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.setAdminError(error, 'Fetch Teams Error'))
            .run();
    });

    it('create player', () => {
        const action = actions.createPlayerRequest(null);
        return expectSaga(sagas.createPlayer, api, action)
            .provide({ call: provideDelay })
            .put(actions.createPlayerSuccess())
            .put(actions.setSuccessMessage('Player successfully created'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('create player error', () => {
        const error = new Error('error');
        const action = actions.createPlayerRequest(null);
        return expectSaga(sagas.createPlayer, api, action)
            .provide([
                [matchers.call.fn(api.createPlayer), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Create Player Error'))
            .run();
    });

    it('create team', () => {
        const action = actions.createTeamRequest(null);
        return expectSaga(sagas.createTeam, api, action)
            .provide({ call: provideDelay })
            .put(actions.createTeamSuccess())
            .put(actions.fetchTeamsSuccess('all teams'))
            .put(actions.setSuccessMessage('Team successfully created'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('create team error', () => {
        const error = new Error('error');
        const action = actions.createTeamRequest(null);
        return expectSaga(sagas.createTeam, api, action)
            .provide([
                [matchers.call.fn(api.createTeam), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Create Team Error'))
            .run();
    });

    it('fetch players for team', () => {
        const action = actions.fetchPlayersForTeamRequest('teamname');
        return expectSaga(sagas.getPlayersForTeam, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(false)
                }
            ])
            .put(actions.fetchPlayersForTeamSuccess('teamname', 'players in team'))
            .run();
    });

    it('already fetched players for team', () => {
        const action = actions.fetchPlayersForTeamRequest('teamname');
        return expectSaga(sagas.getPlayersForTeam, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(true)
                }
            ])
            .not.put(actions.fetchPlayersForTeamSuccess('teamname', 'players in team'))
            .run();
    });

    it('get players for team error', () => {
        const error = new Error('error');
        const action = actions.fetchPlayersForTeamRequest('teamname');
        return expectSaga(sagas.getPlayersForTeam, api, action)
            .provide([
                [matchers.call.fn(api.getPlayersInTeam), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.setAdminError(error, 'Get Players for team error'))
            .run();
    });

    it('submit result', () => {
        const action = actions.submitResultRequest(null);
        return expectSaga(sagas.submitResult, api, action)
            .provide({ call: provideDelay })
            .put(actions.submitResultSuccess())
            .put(actions.setSuccessMessage('Result successfully submitted'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('Submit result error', () => {
        const error = new Error('error');
        const action = actions.submitResultRequest(null);
        return expectSaga(sagas.submitResult, api, action)
            .provide([
                [matchers.call.fn(api.submitResult), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Submit Result Error'))
            .run();
    });

    it('Delete player', () => {
        const action = actions.deletePlayerRequest(null);
        return expectSaga(sagas.deletePlayer, api, action)
            .provide({ call: provideDelay })
            .put(actions.deletePlayerSuccess())
            .put(actions.setSuccessMessage('Player successfully deleted'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('Delete player error', () => {
        const error = new Error('error');
        const action = actions.deletePlayerRequest(null);
        return expectSaga(sagas.deletePlayer, api, action)
            .provide([
                [matchers.call.fn(api.deletePlayer), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Delete Player Error'))
            .run();
    });

    it('Delete team', () => {
        const action = actions.deleteTeamRequest(null);
        return expectSaga(sagas.deleteTeam, api, action)
            .provide({ call: provideDelay })
            .put(actions.deleteTeamSuccess())
            .put(actions.fetchTeamsSuccess('all teams'))
            .put(actions.setSuccessMessage('Team successfully deleted'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('Delete team error', () => {
        const error = new Error('error');
        const action = actions.deleteTeamRequest(null);
        return expectSaga(sagas.deleteTeam, api, action)
            .provide([
                [matchers.call.fn(api.deleteTeam), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Delete Team Error'))
            .run();
    });

    it('Trigger Week', () => {
        const action = actions.triggerWeekRequest(8);
        return expectSaga(sagas.triggerWeek, api, action)
            .provide({ call: provideDelay })
            .put(actions.triggerWeekSuccess())
            .put(fetchMaxGameWeekRequest())
            .put(actions.setSuccessMessage('Week 8 successfully triggered'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('Trigger week error', () => {
        const error = new Error('error');
        const action = actions.triggerWeekRequest(6);
        return expectSaga(sagas.triggerWeek, api, action)
            .provide([
                [matchers.call.fn(api.triggerWeeklyTeams), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Trigger Week Error'))
            .run();
    });

    it('Get player stats', () => {
        const action = actions.fetchPlayerStatsRequest('playerId', 3);
        return expectSaga(sagas.getPlayerStats, api, action)
            .put(actions.fetchPlayerStatsSuccess('player stats'))
            .run();
    });

    it('Get player stats error', () => {
        const error = new Error('error');
        const action = actions.fetchPlayerStatsRequest('playerId', 3);
        return expectSaga(sagas.getPlayerStats, api, action)
            .provide([
                [matchers.call.fn(api.getPlayerStats), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Get Player Stats Error'))
            .run();
    });

    it('Edit player stats', () => {
        const action = actions.editPlayerStatsRequest(null);
        return expectSaga(sagas.editPlayerStats, api, action)
            .provide({ call: provideDelay })
            .put(actions.fetchPlayerStatsSuccess('player stats'))
            .put(actions.editPlayerStatsSuccess())
            .put(actions.setSuccessMessage('Played successfully edited'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('Edit player stats error', () => {
        const error = new Error('error');
        const action = actions.editPlayerStatsRequest(null);
        return expectSaga(sagas.editPlayerStats, api, action)
            .provide([
                [matchers.call.fn(api.editStats), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Edit Player Stats Error'))
            .run();
    });

    it('Fetch users with extra roles error', () => {
        const error = new Error('error');
        const action = actions.fetchUsersWithExtraRolesRequest();
        return expectSaga(sagas.usersWithExtraRoles, api, action)
            .provide([
                [matchers.call.fn(api.getUsersWithExtraRoles), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.setAdminError(error, 'Fetch User Roles Error'))
            .run();
    });

    it('already fetched users with extra roles', () => {
        const action = actions.fetchUsersWithExtraRolesRequest();
        return expectSaga(sagas.usersWithExtraRoles, api, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.alreadyFetchedUsersWithExtraRoles())
            .run();
    });

    it('fetch users with extra roles', () => {
        const action = actions.fetchUsersWithExtraRolesRequest();
        return expectSaga(sagas.usersWithExtraRoles, api, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.fetchUsersWithExtraRolesSuccess('extra roles'))
            .run();
    });

    it('add user role', () => {
        const action = actions.addUserRoleRequest('email', 'role');
        return expectSaga(sagas.addUserRole, api, action)
            .provide({ call: provideDelay })
            .put(actions.loadUsersWithExtraRoles())
            .put(actions.fetchUsersWithExtraRolesSuccess('extra roles'))
            .put(actions.setSuccessMessage('User role successfully added'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('add user role error', () => {
        const error = new Error('error');
        const action = actions.addUserRoleRequest('email', 'role');
        return expectSaga(sagas.addUserRole, api, action)
            .provide([
                [matchers.call.fn(api.addUserRole), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Add User Role Error'))
            .run();
    });

    it('remove user role', () => {
        const action = actions.removeUserRoleRequest('email', 'role');
        return expectSaga(sagas.removeUserRole, api, action)
            .provide({ call: provideDelay })
            .put(actions.loadUsersWithExtraRoles())
            .put(actions.fetchUsersWithExtraRolesSuccess('extra roles'))
            .put(actions.setSuccessMessage('User role successfully removed'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('remove user role error', () => {
        const error = new Error('error');
        const action = actions.removeUserRoleRequest('email', 'role');
        return expectSaga(sagas.removeUserRole, api, action)
            .provide([
                [matchers.call.fn(api.removeUserRole), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Remove User Role Error'))
            .run();
    });

    it('clear database', () => {
        const action = actions.clearDatabaseRequest();
        return expectSaga(sagas.clearDatabase, api, action)
            .put(signOut())
            .run();
    });

    it('clear database error', () => {
        const error = new Error('error');
        const action = actions.clearDatabaseRequest();
        return expectSaga(sagas.clearDatabase, api, action)
            .provide([
                [matchers.call.fn(api.clearDatabase), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Clear Database Error'))
            .run();
    });

    it('roll over to next year', () => {
        const action = actions.rollOverToNextYearRequest();
        return expectSaga(sagas.rollOverToNextYear, api, action)
            .run();
    });

    it('roll over to next year error', () => {
        const error = new Error('error');
        const action = actions.rollOverToNextYearRequest();
        return expectSaga(sagas.rollOverToNextYear, api, action)
            .provide([
                [matchers.call.fn(api.rollOverToNextYear), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Rolling Over To Next Year Error'))
            .run();
    });

    it('delete all old users', () => {
        const action = actions.deleteAllOldUsersRequest();
        return expectSaga(sagas.deleteAllOldUsers, api, action)
            .run();
    });

    it('delete all old users error', () => {
        const error = new Error('error');
        const action = actions.deleteAllOldUsersRequest();
        return expectSaga(sagas.deleteAllOldUsers, api, action)
            .provide([
                [matchers.call.fn(api.deleteAllOldUsers), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Delete All Users Error'))
            .run();
    });

    it('fetch highlights for approval', () => {
        const action = actions.fetchHighlightsForApprovalRequest();
        return expectSaga(sagas.fetchHighlightsForApproval, api, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.fetchHighlightsForApprovalSuccess('highlights approval'))
            .run();
    });

    it('already fetched highlights for approval', () => {
        const action = actions.fetchHighlightsForApprovalRequest();
        return expectSaga(sagas.fetchHighlightsForApproval, api, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.alreadyFetchedHighlightsForApproval())
            .run();
    });

    it('fetch highlights for approval error', () => {
        const error = new Error('error');
        const action = actions.fetchHighlightsForApprovalRequest();
        return expectSaga(sagas.fetchHighlightsForApproval, api, action)
            .provide([
                [matchers.call.fn(api.getHighlightsForApproval), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.setAdminError(error, 'Fetch Highlights For Approval Error'))
            .run();
    });

    it('approve highlight', () => {
        const action = actions.approveHighlightRequest('highlightId');
        return expectSaga(sagas.approveHighlight, api, action)
            .provide({ call: provideDelay })
            .put(actions.approveHighlightSuccess('highlight'))
            .put(actions.setSuccessMessage('Highlight successfully approved'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('approve highlight error', () => {
        const error = new Error('error');
        const action = actions.approveHighlightRequest('highlightId');
        return expectSaga(sagas.approveHighlight, api, action)
            .provide([
                [matchers.call.fn(api.approveHighlight), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Approve Highlight Error'))
            .run();
    });

    it('reject highlight', () => {
        const action = actions.rejectHighlightRequest('highlightId', 'reason');
        return expectSaga(sagas.rejectHighlight, api, action)
            .provide({ call: provideDelay })
            .put(actions.rejectHighlightSuccess('rejected highlight'))
            .put(actions.setSuccessMessage('Highlight successfully rejected'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('reject highlight error', () => {
        const error = new Error('error');
        const action = actions.rejectHighlightRequest('highlightId', 'reason');
        return expectSaga(sagas.rejectHighlight, api, action)
            .provide([
                [matchers.call.fn(api.rejectHighlight), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Reject Highlight Error'))
            .run();
    });

    it('delete highlight', () => {
        const action = actions.deleteHighlightRequest('highlightId', 'reason');
        return expectSaga(sagas.deleteHighlight, api, action)
            .provide({ call: provideDelay })
            .put(actions.deleteHighlightSuccess('deleted highlight'))
            .put(actions.setSuccessMessage('Highlight successfully deleted'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('delete highlight error', () => {
        const error = new Error('error');
        const action = actions.deleteHighlightRequest('highlightId', 'reason');
        return expectSaga(sagas.deleteHighlight, api, action)
            .provide([
                [matchers.call.fn(api.deleteHighlight), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Delete Highlight Error'))
            .run();
    });

    it('already fetched rejected highlights', () => {
        const action = actions.fetchAllRejectedHighlightsRequest();
        return expectSaga(sagas.fetchRejectedHighlights, api, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.alreadyFetchedRejectedHighlights())
            .run();
    });

    it('fetch rejected highlights', () => {
        const action = actions.fetchAllRejectedHighlightsRequest();
        return expectSaga(sagas.fetchRejectedHighlights, api, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.fetchAllRejectedHighlightsSuccess('all rejected highlights'))
            .run();
    });

    it('fetch rejected highlights error', () => {
        const error = new Error('error');
        const action = actions.fetchAllRejectedHighlightsRequest();
        return expectSaga(sagas.fetchRejectedHighlights, api, action)
            .provide([
                [matchers.call.fn(api.rejectedHighlights), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.setAdminError(error, 'Fetch Rejected Highlights Error'))
            .run();
    });

    it('reapprove rejected highlights', () => {
        const action = actions.reapproveRejectedHighlightRequest();
        return expectSaga(sagas.reapproveRejectedHighlight, api, action)
            .provide({ call: provideDelay })
            .put(actions.reapproveRejectedHighlightSuccess('reapproved rejected highlight'))
            .put(actions.setSuccessMessage('Highlight successfully reapproved'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('reapprove rejected highlight error', () => {
        const error = new Error('error');
        const action = actions.reapproveRejectedHighlightRequest();
        return expectSaga(sagas.reapproveRejectedHighlight, api, action)
            .provide([
                [matchers.call.fn(api.reapproveRejectedHighlight), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Reapprove Rejected Highlight Error'))
            .run();
    });

    it('submit extra result', () => {
        const action = actions.submitExtraStatsRequest(null);
        return expectSaga(sagas.submitExtraResults, api, action)
            .put(actions.submitExtraStatsSuccess())
            .run();
    });

    it('submit extra result error', () => {
        const error = new Error('error');
        const action = actions.submitExtraStatsRequest(null);
        return expectSaga(sagas.submitExtraResults, api, action)
            .provide([
                [matchers.call.fn(api.submitExtraResults), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Submit Extra Results Error'))
            .run();
    });

    it('set has paid subs', () => {
        const action = actions.setHasPaidSubsRequest('changes');
        return expectSaga(sagas.setHasPaidSubs, api, action)
            .put(actions.setHasPaidSubsSuccess('changes'))
            .run();
    });

    it('set has paid subs error', () => {
        const error = new Error('error');
        const action = actions.setHasPaidSubsRequest('changes');
        return expectSaga(sagas.setHasPaidSubs, api, action)
            .provide([
                [matchers.call.fn(api.setHasPaidSubs), throwError(error)]
            ])
            .put(actions.setAdminError(error, 'Set Subs Paid Error'))
            .run();
    });
});
