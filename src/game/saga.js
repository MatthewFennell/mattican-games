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
        if (action.mode === constants.gameModes.WhosInTheHat) {
            yield call(api.startWhoInHatGame, ({
                gameId: action.gameId
            }));
        }
        if (action.mode === constants.gameModes.Articulate) {
            yield call(api.startArticulateGame, ({
                gameId: action.gameId
            }));
        }
    } catch (error) {
        yield put(actions.gameError(error, 'Start Game Error'));
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
        if (action.mode === constants.gameModes.WhosInTheHat) {
            yield call(api.leaveWhoInHatGame, ({
                gameId: action.gameId
            }));
        } else if (action.mode === constants.gameModes.Articulate) {
            yield call(api.leaveArticulateGame, ({
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

export function* editGameHitler(api, action) {
    try {
        yield call(api.editGameHitler, ({
            gameId: action.gameId,
            numberOfPlayers: action.numberOfPlayers
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Edit Game error'));
    }
}

export function* editGameAvalon(api, action) {
    try {
        yield call(api.editGameAvalon, ({
            gameId: action.gameId,
            numberOfPlayers: action.numberOfPlayers,
            roles: action.roles
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Edit Game error'));
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
        yield put(actions.gameError(error, 'Edit Game error'));
    }
}

export function* closeLookAtInvestigation(api, action) {
    try {
        yield call(api.closeInvestigation, ({
            gameId: action.gameId,
            isFirst: action.isFirst
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Close Investigation error'));
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

export function* addWord(api, action) {
    try {
        yield call(api.addWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Add Word error'));
    }
}

export function* startWhoInHat(api, action) {
    try {
        yield call(api.startWhoInHat, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Start Game error'));
    }
}

export function* startWhoInHatRound(api, action) {
    try {
        yield call(api.startWhoInHatRound, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Start Round error'));
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

export function* loadSummary(api, action) {
    try {
        yield call(api.loadSummary, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Load Summary error'));
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

export function* confirmScore(api, action) {
    try {
        yield call(api.confirmScore, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Score error'));
    }
}

export function* leaveWhoInHatGame(api, action) {
    try {
        yield call(api.leaveWhoInHatGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Game error'));
    }
}

export function* joinWhoInHatTeamMidgame(api, action) {
    try {
        yield call(api.joinWhoInHatTeamMidgame, ({
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

export function* editArticulateGame(api, action) {
    try {
        yield call(api.editArticulateGame, ({
            gameId: action.gameId,
            skippingRule: action.skippingRule,
            timePerRound: action.timePerRound
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Edit Game error'));
    }
}

export function* startArticulate(api, action) {
    try {
        yield call(api.startArticulate, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Start Game error'));
    }
}

export function* startArticulateRound(api, action) {
    try {
        yield call(api.startArticulateRound, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Start Round error'));
    }
}

export function* skipArticulateWord(api, action) {
    try {
        yield call(api.skipArticulateWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Skip Word error'));
    }
}

export function* gotArticulateWord(api, action) {
    try {
        yield call(api.gotArticulateWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Got Word error'));
    }
}

export function* trashArticulateWord(api, action) {
    try {
        yield call(api.trashArticulateWord, ({
            gameId: action.gameId,
            word: action.word
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Trash Word error'));
    }
}

export function* loadArticulateSummary(api, action) {
    try {
        yield call(api.loadArticulateSummary, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Load Summary error'));
    }
}

export function* setArticulateWordConfirmed(api, action) {
    try {
        yield call(api.setArticulateWordConfirmed, ({
            gameId: action.gameId,
            word: action.word,
            isConfirmed: action.isConfirmed
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Word error'));
    }
}

export function* confirmArticulateScore(api, action) {
    try {
        yield call(api.confirmArticulateScore, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Score error'));
    }
}

export function* confirmSpadeRoundWinner(api, action) {
    try {
        yield call(api.confirmSpadeRoundWinner, ({
            gameId: action.gameId,
            name: action.name
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Winner error'));
    }
}

export function* confirmArticulateWinner(api, action) {
    try {
        yield call(api.confirmArticulateWinner, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Confirm Winner error'));
    }
}

export function* leaveArticulateGame(api, action) {
    try {
        yield call(api.leaveArticulateGame, ({
            gameId: action.gameId
        }));
    } catch (error) {
        yield put(actions.gameError(error, 'Leave Game error'));
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
        takeEvery(actions.CLOSE_LOOK_AT_TOP_THREE_REQUEST, closeTopThree, gameApi),
        takeEvery(actions.EDIT_HITLER_GAME_REQUEST, editGameHitler, gameApi),
        takeEvery(actions.EDIT_AVALON_GAME_REQUEST, editGameAvalon, gameApi),
        takeEvery(actions.EDIT_WHO_IN_HAT_GAME_REQUEST, editGameWhoInHat, gameApi),
        takeEvery(actions.CLOSE_LOOK_AT_INVESTIGATION_REQUEST, closeLookAtInvestigation, gameApi),

        takeEvery(actions.EDIT_DISPLAY_NAME, editDisplayName, gameApi),

        takeEvery(actions.ADD_TEAM_REQUEST, addTeam, gameApi),
        takeEvery(actions.JOIN_TEAM_REQUEST, joinTeam, gameApi),
        takeEvery(actions.ADD_WORD_REQUEST, addWord, gameApi),
        takeEvery(actions.START_WHO_IN_HAT_GAME_REQUEST, startWhoInHat, gameApi),
        takeEvery(actions.START_WHO_IN_HAT_ROUND_REQUEST, startWhoInHatRound, gameApi),
        takeEvery(actions.GOT_WHO_IN_HAT_WORD_REQUEST, gotWord, gameApi),
        takeEvery(actions.SKIP_WORD_WHO_IN_HAT_REQUEST, skipWord, gameApi),
        takeEvery(actions.TRASH_WORD_WHO_IN_HAT_REQUEST, trashWord, gameApi),
        takeEvery(actions.LOAD_SCORE_SUMMARY_REQUEST, loadSummary, gameApi),
        takeEvery(actions.SET_WORD_CONFIRMED_REQUEST, confirmWord, gameApi),
        takeEvery(actions.CONFIRM_SCORE_REQUEST, confirmScore, gameApi),
        takeEvery(actions.LEAVE_WHO_IN_HAT_GAME_REQUEST, leaveWhoInHatGame, gameApi),
        takeEvery(actions.JOIN_WHO_IN_HAT_TEAM_MIDGAME_REQUEST, joinWhoInHatTeamMidgame, gameApi),
        takeEvery(actions.RANDOMISE_TEAMS_REQUEST, randomiseTeams, gameApi),

        takeEvery(actions.EDIT_ARTICULATE_GAME_REQUEST, editArticulateGame, gameApi),
        takeEvery(actions.START_ARTICULATE_GAME_REQUEST, startArticulate, gameApi),
        takeEvery(actions.START_ARTICULATE_ROUND_REQUEST, startArticulateRound, gameApi),
        takeEvery(actions.SKIP_WORD_ARTICULATE_REQUEST, skipArticulateWord, gameApi),
        takeEvery(actions.GOT_ARTICULATE_WORD_REQUEST, gotArticulateWord, gameApi),
        takeEvery(actions.TRASH_ARTICULATE_WORD_REQUEST, trashArticulateWord, gameApi),
        takeEvery(actions.LOAD_ARTICULATE_SUMMARY_REQUEST, loadArticulateSummary, gameApi),
        takeEvery(actions.SET_ARTICULATE_WORD_CONFIRMED_REQUEST, setArticulateWordConfirmed,
            gameApi),
        takeEvery(actions.CONFIRM_ARTICULATE_SCORE_REQUEST, confirmArticulateScore, gameApi),
        takeEvery(actions.SPADE_ROUND_WINNER_REQUEST, confirmSpadeRoundWinner, gameApi),
        takeEvery(actions.CONFIRM_ARTICULATE_WINNER, confirmArticulateWinner, gameApi),
        takeEvery(actions.LEAVE_ARTICULATE_GAME_REQUEST, leaveArticulateGame, gameApi)
    ]);
}
