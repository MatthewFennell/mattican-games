import {
    all, takeEvery, put, call, delay
} from 'redux-saga/effects';
import * as actions from './actions';
import * as overviewApi from './api';
import * as gameActions from '../game/actions';

export function* joinGame(api, action) {
    try {
        yield call(api.joinGame, ({
            gameId: action.gameId
        }));
        yield put(actions.createGameSuccess());
        yield delay(5000);
        yield put(actions.stopJoinGame());
    } catch (error) {
        yield put(gameActions.gameError(error, 'Join Game Error'));
        yield put(actions.stopJoinGame());
    }
}

export function* joinWhoInHatMidgame(api, action) {
    try {
        yield call(api.joinWhoInHatMidgame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(gameActions.gameError(error, 'Join Game Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.JOIN_GAME_REQUEST, joinGame, overviewApi),
        takeEvery(actions.JOIN_TEAM_MIDGAME_REQUEST, joinWhoInHatMidgame, overviewApi)
    ]);
}
