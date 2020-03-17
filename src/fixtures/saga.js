import {
    all, takeEvery, put, call, delay, takeLatest, select
} from 'redux-saga/effects';
import * as actions from './actions';
import * as fixturesApi from './api';
import { successDelay } from '../constants';
import * as selectors from './selectors';

export function* fetchFixtures(api) {
    try {
        const currentFixtures = yield select(selectors.getFixtures);
        if (currentFixtures && currentFixtures.length === 0) {
            const fixtures = yield call(api.getFixtures);
            yield put(actions.fetchFixturesSuccess(fixtures));
        } else {
            yield put(actions.alreadyFetchedFixtures());
        }
    } catch (error) {
        yield put(actions.setFixturesError(error, 'Error Fetching Fixtures'));
    }
}

export function* setMyTeam(api, action) {
    try {
        yield call(api.setMyTeam, { team: action.team });
        yield put(actions.setMyTeam(action.team));
        yield put(actions.setSuccessMessage('Team successfully set'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.setFixturesError(error, 'Error Setting Team'));
    }
}

export function* fetchMyTeam(api) {
    try {
        const myTeam = yield call(api.fetchMyTeam);
        yield put(actions.setMyTeam(myTeam));
    } catch (error) {
        yield put(actions.setFixturesError(error, 'Error Fetching Team'));
    }
}

export default function* fixturesSaga() {
    yield all([
        takeEvery(actions.FETCH_FIXTURES_REQUEST, fetchFixtures, fixturesApi),
        takeLatest(actions.SET_MY_TEAM_REQUEST, setMyTeam, fixturesApi),
        takeEvery(actions.FETCH_MY_TEAM_REQUEST, fetchMyTeam, fixturesApi)
    ]);
}
