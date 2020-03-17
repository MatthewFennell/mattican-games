import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    getAllTeams: () => ['a', 'b']
};

describe('Current team saga', () => {
    const alreadyFetchedInfo = fetched => ({ selector }, next) => {
        if (selector === selectors.getAllTeams) {
            return fetched ? [1, 2, 3] : [];
        }
        return next();
    };

    it('already fetched active team', () => {
        const action = actions.fetchAllTeamsRequest();
        return expectSaga(sagas.fetchAllTeams, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(true)
                }
            ])
            .put(actions.alreadyFetchedTeams())
            .run();
    });

    it('fetches all team', () => {
        const action = actions.fetchAllTeamsRequest();
        return expectSaga(sagas.fetchAllTeams, api, action)
            .provide([
                {
                    select: alreadyFetchedInfo(false)
                }
            ])
            .put(actions.fetchAllTeamsSuccess(['a', 'b']))
            .run();
    });

    it('fetches all team error', () => {
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
});
