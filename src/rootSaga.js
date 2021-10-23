import { all } from 'redux-saga/effects';
import adminSaga from './admin/saga';
import authSaga from './auth/saga';
import articulateSaga from './game/articulate/saga';
import avalonSaga from './game/avalon/saga';
import hitlerSaga from './game/hitler/saga';
import othelloSaga from './game/othello/saga';
import gameSaga from './game/saga';
import whoInHatSaga from './game/whoInHat/saga';
import notificationSaga from './notifications/saga';
import overviewSaga from './overview/saga';
import telestrationsSaga from './game/telestrations/saga';
import profileSaga from './profile/saga';

export default function* rootSaga() {
    yield all([
        adminSaga(),
        articulateSaga(),
        authSaga(),
        avalonSaga(),
        hitlerSaga(),
        notificationSaga(),
        othelloSaga(),
        overviewSaga(),
        profileSaga(),
        gameSaga(),
        telestrationsSaga(),
        whoInHatSaga()
    ]);
}
