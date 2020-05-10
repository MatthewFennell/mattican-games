import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as whoInHatApi from './api';
import * as commonActions from '../actions';

export function* addWord(api, action) {
    try {
        yield call(api.addWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Add Word error'));
    }
}

export function* startWhoInHat(api, action) {
    try {
        yield call(api.startWhoInHat, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Game error'));
    }
}

export function* startWhoInHatRound(api, action) {
    try {
        yield call(api.startWhoInHatRound, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Round error'));
    }
}

export function* editGameWhoInHat(api, action) {
    try {
        yield call(api.editGameWhoInHat, ({
            gameId: action.gameId,
            skippingRule: action.skippingRule,
            isCustomNames: action.roles,
            scoreCap: action.scoreCap,
            timePerRound: action.timePerRound
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Edit Game error'));
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
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Score error'));
    }
}

export default function* whoInHatSaga() {
    yield all([
        takeEvery(actions.ADD_WORD_REQUEST, addWord, whoInHatApi),
        takeEvery(actions.START_WHO_IN_HAT_GAME_REQUEST, startWhoInHat, whoInHatApi),
        takeEvery(actions.START_WHO_IN_HAT_ROUND_REQUEST, startWhoInHatRound, whoInHatApi),
        takeEvery(actions.EDIT_WHO_IN_HAT_GAME_REQUEST, editGameWhoInHat, whoInHatApi),
        takeEvery(actions.LOAD_SCORE_SUMMARY_REQUEST, loadSummary, whoInHatApi),
        takeEvery(actions.CONFIRM_SCORE_REQUEST, confirmScore, whoInHatApi)

    ]);
}
