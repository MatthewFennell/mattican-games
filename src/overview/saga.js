import {
    all, takeEvery, put, select, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as selectors from './selectors';
import * as overviewApi from './api';
import * as constants from '../constants';

export function* createGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.createAvalonGame, ({
                mode: action.mode,
                numberOfPlayers: action.numberOfPlayers,
                roles: action.roles
            }));
            yield put(actions.createGameSuccess());
        }
    } catch (error) {
        yield put(actions.createGameError(error, 'Set Subs Paid Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.CREATE_GAME_REQUEST, createGame, overviewApi)
    ]);
}
