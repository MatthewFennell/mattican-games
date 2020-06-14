import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as articulateApi from './api';
import * as commonActions from '../actions';
import * as constants from '../../constants';
import * as overviewActions from '../../overview/actions';

export function* editGame(api, action) {
    try {
        yield call(api.editGame, ({
            gameId: action.gameId,
            skippingRule: action.skippingRule,
            timePerRound: action.timePerRound,
            scoreCap: action.scoreCap
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Edit Game error'));
    }
}

export function* start(api, action) {
    try {
        yield call(api.start, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Game error'));
    }
}

export function* startRound(api, action) {
    try {
        yield call(api.startRound, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Round error'));
    }
}

export function* loadSummary(api, action) {
    try {
        yield call(api.loadSummary, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Load Summary error'));
    }
}

export function* confirmScore(api, action) {
    try {
        yield call(api.confirmScore, ({
            gameId: action.gameId,
            confirmedWords: action.confirmedWords
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Score error'));
    }
}

export function* confirmSpadeRoundWinner(api, action) {
    try {
        yield call(api.confirmSpadeRoundWinner, ({
            gameId: action.gameId,
            name: action.name
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Winner error'));
    }
}

export function* confirmWinner(api, action) {
    try {
        yield call(api.confirmWinner, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Winner error'));
    }
}

export function* startGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Articulate) {
            yield call(api.startArticulateGame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Game Error'));
    }
}

export function* createGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Articulate) {
            yield call(api.createArticulateGame, ({
                name: action.gameInfo.name,
                skippingRule: action.gameInfo.skippingRule,
                timePerRound: action.gameInfo.timePerRound,
                scoreCap: action.gameInfo.scoreCap
            }));
            yield put(overviewActions.createGameSuccess());
        }
    } catch (error) {
        yield put(overviewActions.stopCreateGame());
        yield put(commonActions.gameError(error, 'Create Game Error'));
    }
}

export default function* articulateSaga() {
    yield all([
        takeEvery(actions.EDIT_GAME_REQUEST, editGame, articulateApi),
        takeEvery(actions.START_GAME_REQUEST, start, articulateApi),
        takeEvery(actions.START_ROUND_REQUEST, startRound, articulateApi),
        takeEvery(actions.LOAD_SUMMARY_REQUEST, loadSummary, articulateApi),
        takeEvery(actions.CONFIRM_SCORE_REQUEST, confirmScore, articulateApi),
        takeEvery(actions.SPADE_ROUND_WINNER_REQUEST, confirmSpadeRoundWinner, articulateApi),
        takeEvery(actions.CONFIRM_WINNER, confirmWinner, articulateApi),
        takeEvery(commonActions.START_ANY_GAME_REQUEST, startGame, articulateApi),
        takeEvery(overviewActions.CREATE_GAME_REQUEST, createGame, articulateApi)
    ]);
}
