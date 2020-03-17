import {
    all, takeEvery, put, call, select
} from 'redux-saga/effects';
import * as actions from './actions';
import * as chartsApi from './api';
import * as selectors from './selectors';

export function* fetchAllTeams(api) {
    try {
        const fetchedTeams = yield select(selectors.getAllTeams);
        if (fetchedTeams && fetchedTeams.length === 0) {
            const teams = yield call(api.getAllTeams);
            yield put(actions.fetchAllTeamsSuccess(teams));
        } else {
            yield put(actions.alreadyFetchedTeams());
        }
    } catch (error) {
        yield put(actions.fetchAllTeamsError(error));
    }
}

export default function* chartsSaga() {
    yield all([
        takeEvery(actions.FETCH_ALL_TEAMS_REQUEST, fetchAllTeams, chartsApi)
    ]);
}
