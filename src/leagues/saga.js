/* eslint-disable max-len */
import {
    all, call, takeEvery, put, select
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import fp from 'lodash/fp';
import * as actions from './actions';
import * as leaguesApi from './api';
import * as selectors from './selectors';
import * as constants from '../constants';

const PAGE_BUFFER = 3;

export function* fetchLeagues(api) {
    try {
        const alreadyFetched = yield select(selectors.getLeagues);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const myLeagues = yield call(api.getLeaguesIAmIn);
            yield put(actions.fetchLeaguesSuccess(myLeagues));
        } else {
            yield put(actions.alreadyFetchedLeagues());
        }
    } catch (error) {
        yield put(actions.fetchLeaguesError(error));
    }
}

export function* fetchUsersInLeague(api, action) {
    try {
        const usersForThatLeague = yield select(selectors.getUsersInLeagueWithId, action.leagueId);
        const fetchedAllUsersInLeague = yield select(selectors.getFetchedAllUsersInLeague, action.leagueId);
        if (usersForThatLeague.length === 0) {
            yield put(actions.fetchingUsersInLeague(action.leagueId));
            const initialBatchOfUsers = yield call(api.getUsersInLeague,
                {
                    leagueId: action.leagueId,
                    week: action.maxGameWeek,
                    requestedSize: action.requestedSize,
                    previousId: null
                });
            yield put(actions.fetchUsersInLeagueSuccess(action.leagueId,
                initialBatchOfUsers.users, initialBatchOfUsers.numberOfUsers, initialBatchOfUsers.leagueName));
        } else
        if ((action.pageNumber + PAGE_BUFFER) * action.rowsPerPage > usersForThatLeague.length && !fetchedAllUsersInLeague) {
            yield put(actions.alreadyFetchedUsersInLeague(action.leagueId));
            const finalId = fp.last(usersForThatLeague).id;
            const nextBatch = yield call(api.getUsersInLeague,
                {
                    leagueId: action.leagueId,
                    week: action.maxGameWeek,
                    requestedSize: action.requestedSize,
                    previousId: finalId
                });
            if (nextBatch.users.length === 0) {
                yield put(actions.fetchedAllUsersInLeague(action.leagueId));
            } else {
                yield put(actions.fetchMoreUsersInLeagueSuccess(
                    action.leagueId, nextBatch.users, finalId
                ));
            }
        }
    } catch (error) {
        yield put(actions.fetchUsersInLeagueError(action.leagueId, error));
    }
}

export function* createLeague(api, action) {
    try {
        yield call(api.createLeague, {
            leagueName: action.leagueName,
            startWeek: action.startWeek
        });
        const myLeagues = yield call(api.getLeaguesIAmIn);
        yield put(actions.createLeagueSuccess(myLeagues));
    } catch (error) {
        yield put(actions.createLeagueError(error));
    }
}

export function* joinLeague(api, action) {
    try {
        yield call(api.joinLeague, { leagueName: action.leagueName });
        const myLeagues = yield call(api.getLeaguesIAmIn);
        yield put(actions.joinLeagueSuccess(myLeagues));
    } catch (error) {
        yield put(actions.joinLeagueError(error));
    }
}

export function* leaveLeague(api, action) {
    try {
        yield call(api.leaveLeague, { leagueId: action.leagueId });
        const myLeagues = yield call(api.getLeaguesIAmIn);
        yield put(actions.leaveLeagueSuccess(myLeagues));
        yield put(push(constants.URL.LEAGUES));
    } catch (error) {
        yield put(actions.leaveLeagueError(error));
    }
}

export default function* leaguesSaga() {
    yield all([
        takeEvery(actions.FETCH_LEAGUES_REQUEST, fetchLeagues, leaguesApi),
        takeEvery(actions.FETCH_USERS_IN_LEAGUE_REQUEST, fetchUsersInLeague, leaguesApi),
        takeEvery(actions.CREATE_LEAGUE_REQUEST, createLeague, leaguesApi),
        takeEvery(actions.JOIN_LEAGUE_REQUEST, joinLeague, leaguesApi),
        takeEvery(actions.LEAVE_LEAGUE_REQUEST, leaveLeague, leaguesApi)
    ]);
}
