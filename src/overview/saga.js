import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as overviewApi from './api';
import * as constants from '../constants';

export function* createGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.createAvalonGame, ({
                mode: action.mode,
                name: action.gameName,
                numberOfPlayers: action.numberOfPlayers,
                roles: action.roles
            }));
            yield put(actions.createGameSuccess());
        }
    } catch (error) {
        yield put(actions.createGameError(error, 'Create Game Error'));
    }
}

export function* joinGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.joinAvalonGame, ({
                gameId: action.gameId
            }));
            yield put(actions.createGameSuccess());
        }
    } catch (error) {
        yield put(actions.joinGameError(error, 'Join Game Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.CREATE_GAME_REQUEST, createGame, overviewApi),
        takeEvery(actions.JOIN_GAME_REQUEST, joinGame, overviewApi)
    ]);
}
