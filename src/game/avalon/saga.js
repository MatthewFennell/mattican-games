import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as avalonApi from './api';
import * as commonActions from '../actions';
import * as constants from '../../constants';
import * as overviewActions from '../../overview/actions';

export function* editGameAvalon(api, action) {
    try {
        yield call(api.editGameAvalon, ({
            gameId: action.gameId,
            numberOfPlayers: action.numberOfPlayers,
            roles: action.roles
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Edit Game error'));
    }
}


export function* nominatePlayerForQuest(api, action) {
    try {
        yield call(api.nominatePlayer, ({
            gameId: action.gameId,
            player: action.player,
            isOnQuest: action.isOnQuest
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Nominate Player Error'));
    }
}


export function* confirmNominations(api, action) {
    try {
        yield call(api.confirmNominations, ({
            gameId: action.gameId,
            nominations: action.nominations
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Nominate Player Error'));
    }
}


export function* makeVote(api, action) {
    try {
        yield call(api.makeVote, ({
            gameId: action.gameId,
            vote: action.vote
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Make Vote Error'));
    }
}


export function* goOnQuest(api, action) {
    try {
        yield call(api.goOnQuest, ({
            gameId: action.gameId,
            isSuccess: action.isSuccess
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Go On Quest Error'));
    }
}


export function* guessMerlin(api, action) {
    try {
        yield call(api.guessMerlin, ({
            gameId: action.gameId,
            merlin: action.merlin
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Guess Merlin Error'));
    }
}

export function* startGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.startAvalonGame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(commonActions.gameError(error, 'Start Game Error'));
    }
}

export function* createGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.createAvalonGame, ({
                name: action.gameInfo.name,
                numberOfPlayers: action.gameInfo.numberOfPlayers,
                roles: action.gameInfo.roles
            }));
            yield put(overviewActions.createGameSuccess());
        }
    } catch (error) {
        yield put(overviewActions.stopCreateGame());
        yield put(commonActions.gameError(error, 'Create Game Error'));
    }
}

export function* realignQuestNominations(api, action) {
    try {
        yield call(api.realignQuestNominations, ({
            gameId: action.gameId,
            nominations: action.nominations
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Realign Nominations Error'));
    }
}

export default function* whoInHatSaga() {
    yield all([
        takeEvery(actions.EDIT_GAME_REQUEST, editGameAvalon, avalonApi),
        takeEvery(actions.NOMINATE_PLAYER_FOR_QUEST_REQUEST, nominatePlayerForQuest, avalonApi),
        takeEvery(actions.CONFIRM_NOMINATIONS_REQUEST, confirmNominations, avalonApi),
        takeEvery(actions.MAKE_AVALON_VOTE_REQUEST, makeVote, avalonApi),
        takeEvery(actions.GUESS_MERLIN_REQUEST, guessMerlin, avalonApi),
        takeEvery(actions.MAKE_QUEST_REQUEST, goOnQuest, avalonApi),
        takeEvery(actions.REALIGN_QUEST_NOMINATIONS, realignQuestNominations, avalonApi),
        takeEvery(commonActions.START_ANY_GAME_REQUEST, startGame, avalonApi),
        takeEvery(overviewActions.CREATE_GAME_REQUEST, createGame, avalonApi)
    ]);
}
