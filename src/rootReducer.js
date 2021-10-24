import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import { connectRouter } from 'connected-react-router';
import adminReducer from './admin/reducer';
import authReducer from './auth/reducer';
import overviewReducer from './overview/reducer';
import * as authActions from './auth/actions';
import profileReducer from './profile/reducer';
import game from './game/reducer';
import othello from './game/othello/reducer';
import hitler from './game/hitler/reducer';
import telestrations from './game/telestrations/reducer';

const appReducer = history => combineReducers({
    admin: adminReducer,
    auth: authReducer,
    game,
    othello,
    hitler,
    telestrations,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    overview: overviewReducer,
    profile: profileReducer,
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
