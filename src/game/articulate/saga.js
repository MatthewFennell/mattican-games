import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as articulateApi from './api';
import * as constants from '../../constants';
import * as commonActions from '../actions';


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

export default function* articulateApiSaga() {
    yield all([
        takeEvery(actions.EDIT_GAME_REQUEST, editGame, articulateApi)
    ]);
}
