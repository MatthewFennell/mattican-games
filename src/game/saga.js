import {
    all, takeEvery, put, call, delay
} from 'redux-saga/effects';
import * as actions from './actions';
import * as gameApi from './api';

export function* leaveGame(api, action) {
    try {
        yield call(api.leaveGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.leaveGameError(error, 'Leave Game Error'));
    }
}

export function* readyUp(api, action) {
    try {
        yield call(api.readyUp, ({
            gameId: action.gameId,
            isReady: action.isReady
        }));
    } catch (error) {
        yield put(actions.readyUpError(error, 'Ready Up Error'));
    }
}

export function* startGame(api, action) {
    try {
        yield call(api.startGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.startGameError(error, 'Ready Up Error'));
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
        yield put(actions.nominatePlayerForError(error, 'Nominate Player Error'));
    }
}

export function* confirmNominations(api, action) {
    try {
        yield call(api.confirmNominations, ({
            gameId: action.gameId,
            nominations: action.nominations
        }));
    } catch (error) {
        yield put(actions.confirmNominationsError(error, 'Nominate Player Error'));
    }
}

export function* makeVote(api, action) {
    try {
        yield call(api.makeVote, ({
            gameId: action.gameId,
            vote: action.vote
        }));
        yield delay(3000);
        yield put(actions.cancelVoteLoading());
    } catch (error) {
        yield put(actions.makeVoteError(error, 'Make Vote Error'));
    }
}

export function* goOnQuest(api, action) {
    try {
        yield call(api.goOnQuest, ({
            gameId: action.gameId,
            isSuccess: action.isSuccess
        }));
        yield delay(3000);
        yield put(actions.cancelQuestLoading());
    } catch (error) {
        yield put(actions.makeQuestError(error, 'Go On Quest Error'));
    }
}

export function* guessMerlin(api, action) {
    try {
        yield call(api.guessMerlin, ({
            gameId: action.gameId,
            merlin: action.merlin
        }));
    } catch (error) {
        yield put(actions.guessMerlinError(error, 'Guess Merlin Error'));
    }
}

export function* destroyGame(api, action) {
    try {
        yield call(api.destroyGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.destroyGameError(error, 'Destroy Game Error'));
    }
}

export function* leaveMidgame(api, action) {
    try {
        yield call(api.leaveMidgame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.leaveMidgameError(error, 'Leave Midgame Error'));
    }
}

export function* approveLeaveMidgame(api, action) {
    try {
        yield call(api.approveLeaveMidgame, ({
            gameId: action.gameId,
            isApprove: action.isApprove
        }));
    } catch (error) {
        yield put(actions.leaveMidgameError(error, 'Leave Midgame Error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.LEAVE_GAME_REQUEST, leaveGame, gameApi),
        takeEvery(actions.READY_UP_REQUEST, readyUp, gameApi),
        takeEvery(actions.START_GAME_REQUEST, startGame, gameApi),
        takeEvery(actions.NOMINATE_PLAYER_FOR_QUEST_REQUEST, nominatePlayerForQuest, gameApi),
        takeEvery(actions.CONFIRM_NOMINATIONS_REQUEST, confirmNominations, gameApi),
        takeEvery(actions.MAKE_VOTE_REQUEST, makeVote, gameApi),
        takeEvery(actions.MAKE_QUEST_REQUEST, goOnQuest, gameApi),
        takeEvery(actions.GUESS_MERLIN_REQUEST, guessMerlin, gameApi),
        takeEvery(actions.DESTROY_GAME_REQUEST, destroyGame, gameApi),
        takeEvery(actions.LEAVE_MIDGAME_REQUEST, leaveMidgame, gameApi),
        takeEvery(actions.APPROVE_LEAVE_MIDGAME_REQUEST, approveLeaveMidgame, gameApi)
    ]);
}
