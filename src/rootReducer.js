import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import { connectRouter } from 'connected-react-router';
import adminReducer from './admin/reducer';
import authReducer from './auth/reducer';
import leagueReducer from './leagues/reducer';
import overviewReducer from './overview/reducer';
import currentTeamReducer from './currentteam/reducer';
import pointsReducer from './points/reducer';
import * as authActions from './auth/actions';
import profileReducer from './profile/reducer';
import transfersReducer from './transfers/reducer';
import statsReducer from './stats/reducer';
import chartsReducer from './charts/reducer';
import highlightsReducer from './highlights/reducer';
import fixturesReducer from './fixtures/reducer';
import featuresReducer from './featurerequest/reducer';

const appReducer = history => combineReducers({
    admin: adminReducer,
    auth: authReducer,
    charts: chartsReducer,
    currentTeam: currentTeamReducer,
    leagues: leagueReducer,
    features: featuresReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    fixtures: fixturesReducer,
    highlights: highlightsReducer,
    overview: overviewReducer,
    points: pointsReducer,
    profile: profileReducer,
    transfers: transfersReducer,
    stats: statsReducer,
    router: connectRouter(history)
});

const rootReducer = history => (state, action) => {
    if (action.type === authActions.SIGN_OUT_SUCCESS) {
        // eslint-disable-next-line no-param-reassign
        state = undefined;
    }
    return appReducer(history)(state, action);
};

export default rootReducer;
