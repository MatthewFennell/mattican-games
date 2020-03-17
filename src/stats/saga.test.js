
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as sagas from './saga';
import * as actions from './actions';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    getTeamStatsByWeek: id => ({
        id: id.teamId,
        minWeek: id.minWeek,
        maxWeek: id.maxWeek
    })
};

describe('Stats saga', () => {
    it('fetch stats success', () => {
        const action = actions.fetchTeamStatsByWeekRequest('teamId', 3, 7);
        return expectSaga(sagas.fetchStats, api, action)
            .put(actions.fetchTeamStatsByWeekSuccess('teamId', 3, 7, {
                id: 'teamId',
                minWeek: 3,
                maxWeek: 7
            }))
            .run();
    });

    it('fetch stats error', () => {
        const error = new Error('error');
        const action = actions.fetchTeamStatsByWeekRequest('teamId', 3, 7);
        return expectSaga(sagas.fetchStats, api, action)
            .provide([
                [matchers.call.fn(api.getTeamStatsByWeek), throwError(error)]
            ])
            .put(actions.fetchTeamStatsByWeekError(error))
            .run();
    });
});
