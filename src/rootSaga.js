import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import adminSaga from './admin/saga';
import overviewSaga from './overview/saga';
import profileSaga from './profile/saga';
import gameSaga from './game/saga';

export default function* rootSaga() {
    yield all([
        adminSaga(),
        authSaga(),
        overviewSaga(),
        profileSaga(),
        gameSaga()
    ]);
}
