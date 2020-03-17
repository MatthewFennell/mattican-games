import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as firebase from 'firebase';
import { noop } from 'lodash';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';
import * as currentTeamActions from '../currentteam/actions';
import { successDelay } from '../constants';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    fetchActiveTeam: () => ({
        players: ['players'],
        captain: 'captain'
    }),
    getAllPlayers: () => 'all players',
    getAllTeams: () => 'all teams',
    updateTeam: noop
};

describe('Transfers saga', () => {
    const provideDelay = ({ fn }, next) => ((fn.name === 'delayP') ? null : next());
    const alreadyFetchedInfo = fetched => ({ selector }, next) => {
        if (selector === selectors.getAllPlayers) {
            return fetched ? [1, 2, 3] : [];
        }
        if (selector === selectors.getAllTeams) {
            return fetched ? [1, 2, 3] : [];
        }
        if (selector === selectors.getCurrentTeam) {
            return fetched ? [{
                id: 'alreadyExist',
                position: 'Defender',
                price: 10,
                name: 'alreadyexists'
            }] : [];
        }
        return next();
    };

    it('fetch all players', () => {
        const action = actions.fetchAllPlayersRequest();
        return expectSaga(sagas.fetchAllPlayers, api, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.fetchAllPlayersSuccess('all players'))
            .run();
    });

    it('already fetched all players', () => {
        const action = actions.fetchAllPlayersRequest();
        return expectSaga(sagas.fetchAllPlayers, api, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .not.put(actions.fetchAllPlayersSuccess('all players'))
            .run();
    });

    it('fetch all players error', () => {
        const error = new Error('error');
        const action = actions.fetchAllPlayersRequest();
        return expectSaga(sagas.fetchAllPlayers, api, action)
            .provide([
                [matchers.call.fn(api.getAllPlayers), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.fetchAllPlayersError(error))
            .run();
    });

    it('fetch all teams', () => {
        const action = actions.fetchAllTeamsRequest();
        return expectSaga(sagas.fetchAllTeams, api, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.fetchAllTeamsSuccess('all teams'))
            .run();
    });

    it('already fetched all teams', () => {
        const action = actions.fetchAllTeamsRequest();
        return expectSaga(sagas.fetchAllTeams, api, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.alreadyFetchedAllPlayers())
            .run();
    });

    it('fetch all teams error', () => {
        const error = new Error('error');
        const action = actions.fetchAllTeamsRequest();
        return expectSaga(sagas.fetchAllTeams, api, action)
            .provide([
                [matchers.call.fn(api.getAllTeams), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.fetchAllTeamsError(error))
            .run();
    });

    it('can add player to current team', () => {
        const player = {
            id: 'id',
            position: 'Defender',
            price: 10
        };
        const action = actions.addPlayerToCurrentTeamRequest(player);
        return expectSaga(sagas.addPlayerToCurrentTeam, action)
            .provide([{ select: alreadyFetchedInfo(false) }])
            .put(actions.addPlayerToCurrentTeamSuccess(({
                ...player,
                position: 'DEFENDER'
            })))
            .run();
    });

    it('cant add player to current team', () => {
        const player = {
            id: 'alreadyExist',
            position: 'Defender',
            price: 10,
            name: 'alreadyexists'
        };
        const action = actions.addPlayerToCurrentTeamRequest(player);
        return expectSaga(sagas.addPlayerToCurrentTeam, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.addPlayerToCurrentTeamError({
                code: 'already-found',
                message: 'You already have that player selected'
            }))
            .run();
    });

    it('update team', () => {
        jest.spyOn(firebase, 'initializeApp')
            .mockImplementation(() => ({
                auth: () => ({
                })
            }));

        jest.spyOn(firebase, 'auth').mockImplementation(() => ({
            currentUser: {
                uid: 'uid'
            }
        }));

        const action = actions.updateTeamRequest('myTeam');
        return expectSaga(sagas.updateTeam, api, action)
            .provide([{ select: alreadyFetchedInfo(true) },
                { call: provideDelay }])
            .put(currentTeamActions.fetchActiveTeamSuccess('uid', ['players'], 'captain'))
            .put(actions.setSuccessMessage('Team successfully updated'))
            .delay(successDelay)
            .put(actions.closeSuccessMessage())
            .run();
    });

    it('update team error', () => {
        const error = new Error('error');
        const action = actions.updateTeamRequest('myTeam');
        return expectSaga(sagas.updateTeam, api, action)
            .provide([
                [matchers.call.fn(api.updateTeam), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.updateTeamError(error))
            .run();
    });

    it('replace player', () => {
        const playerToAdd = {
            id: 'does not exist',
            position: 'Midfielder',
            price: 13,
            name: 'does not exist'
        };
        const playerToRemove = {
            id: 'alreadyExist',
            position: 'Defender',
            price: 10,
            name: 'alreadyexists'
        };
        const action = actions.replacePlayerRequest(playerToRemove, playerToAdd);
        return expectSaga(sagas.replacePlayer, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.replacePlayerSuccess(playerToRemove, playerToAdd))
            .run();
    });

    it('cant replace player that does not exist', () => {
        const playerToAdd = {
            id: 'does not exist',
            position: 'Midfielder',
            price: 13,
            name: 'does not exist'
        };
        const playerToRemove = {
            id: 'also not exist',
            position: 'Attacker',
            price: 10,
            name: 'also not exist'
        };
        const action = actions.replacePlayerRequest(playerToRemove, playerToAdd);
        return expectSaga(sagas.replacePlayer, action)
            .provide([{ select: alreadyFetchedInfo(true) }])
            .put(actions.replacePlayerError({
                code: 'not-found',
                message: 'You are trying to remove a player not in your team'
            }))
            .run();
    });
});
