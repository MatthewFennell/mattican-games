import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as gameApi from './api';
import * as constants from '../constants';

export function* leaveGame(api, action) {
    try {
        yield call(api.leaveGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Game Error'));
    }
}

export function* readyUp(api, action) {
    try {
        yield call(api.readyUp, ({
            gameId: action.gameId,
            isReady: action.isReady
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Ready Up Error'));
    }
}

export function* destroyGame(api, action) {
    try {
        yield call(api.destroyGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Destroy Game Error'));
    }
}

export function* leaveMidgame(api, action) {
    try {
        if (action.mode === constants.gameModes.WhosInTheHat) {
            yield call(api.sharedLeaveMidgame, ({
                gameId: action.gameId
            }));
        } else if (action.mode === constants.gameModes.Articulate) {
            yield call(api.sharedLeaveMidgame, ({
                gameId: action.gameId
            }));
        } else {
            yield call(api.leaveMidgame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Midgame Error'));
    }
}

export function* approveLeaveMidgame(api, action) {
    try {
        yield call(api.approveLeaveMidgame, ({
            gameId: action.gameId,
            isApprove: action.isApprove
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Midgame Error'));
    }
}

export function* editDisplayName(api, action) {
    try {
        yield call(api.editDisplayName, ({
            gameId: action.gameId,
            displayName: action.displayName
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Edit Display Name error'));
    }
}

export function* addTeam(api, action) {
    try {
        yield call(api.addTeam, ({
            gameId: action.gameId,
            teamName: action.teamName
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Add Team error'));
    }
}

export function* joinTeam(api, action) {
    try {
        yield call(api.joinTeam, ({
            gameId: action.gameId,
            teamName: action.teamName
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Join Team error'));
    }
}

export function* gotWord(api, action) {
    try {
        yield call(api.gotWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Got Word error'));
    }
}

export function* skipWord(api, action) {
    try {
        yield call(api.skipWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Skip Word error'));
    }
}

export function* trashWord(api, action) {
    try {
        yield call(api.trashWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Trash Word error'));
    }
}

export function* confirmWord(api, action) {
    try {
        yield call(api.confirmWord, ({
            gameId: action.gameId,
            word: action.word,
            isConfirmed: action.isConfirmed
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Word error'));
    }
}

export function* leaveUnconstrainedGame(api, action) {
    try {
        yield call(api.leaveUnconstrainedMidgame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Game error'));
    }
}

export function* joinTeamMidgame(api, action) {
    try {
        yield call(api.joinTeamMidgame, ({
            gameId: action.gameId,
            teamName: action.teamName
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Join Midgame error'));
    }
}

export function* randomiseTeams(api, action) {
    try {
        yield call(api.randomiseTeams, ({
            gameId: action.gameId,
            numberOfTeams: action.numberOfTeams
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Randomise Teams error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.LEAVE_GAME_REQUEST, leaveGame, gameApi),
        takeEvery(actions.READY_UP_REQUEST, readyUp, gameApi),
        takeEvery(actions.DESTROY_GAME_REQUEST, destroyGame, gameApi),
        takeEvery(actions.LEAVE_MIDGAME_REQUEST, leaveMidgame, gameApi),
        takeEvery(actions.APPROVE_LEAVE_MIDGAME_REQUEST, approveLeaveMidgame, gameApi),

        takeEvery(actions.EDIT_DISPLAY_NAME, editDisplayName, gameApi),

        takeEvery(actions.ADD_TEAM_REQUEST, addTeam, gameApi),
        takeEvery(actions.JOIN_TEAM_REQUEST, joinTeam, gameApi),
        takeEvery(actions.GOT_WORD_REQUEST, gotWord, gameApi),
        takeEvery(actions.SKIP_WORD_WHO_IN_HAT_REQUEST, skipWord, gameApi),
        takeEvery(actions.TRASH_WORD_WHO_IN_HAT_REQUEST, trashWord, gameApi),
        takeEvery(actions.SET_WORD_CONFIRMED_REQUEST, confirmWord, gameApi),
        takeEvery(actions.LEAVE_UNCONSTRAINED_GAME_REQUEST, leaveUnconstrainedGame, gameApi),
        takeEvery(actions.JOIN_TEAM_MIDGAME_REQUEST, joinTeamMidgame, gameApi),
        takeEvery(actions.RANDOMISE_TEAMS_REQUEST, randomiseTeams, gameApi)
    ]);
}
