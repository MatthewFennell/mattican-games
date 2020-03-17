import {
    all, takeEvery, put, call, select, delay
} from 'redux-saga/effects';
import firebase from 'firebase';
import * as actions from './actions';
import * as transfersApi from './api';
import * as selectors from './selectors';
import * as helpers from './helpers';
import * as currentTeamActions from '../currentteam/actions';
import { successDelay } from '../constants';

export function* fetchAllPlayers(api) {
    try {
        const alreadyFetched = yield select(selectors.getAllPlayers);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const allPlayers = yield call(api.getAllPlayers);
            yield put(actions.fetchAllPlayersSuccess(allPlayers));
        }
    } catch (error) {
        yield put(actions.fetchAllPlayersError(error));
    }
}

export function* fetchAllTeams(api) {
    try {
        const alreadyFetched = yield select(selectors.getAllTeams);
        if (alreadyFetched && alreadyFetched.length === 0) {
            const allTeams = yield call(api.getAllTeams);
            yield put(actions.fetchAllTeamsSuccess(allTeams));
        } else {
            yield put(actions.alreadyFetchedAllPlayers());
        }
    } catch (error) {
        yield put(actions.fetchAllTeamsError(error));
    }
}

export function* addPlayerToCurrentTeam(action) {
    const currentTeam = yield select(selectors.getCurrentTeam);
    const canAddPlayer = helpers.canAddPlayer(action.player, currentTeam);
    if (canAddPlayer === true) {
        yield put(actions.addPlayerToCurrentTeamSuccess({
            ...action.player,
            position: action.player.position.toUpperCase()
        }));
    } else {
        yield put(actions.addPlayerToCurrentTeamError(canAddPlayer));
    }
}

export function* updateTeam(api) {
    try {
        const currentTeam = yield select(selectors.getCurrentTeam);
        yield call(api.updateTeam, {
            newTeam: currentTeam.map(player => player.id)
        });
        const myId = firebase.auth().currentUser.uid;
        const activeTeam = yield call(api.fetchActiveTeam, { userId: myId });
        yield put(currentTeamActions.fetchActiveTeamSuccess(myId,
            activeTeam.players, activeTeam.captain));
        yield put(actions.setSuccessMessage('Team successfully updated'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.updateTeamError(error));
    }
}

export function* replacePlayer(action) {
    const currentTeam = yield select(selectors.getCurrentTeam);
    const canAddPlayer = helpers.canReplacePlayer(action.oldPlayer, action.newPlayer, currentTeam);
    if (canAddPlayer === true) {
        yield put(actions.replacePlayerSuccess(action.oldPlayer, action.newPlayer));
    } else {
        yield put(actions.replacePlayerError(canAddPlayer));
    }
}

export default function* transfersSaga() {
    yield all([
        takeEvery(actions.FETCH_ALL_PLAYERS_REQUEST, fetchAllPlayers, transfersApi),
        takeEvery(actions.FETCH_ALL_TEAMS_REQUEST, fetchAllTeams, transfersApi),
        takeEvery(actions.ADD_PLAYER_TO_CURRENT_TEAM_REQUEST, addPlayerToCurrentTeam),
        takeEvery(actions.UPDATE_TEAM_REQUEST, updateTeam, transfersApi),
        takeEvery(actions.REPLACE_PLAYER_REQUEST, replacePlayer)
    ]);
}
