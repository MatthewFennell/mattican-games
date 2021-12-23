import { all, call, put, takeEvery } from "redux-saga/effects";
import * as constants from "../../constants";
import * as overviewActions from "../../overview/actions";
import * as notificationActions from "../../notifications/actions";
import * as commonActions from "../actions";
import * as actions from "./actions";
import * as telestrationsApi from "./api";

export function* startGame(api, action) {
  try {
    if (action.mode === constants.gameModes.Telestrations) {
      yield call(api.startTelestrationsGame, {
        gameId: action.gameId,
      });
    }
  } catch (error) {
    yield put(commonActions.gameError(error, "Start Game Error"));
  }
}

export function* createGame(api, action) {
  try {
    if (action.mode === constants.gameModes.Telestrations) {
      yield call(api.createTelestrationsGame, {
        name: action.gameInfo.name,
        includesPresetWords: action.gameInfo.includesPresetWords,
        numberOfSpies: action.gameInfo.numberOfSpies,
      });
      yield put(overviewActions.createGameSuccess());
    }
  } catch (error) {
    yield put(overviewActions.stopCreateGame());
    yield put(commonActions.gameError(error, "Create Game Error"));
  }
}

export function* addWord(api, action) {
  try {
    yield call(api.addTelestrationWord, {
      gameId: action.gameId,
      word: action.word,
    });
    yield put(
      notificationActions.addNotification(
        `Successfully added word ${action.word}`
      )
    );
  } catch (error) {
    yield put(commonActions.gameError(error, "Add Word Error"));
  } finally {
    yield put(actions.cancelAddingWord());
  }
}

export function* startRound(api, action) {
  try {
    yield put(commonActions.setIsStartingGame(true));
    yield call(api.startTelestrationsRound, {
      gameId: action.gameId,
    });
  } catch (error) {
    yield put(commonActions.gameError(error, "Start game Error"));
  } finally {
    yield put(commonActions.setIsStartingGame(false));
  }
}

export function* editNumberOfSpies(api, action) {
  try {
    yield call(api.setNumberOfSpies, {
      gameId: action.gameId,
      numberOfSpies: Number(action.numberOfSpies)
    });
  } catch (error) {
    yield put(commonActions.gameError(error, "Error setting number of spies"));
  } finally {
    yield put(actions.cancelEditingSpies(false));
  }
}

export default function* telestrationSaga() {
    yield all([
        takeEvery(commonActions.START_ANY_GAME_REQUEST, startGame, telestrationsApi),
        takeEvery(overviewActions.CREATE_GAME_REQUEST, createGame, telestrationsApi),
        takeEvery(actions.ADD_WORD_REQUEST, addWord, telestrationsApi),
        takeEvery(actions.START_GAME_REQUEST, startRound, telestrationsApi),
        takeEvery(actions.EDIT_NUMBER_OF_SPIES, editNumberOfSpies, telestrationsApi),
    ]);
}
