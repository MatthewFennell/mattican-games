import {
    all, call, takeEvery, put, select, delay, takeLatest
} from 'redux-saga/effects';
import * as actions from './actions';
import * as adminApi from './api';
import * as selectors from './selectors';
import { fetchMaxGameWeekRequest } from '../overview/actions';
import { signOut } from '../auth/actions';
import { successDelay } from '../constants';

export function* fetchTeams(api) {
    try {
        const alreadyFetched = yield select(selectors.getAllTeams);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const allTeams = yield call(api.getAllTeams);
            yield put(actions.fetchTeamsSuccess(allTeams));
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Fetch Teams Error'));
    }
}

export function* createPlayer(api, action) {
    try {
        yield call(api.createPlayer, {
            name: action.name,
            price: action.price,
            position: action.position,
            team: action.team,
            previousScore: action.previousScore
        });
        yield put(actions.createPlayerSuccess());
        yield put(actions.setSuccessMessage('Player successfully created'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Create Player Error'));
    }
}

export function* createTeam(api, action) {
    try {
        yield call(api.createTeam, ({ teamName: action.teamName }));
        yield put(actions.createTeamSuccess());
        const allTeams = yield call(api.getAllTeams);
        yield put(actions.fetchTeamsSuccess(allTeams));
        yield put(actions.setSuccessMessage('Team successfully created'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Create Team Error'));
    }
}

export function* getPlayersForTeam(api, action) {
    try {
        const alreadyFetched = yield select(selectors.getPlayersInTeam, action.teamName);
        if (!alreadyFetched) {
            const playersInTeam = yield call(api.getPlayersInTeam, { teamName: action.teamName });
            yield put(actions.fetchPlayersForTeamSuccess(action.teamName, playersInTeam));
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Get Players for team error'));
    }
}

export function* submitResult(api, action) {
    try {
        yield call(api.submitResult,
            {
                team: action.teamId,
                goalsFor: action.goalsFor,
                goalsAgainst: action.goalsAgainst,
                week: action.week,
                players: action.players
            });
        yield put(actions.submitResultSuccess());
        yield put(actions.setSuccessMessage('Result successfully submitted'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Submit Result Error'));
    }
}

export function* deletePlayer(api, action) {
    try {
        yield call(api.deletePlayer, { playerId: action.playerId });
        yield put(actions.deletePlayerSuccess());
        yield put(actions.setSuccessMessage('Player successfully deleted'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Delete Player Error'));
    }
}

export function* deleteTeam(api, action) {
    try {
        yield call(api.deleteTeam, {
            teamId: action.teamId,
            teamName: action.teamName
        });
        yield put(actions.deleteTeamSuccess());
        const allTeams = yield call(api.getAllTeams);
        yield put(actions.fetchTeamsSuccess(allTeams));
        yield put(actions.setSuccessMessage('Team successfully deleted'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Delete Team Error'));
    }
}

export function* triggerWeek(api, action) {
    try {
        yield call(api.triggerWeeklyTeams, { week: action.week });
        yield put(actions.triggerWeekSuccess());
        yield put(fetchMaxGameWeekRequest());
        yield put(actions.setSuccessMessage(`Week ${action.week} successfully triggered`));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Trigger Week Error'));
    }
}

export function* getPlayerStats(api, action) {
    try {
        const playerStats = yield call(api.getPlayerStats,
            { playerId: action.playerId, week: action.week });
        yield put(actions.fetchPlayerStatsSuccess(playerStats));
    } catch (error) {
        yield put(actions.setAdminError(error, 'Get Player Stats Error'));
    }
}

export function* editPlayerStats(api, action) {
    try {
        yield call(api.editStats,
            { playerId: action.playerId, week: action.week, difference: action.difference });
        const playerStats = yield call(api.getPlayerStats,
            { playerId: action.playerId, week: action.week });
        yield put(actions.fetchPlayerStatsSuccess(playerStats));
        yield put(actions.editPlayerStatsSuccess());
        yield put(actions.setSuccessMessage('Played successfully edited'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Edit Player Stats Error'));
    }
}

export function* usersWithExtraRoles(api) {
    try {
        const alreadyFetched = yield select(selectors.getUsersWithExtraRoles);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const extraRoles = yield call(api.getUsersWithExtraRoles);
            yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        } else {
            yield put(actions.alreadyFetchedUsersWithExtraRoles());
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Fetch User Roles Error'));
    }
}

export function* addUserRole(api, action) {
    try {
        yield put(actions.loadUsersWithExtraRoles());
        yield call(api.addUserRole, ({
            email: action.email,
            role: action.role
        }));
        const extraRoles = yield call(api.getUsersWithExtraRoles);
        yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        yield put(actions.setSuccessMessage('User role successfully added'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Add User Role Error'));
    }
}

export function* removeUserRole(api, action) {
    try {
        yield put(actions.loadUsersWithExtraRoles());
        yield call(api.removeUserRole, ({
            email: action.email,
            role: action.role
        }));
        const extraRoles = yield call(api.getUsersWithExtraRoles);
        yield put(actions.fetchUsersWithExtraRolesSuccess(extraRoles));
        yield put(actions.setSuccessMessage('User role successfully removed'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Remove User Role Error'));
    }
}

export function* clearDatabase(api) {
    try {
        yield call(api.clearDatabase);
        yield put(signOut());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Clear Database Error'));
    }
}

export function* rollOverToNextYear(api) {
    try {
        yield call(api.rollOverToNextYear);
    } catch (error) {
        yield put(actions.setAdminError(error, 'Rolling Over To Next Year Error'));
    }
}

export function* deleteAllOldUsers(api) {
    try {
        yield call(api.deleteAllOldUsers);
    } catch (error) {
        yield put(actions.setAdminError(error, 'Delete All Users Error'));
    }
}

export function* fetchHighlightsForApproval(api) {
    try {
        const fetchedHighlights = yield select(selectors.fetchedHighlightsForApproval);
        if (!fetchedHighlights) {
            const highlights = yield call(api.getHighlightsForApproval);
            yield put(actions.fetchHighlightsForApprovalSuccess(highlights));
        } else {
            yield put(actions.alreadyFetchedHighlightsForApproval());
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Fetch Highlights For Approval Error'));
    }
}

export function* approveHighlight(api, action) {
    try {
        const highlight = yield call(api.approveHighlight, ({ highlightId: action.highlightId }));
        yield put(actions.approveHighlightSuccess(highlight));
        yield put(actions.setSuccessMessage('Highlight successfully approved'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Approve Highlight Error'));
    }
}

export function* rejectHighlight(api, action) {
    try {
        const highlight = yield call(api.rejectHighlight, ({
            highlightId: action.highlightId,
            reason: action.reason
        }));
        yield put(actions.rejectHighlightSuccess(highlight));
        yield put(actions.setSuccessMessage('Highlight successfully rejected'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Reject Highlight Error'));
    }
}

export function* deleteHighlight(api, action) {
    try {
        const highlight = yield call(api.deleteHighlight, ({
            highlightId: action.highlightId,
            reason: action.reason
        }));
        yield put(actions.deleteHighlightSuccess(highlight));
        yield put(actions.setSuccessMessage('Highlight successfully deleted'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Delete Highlight Error'));
    }
}

export function* fetchRejectedHighlights(api) {
    try {
        const fetchedHighlights = yield select(selectors.fetchedRejectedHighlights);
        if (!fetchedHighlights) {
            const highlights = yield call(api.rejectedHighlights);
            yield put(actions.fetchAllRejectedHighlightsSuccess(highlights));
        } else {
            yield put(actions.alreadyFetchedRejectedHighlights());
        }
    } catch (error) {
        yield put(actions.setAdminError(error, 'Fetch Rejected Highlights Error'));
    }
}

export function* reapproveRejectedHighlight(api, action) {
    try {
        const highlight = yield call(api.reapproveRejectedHighlight,
            ({ highlightId: action.highlightId }));
        yield put(actions.reapproveRejectedHighlightSuccess(highlight));
        yield put(actions.setSuccessMessage('Highlight successfully reapproved'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Reapprove Rejected Highlight Error'));
    }
}

export function* submitExtraResults(api, action) {
    try {
        yield call(api.submitExtraResults, ({
            gameWeek: action.gameWeek,
            yellowCard: action.yellowCard,
            redCard: action.redCard,
            penaltySaved: action.penaltySaved,
            penaltyMissed: action.penaltyMissed,
            ownGoal: action.ownGoal
        }));
        yield put(actions.submitExtraStatsSuccess());
    } catch (error) {
        yield put(actions.setAdminError(error, 'Submit Extra Results Error'));
    }
}

export function* setHasPaidSubs(api, action) {
    try {
        yield call(api.setHasPaidSubs, ({
            changes: action.changes
        }));
        yield put(actions.setHasPaidSubsSuccess(action.changes));
    } catch (error) {
        yield put(actions.setAdminError(error, 'Set Subs Paid Error'));
    }
}

export default function* adminSaga() {
    yield all([
        takeEvery(actions.FETCH_TEAMS_REQUEST, fetchTeams, adminApi),
        takeLatest(actions.CREATE_PLAYER_REQUEST, createPlayer, adminApi),
        takeLatest(actions.CREATE_TEAM_REQUEST, createTeam, adminApi),
        takeEvery(actions.FETCH_PLAYERS_FOR_TEAM_REQUEST, getPlayersForTeam, adminApi),
        takeLatest(actions.SUBMIT_RESULT_REQUEST, submitResult, adminApi),
        takeLatest(actions.DELETE_PLAYER_REQUEST, deletePlayer, adminApi),
        takeLatest(actions.DELETE_TEAM_REQUEST, deleteTeam, adminApi),
        takeLatest(actions.TRIGGER_WEEK_REQUEST, triggerWeek, adminApi),
        takeEvery(actions.FETCH_PLAYER_STATS_REQUEST, getPlayerStats, adminApi),
        takeLatest(actions.EDIT_PLAYER_STATS_REQUEST, editPlayerStats, adminApi),
        takeEvery(actions.FETCH_USERS_WITH_EXTRA_ROLES_REQUEST, usersWithExtraRoles, adminApi),
        takeLatest(actions.ADD_USER_ROLE_REQUEST, addUserRole, adminApi),
        takeLatest(actions.REMOVE_USER_ROLE_REQUEST, removeUserRole, adminApi),
        takeEvery(actions.CLEAR_DATABASE_REQUEST, clearDatabase, adminApi),
        takeEvery(actions.ROLL_OVER_TO_NEXT_YEAR_REQUEST, rollOverToNextYear, adminApi),
        takeEvery(actions.DELETE_ALL_OLD_USERS_REQUEST, deleteAllOldUsers, adminApi),
        takeEvery(actions.FETCH_HIGHLIGHTS_FOR_APPROVAL_REQUEST, fetchHighlightsForApproval,
            adminApi),
        takeLatest(actions.APPROVE_HIGHLIGHT_REQUEST, approveHighlight, adminApi),
        takeLatest(actions.REJECT_HIGHLIGHT_REQUEST, rejectHighlight, adminApi),
        takeLatest(actions.DELETE_HIGHLIGHT_REQUEST, deleteHighlight, adminApi),
        takeEvery(actions.FETCH_ALL_REJECTED_HIGHLIGHTS_REQUEST, fetchRejectedHighlights, adminApi),
        takeLatest(actions.REAPPROVE_REJECTED_HIGHLIGHT_REQUEST, reapproveRejectedHighlight,
            adminApi),
        takeEvery(actions.SUBMIT_EXTRA_STATS_REQUEST, submitExtraResults, adminApi),
        takeEvery(actions.SET_HAS_PAID_SUBS_REQUEST, setHasPaidSubs, adminApi)
    ]);
}
