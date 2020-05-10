import {
    all, takeEvery, put, call, delay
} from 'redux-saga/effects';
import * as actions from './actions';
import * as overviewApi from './api';
import * as gameActions from '../game/actions';

export function* createAvalonGame(api, action) {
    try {
        yield call(api.createAvalonGame, ({
            mode: action.mode,
            name: action.gameName,
            numberOfPlayers: action.numberOfPlayers,
            roles: action.roles
        }));
        yield put(actions.createGameSuccess());
    } catch (error) {
        yield put(actions.stopCreateGame());
        yield put(gameActions.gameError(error, 'Create Game Error'));
    }
}

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

export function* createHitlerGame(api, action) {
    try {
        yield call(api.createHitlerGame, ({
            mode: action.mode,
            name: action.gameName,
            numberOfPlayers: action.numberOfPlayers
        }));
        yield put(actions.createGameSuccess());
    } catch (error) {
        yield put(actions.stopCreateGame());
        yield put(gameActions.gameError(error, 'Create Game Error'));
    }
}

export function* createWhoInHatGame(api, action) {
    try {
        yield call(api.createWhoInHatGame, ({
            name: action.gameName,
            skippingRule: action.skippingRule,
            isCustomNames: action.isCustomNames,
            scoreCap: action.scoreCap,
            timePerRound: action.timePerRound
        }));
        yield put(actions.createGameSuccess());
    } catch (error) {
        yield put(actions.stopCreateGame());
        yield put(gameActions.gameError(error, 'Create Game Error'));
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

export function* createArticulateGame(api, action) {
    try {
        yield call(api.createArticulateGame, ({
            name: action.gameName,
            skippingRule: action.skippingRule,
            timePerRound: action.timePerRound,
            scoreCap: action.scoreCap
        }));
    } catch (error) {
        yield put(gameActions.gameError(error, 'Create Game Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.CREATE_AVALON_GAME_REQUEST, createAvalonGame, overviewApi),
        takeEvery(actions.JOIN_GAME_REQUEST, joinGame, overviewApi),
        takeEvery(actions.CREATE_HITLER_GAME_REQUEST, createHitlerGame, overviewApi),
        takeEvery(actions.CREATE_WHO_IN_HAT_GAME_REQUEST, createWhoInHatGame, overviewApi),
        takeEvery(actions.JOIN_WHO_IN_HAT_TEAM_MIDGAME_REQUEST, joinWhoInHatMidgame, overviewApi),
        takeEvery(actions.CREATE_ARTICULATE_GAME_REQUEST, createArticulateGame, overviewApi)
    ]);
}
