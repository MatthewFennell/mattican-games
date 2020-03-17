
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    fetchPointsForUserInWeek: () => 'team'
};

describe('Points saga', () => {
    const alreadyFetchedData = fetched => ({ selector }, next) => {
        if (selector === selectors.alreadyFetchedUserPoints) {
            return fetched;
        }
        return next();
    };

    it('already fetched user points', () => {
        const action = actions.fetchUserPointsForWeekRequest('userId', 3);
        return expectSaga(sagas.getUserPointsForWeek, api, action)
            .provide([
                {
                    select: alreadyFetchedData(true)
                }
            ])
            .put(actions.alreadyFetchedPointsForWeek('userId', 3))
            .run();
    });

    it('getting user points', () => {
        const action = actions.fetchUserPointsForWeekRequest('userId', 3);
        return expectSaga(sagas.getUserPointsForWeek, api, action)
            .provide([
                {
                    select: alreadyFetchedData(false)
                }
            ])
            .put(actions.fetchUserPointsForWeekSuccess('userId', 3, 'team'))
            .run();
    });

    it('getting user points error', () => {
        const error = new Error('error');
        const action = actions.fetchUserPointsForWeekRequest('userId', 3);
        return expectSaga(sagas.getUserPointsForWeek, api, action)
            .provide([
                [matchers.call.fn(api.fetchPointsForUserInWeek), throwError(error)],
                { select: alreadyFetchedData(false) }
            ])
            .put(actions.fetchUserPointsForWeekError('userId', 3, error))
            .run();
    });
});
