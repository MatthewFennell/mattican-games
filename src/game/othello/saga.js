import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as othelloApi from './api';
import * as commonActions from '../actions';
import * as constants from '../../constants';
import * as overviewActions from '../../overview/actions';


export function* createGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Othello) {
            yield call(api.createGame, ({
                name: action.gameInfo.name,
                opponent: action.gameInfo.opponent,
                difficulty: action.gameInfo.difficulty
            }));
            yield put(overviewActions.createGameSuccess());
        }
    } catch (error) {
        yield put(overviewActions.stopCreateGame());
        yield put(commonActions.gameError(error, 'Create Game Error'));
    }
}

export function* editGame(api, action) {
    try {
        yield call(api.editGame, ({
            gameId: action.gameId,
            opponent: action.opponent,
            difficulty: action.difficulty
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Edit Game error'));
    }
}

export function* start(api, action) {
    try {
        if (action.mode === constants.gameModes.Othello) {
            yield call(api.startGame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Game error'));
    }
}

export function* placeDisc(api, action) {
    try {
        yield call(api.placeDisc, ({
            gameId: action.gameId,
            row: action.row,
            column: action.column
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Place Disc error'));
    }
}

export default function* othelloSaga() {
    yield all([
        takeEvery(overviewActions.CREATE_GAME_REQUEST, createGame, othelloApi),
        takeEvery(actions.EDIT_GAME_REQUEST, editGame, othelloApi),
        takeEvery(commonActions.START_ANY_GAME_REQUEST, start, othelloApi),
        takeEvery(actions.PLACE_DISC_REQUEST, placeDisc, othelloApi)
    ]);
}
