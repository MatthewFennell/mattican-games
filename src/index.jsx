/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { firebaseApp } from './config/fbConfig';
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';
import App from './App';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    logErrors: false
};

const sagaMiddleware = createSagaMiddleware();

const enhancers = compose(
    applyMiddleware(routerMiddleware(history), sagaMiddleware),
    process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
);

const store = createStore(createRootReducer(history), enhancers);

const rrfProps = {
    firebase: firebaseApp,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
};

sagaMiddleware.run(rootSaga, getFirebase);

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <App history={history} />
        </ReactReduxFirebaseProvider>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();

// https://console.cloud.google.com/functions/list?project=YOUR_PROJECT_NAME - kill cloud function
