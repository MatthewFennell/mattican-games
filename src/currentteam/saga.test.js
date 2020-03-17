import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { noop } from 'lodash';
import * as firebase from 'firebase';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    fetchActiveTeam: () => ({
        players: 'players',
        captain: 'captain'
    }),
    makeCaptain: noop
};

describe('Current team saga', () => {
    const alreadyFetchedInfo = fetched => ({ selector }, next) => {
        if (selector === selectors.getAlreadyFetchedForUser) {
            return fetched;
        }
        return next();
    };

    it('already fetched active team', () => {
        const action = actions.fetchActiveTeamRequest('userId');
        return expectSaga(sagas.fetchActiveTeam, false, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(true)
                }
            ])
            .put(actions.alreadyFetchedActiveTeam('userId'))
            .run();
    });

    it('fetch active team', () => {
        const action = actions.fetchActiveTeamRequest('userId');
        return expectSaga(sagas.fetchActiveTeam, false, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(false)
                }
            ])
            .put(actions.fetchActiveTeamSuccess('userId', 'players', 'captain'))
            .run();
    });

    it('fetch active team forced', () => {
        const action = actions.fetchActiveTeamRequest('userId');
        return expectSaga(sagas.fetchActiveTeam, true, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(true)
                }
            ])
            .put(actions.fetchActiveTeamSuccess('userId', 'players', 'captain'))
            .run();
    });

    it('fetch active team error', () => {
        const error = new Error('error');
        const action = actions.fetchActiveTeamRequest('userId');
        return expectSaga(sagas.fetchActiveTeam, false, api, action)
            .provide([
                [matchers.call.fn(api.fetchActiveTeam), throwError(error)],
                { select: alreadyFetchedInfo(false) }
            ])
            .put(actions.fetchActiveTeamError(error))
            .run();
    });

    it('make captain', () => {
        const onAuthStateChanged = jest.fn();

        jest.spyOn(firebase, 'initializeApp')
            .mockImplementation(() => ({
                auth: noop
            }));

        jest.spyOn(firebase, 'auth').mockImplementation(() => ({
            onAuthStateChanged,
            currentUser: {
                displayName: 'testDisplayName',
                email: 'test@test.com',
                emailVerified: true,
                providerData: ['google', 'facebook'],
                uid: 'uniqueId'
            }
        }));

        const action = actions.makeCaptainRequest('playerId');
        return expectSaga(sagas.makeCaptain, api, action)
            .put(actions.reloadActiveTeamRequest('uniqueId'))
            .run();
    });

    it('make captain error', () => {
        const error = new Error('error');
        const action = actions.makeCaptainRequest('playerId');
        return expectSaga(sagas.makeCaptain, api, action)
            .provide([
                [matchers.call.fn(api.makeCaptain), throwError(error)]
            ])
            .put(actions.makeCaptainError(error))
            .run();
    });
});
