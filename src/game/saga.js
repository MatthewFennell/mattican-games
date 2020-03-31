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

export function* startGame(api, action) {
    try {
        if (action.mode === constants.gameModes.Avalon) {
            yield call(api.startAvalonGame, ({
                gameId: action.gameId
            }));
        }
        if (action.mode === constants.gameModes.Hitler) {
            yield call(api.startHitlerGame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(actions.gameError(error, 'Ready Up Error'));
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
        yield put(actions.gameError(error, 'Nominate Player Error'));
    }
}

export function* confirmNominations(api, action) {
    try {
        yield call(api.confirmNominations, ({
            gameId: action.gameId,
            nominations: action.nominations
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Nominate Player Error'));
    }
}

export function* makeVote(api, action) {
    try {
        yield call(api.makeVote, ({
            gameId: action.gameId,
            vote: action.vote
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Make Vote Error'));
    }
}

export function* goOnQuest(api, action) {
    try {
        yield call(api.goOnQuest, ({
            gameId: action.gameId,
            isSuccess: action.isSuccess
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Go On Quest Error'));
    }
}

export function* guessMerlin(api, action) {
    try {
        yield call(api.guessMerlin, ({
            gameId: action.gameId,
            merlin: action.merlin
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Guess Merlin Error'));
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
        yield call(api.leaveMidgame, ({
            gameId: action.gameId
        }));
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

export function* nominateChancellor(api, action) {
    try {
        yield call(api.nominateChancellor, ({
            gameId: action.gameId,
            chancellor: action.chancellor
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Nominate Chancellor Error'));
    }
}

export function* confirmChancellor(api, action) {
    try {
        yield call(api.confirmChancellor, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Chancellor Error'));
    }
}

export function* makeHitlerVote(api, action) {
    try {
        yield call(api.makeHitlerVote, ({
            gameId: action.gameId,
            vote: action.vote
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Make Vote Error'));
    }
}

export function* giveCardsToChancellor(api, action) {
    try {
        yield call(api.giveCardsToChancellor, ({
            gameId: action.gameId,
            cards: action.cards
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Give cards to chancellor error'));
    }
}

export function* playChancellorCard(api, action) {
    try {
        yield call(api.playChancellorCard, ({
            gameId: action.gameId,
            card: action.card
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Play Chancellor Card error'));
    }
}

export function* selectInvestigateRequest(api, action) {
    try {
        yield call(api.investigatePlayer, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Investigate Player error'));
    }
}

export function* confirmInvestigation(api, action) {
    try {
        yield call(api.confirmInvestigation, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Investigation error'));
    }
}

export function* makeTemporaryPresidentRequest(api, action) {
    try {
        yield call(api.temporaryPresident, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Make President error'));
    }
}

export function* confirmPresident(api, action) {
    try {
        yield call(api.confirmPresident, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm President error'));
    }
}

export function* killPlayer(api, action) {
    try {
        yield call(api.killPlayer, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Kill Player error'));
    }
}

export function* confirmKillPlayer(api, action) {
    try {
        yield call(api.confirmKillPlayer, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Kill Player error'));
    }
}

export function* initiateVeto(api, action) {
    try {
        yield call(api.initiateVeto, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Request Veto error'));
    }
}

export function* replyToVeto(api, action) {
    try {
        yield call(api.replyToVeto, ({
            gameId: action.gameId,
            isApprove: action.isApprove
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Reply to Veto error'));
    }
}

export function* closeTopThree(api, action) {
    try {
        yield call(api.closeTopThree, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Close Top three error'));
    }
}

export default function* overviewSaga() {
    yield all([
        takeEvery(actions.LEAVE_GAME_REQUEST, leaveGame, gameApi),
        takeEvery(actions.READY_UP_REQUEST, readyUp, gameApi),
        takeEvery(actions.START_GAME_REQUEST, startGame, gameApi),
        takeEvery(actions.NOMINATE_PLAYER_FOR_QUEST_REQUEST, nominatePlayerForQuest, gameApi),
        takeEvery(actions.CONFIRM_NOMINATIONS_REQUEST, confirmNominations, gameApi),
        takeEvery(actions.MAKE_AVALON_VOTE_REQUEST, makeVote, gameApi),
        takeEvery(actions.MAKE_QUEST_REQUEST, goOnQuest, gameApi),
        takeEvery(actions.GUESS_MERLIN_REQUEST, guessMerlin, gameApi),
        takeEvery(actions.DESTROY_GAME_REQUEST, destroyGame, gameApi),
        takeEvery(actions.LEAVE_MIDGAME_REQUEST, leaveMidgame, gameApi),
        takeEvery(actions.APPROVE_LEAVE_MIDGAME_REQUEST, approveLeaveMidgame, gameApi),

        takeEvery(actions.NOMINATE_CHANCELLOR_REQUEST, nominateChancellor, gameApi),
        takeEvery(actions.CONFIRM_CHANCELLOR_REQUEST, confirmChancellor, gameApi),
        takeEvery(actions.MAKE_HITLER_VOTE_REQUEST, makeHitlerVote, gameApi),
        takeEvery(actions.GIVE_CARDS_TO_CHANCELLOR_REQUEST, giveCardsToChancellor, gameApi),
        takeEvery(actions.PLAY_CHANCELLOR_CARD_REQUEST, playChancellorCard, gameApi),
        takeEvery(actions.SELECT_INVESTIGATE_REQUEST, selectInvestigateRequest, gameApi),
        takeEvery(actions.CONFIRM_INVESIGATION_REQUEST, confirmInvestigation, gameApi),
        takeEvery(actions.MAKE_TEMPORARY_PRESIDENT_REQUEST, makeTemporaryPresidentRequest, gameApi),
        takeEvery(actions.CONFIRM_PRESIDENT_REQUEST, confirmPresident, gameApi),
        takeEvery(actions.KILL_PLAYER_REQUEST, killPlayer, gameApi),
        takeEvery(actions.CONFIRM_KILL_PLAYER_REQUEST, confirmKillPlayer, gameApi),
        takeEvery(actions.INITIATE_VETO_REQUEST, initiateVeto, gameApi),
        takeEvery(actions.REPLY_TO_VETO_REQUEST, replyToVeto, gameApi),
        takeEvery(actions.CLOSE_LOOK_AT_TOP_THREE, closeTopThree, gameApi)
    ]);
}
