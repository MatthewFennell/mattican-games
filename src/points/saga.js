import {
    all, takeEvery, put, select, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as selectors from './selectors';
import * as pointsApi from './api';

export function* getUserPointsForWeek(api, action) {
    try {
        const alreadyFetched = yield select(selectors.alreadyFetchedUserPoints,
            action.userId, action.week);
        if (!alreadyFetched) {
            const team = yield call(api.fetchPointsForUserInWeek, ({
                userId: action.userId,
                week: action.week
            }));
            yield put(actions.fetchUserPointsForWeekSuccess(action.userId, action.week, team));
        } else {
            yield put(actions.alreadyFetchedPointsForWeek(action.userId, action.week));
        }
    } catch (error) {
        yield put(actions.fetchUserPointsForWeekError(action.userId, action.week, error));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.FETCH_USER_POINTS_FOR_WEEK_REQUEST, getUserPointsForWeek, pointsApi),
        takeEvery(actions.FETCH_USER_POINTS_FOR_WEEK_REQUEST_BACKGROUND, getUserPointsForWeek,
            pointsApi)
    ]);
}
