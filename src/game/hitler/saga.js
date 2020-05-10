import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import * as actions from './actions';
import * as hitlerApi from './api';
import * as commonActions from '../actions';


export function* nominateChancellor(api, action) {
    try {
        yield call(api.nominateChancellor, ({
            gameId: action.gameId,
            chancellor: action.chancellor
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Nominate Chancellor Error'));
    }
}

export function* confirmChancellor(api, action) {
    try {
        yield call(api.confirmChancellor, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Chancellor Error'));
    }
}

export function* makeHitlerVote(api, action) {
    try {
        yield call(api.makeHitlerVote, ({
            gameId: action.gameId,
            vote: action.vote
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Make Vote Error'));
    }
}


export function* giveCardsToChancellor(api, action) {
    try {
        yield call(api.giveCardsToChancellor, ({
            gameId: action.gameId,
            cards: action.cards
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Give cards to chancellor error'));
    }
}


export function* playChancellorCard(api, action) {
    try {
        yield call(api.playChancellorCard, ({
            gameId: action.gameId,
            card: action.card
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Play Chancellor Card error'));
    }
}

export function* selectInvestigateRequest(api, action) {
    try {
        yield call(api.investigatePlayer, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Investigate Player error'));
    }
}

export function* confirmInvestigation(api, action) {
    try {
        yield call(api.confirmInvestigation, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Investigation error'));
    }
}

export function* makeTemporaryPresidentRequest(api, action) {
    try {
        yield call(api.temporaryPresident, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Make President error'));
    }
}

export function* confirmPresident(api, action) {
    try {
        yield call(api.confirmPresident, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm President error'));
    }
}

export function* killPlayer(api, action) {
    try {
        yield call(api.killPlayer, ({
            gameId: action.gameId,
            player: action.player
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Kill Player error'));
    }
}

export function* confirmKillPlayer(api, action) {
    try {
        yield call(api.confirmKillPlayer, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Confirm Kill Player error'));
    }
}

export function* initiateVeto(api, action) {
    try {
        yield call(api.initiateVeto, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Request Veto error'));
    }
}

export function* replyToVeto(api, action) {
    try {
        yield call(api.replyToVeto, ({
            gameId: action.gameId,
            isApprove: action.isApprove
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Reply to Veto error'));
    }
}

export function* closeTopThree(api, action) {
    try {
        yield call(api.closeTopThree, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Close Top three error'));
    }
}

export function* editGameHitler(api, action) {
    try {
        yield call(api.editGameHitler, ({
            gameId: action.gameId,
            numberOfPlayers: action.numberOfPlayers
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Edit Game error'));
    }
}

export function* closeLookAtInvestigation(api, action) {
    try {
        yield call(api.closeInvestigation, ({
            gameId: action.gameId,
            isFirst: action.isFirst
        }));
    } catch (error) {
        yield put(commonActions.gameError(error, 'Close Investigation error'));
    }
}

export default function* whoInHatSaga() {
    yield all([
        takeEvery(actions.NOMINATE_CHANCELLOR_REQUEST, nominateChancellor, hitlerApi),
        takeEvery(actions.CONFIRM_CHANCELLOR_REQUEST, confirmChancellor, hitlerApi),
        takeEvery(actions.MAKE_HITLER_VOTE_REQUEST, makeHitlerVote, hitlerApi),
        takeEvery(actions.GIVE_CARDS_TO_CHANCELLOR_REQUEST, giveCardsToChancellor, hitlerApi),
        takeEvery(actions.PLAY_CHANCELLOR_CARD_REQUEST, playChancellorCard, hitlerApi),
        takeEvery(actions.SELECT_INVESTIGATE_REQUEST, selectInvestigateRequest, hitlerApi),
        takeEvery(actions.CONFIRM_INVESIGATION_REQUEST, confirmInvestigation, hitlerApi),
        takeEvery(actions.MAKE_TEMPORARY_PRESIDENT_REQUEST, makeTemporaryPresidentRequest,
            hitlerApi),
        takeEvery(actions.CONFIRM_PRESIDENT_REQUEST, confirmPresident, hitlerApi),
        takeEvery(actions.KILL_PLAYER_REQUEST, killPlayer, hitlerApi),
        takeEvery(actions.CONFIRM_KILL_PLAYER_REQUEST, confirmKillPlayer, hitlerApi),
        takeEvery(actions.INITIATE_VETO_REQUEST, initiateVeto, hitlerApi),
        takeEvery(actions.REPLY_TO_VETO_REQUEST, replyToVeto, hitlerApi),
        takeEvery(actions.CLOSE_LOOK_AT_TOP_THREE_REQUEST, closeTopThree, hitlerApi),
        takeEvery(actions.EDIT_HITLER_GAME_REQUEST, editGameHitler, hitlerApi),
        takeEvery(actions.CLOSE_LOOK_AT_INVESTIGATION_REQUEST, closeLookAtInvestigation, hitlerApi)


    ]);
}
