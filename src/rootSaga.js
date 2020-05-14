import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import adminSaga from './admin/saga';
import overviewSaga from './overview/saga';
import profileSaga from './profile/saga';
import gameSaga from './game/saga';
import articulateSaga from './game/articulate/saga';
import whoInHatSaga from './game/whoInHat/saga';
import avalonSaga from './game/avalon/saga';
import hitlerSaga from './game/hitler/saga';

export default function* rootSaga() {
    yield all([
        adminSaga(),
        articulateSaga(),
        authSaga(),
        avalonSaga(),
        hitlerSaga(),
        overviewSaga(),
        profileSaga(),
        gameSaga(),
        whoInHatSaga()
    ]);
}
