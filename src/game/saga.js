import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as gameApi from './api';

export function* leaveGame(api, action) {
    try {
        yield call(api.leaveGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.leaveGameError(error, 'Leave Game Error'));
    }
}

export function* readyUp(api, action) {
    try {
        yield call(api.readyUp, ({
            gameId: action.gameId,
            isReady: action.isReady
        }));
    } catch (error) {
        yield put(actions.readyUpError(error, 'Ready Up Error'));
    }
}

export function* startGame(api, action) {
    try {
        yield call(api.startGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.startGameError(error, 'Ready Up Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.LEAVE_GAME_REQUEST, leaveGame, gameApi),
        takeEvery(actions.READY_UP_REQUEST, readyUp, gameApi),
        takeEvery(actions.START_GAME_REQUEST, startGame, gameApi)
    ]);
}
