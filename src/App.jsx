import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';


import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import * as selectors from './selectors';

import defaultStyles from './App.module.scss';
import NewNavbar from './navbar/NewNavbar';

import RenderRoutes from './RenderRoutes';
import Spinner from './common/spinner/Spinner';

const App = props => (
    props.auth && props.auth.isLoaded ? (
        <ConnectedRouter history={props.history}>
            <>
                <CssBaseline />
                <div className={props.styles.app}>
                    <NewNavbar />
                    <Toolbar />
                    {!props.loadingApp
                        ? (
                            <Container className={props.styles.appContainer}>
                                <RenderRoutes
                                    auth={props.auth}
                                    gameId={props.gameId}
                                    pathname={props.pathname}
                                />
                            </Container>
                        ) : (
                            <div className={props.styles.loadingWrapper}>
                                <div className={props.styles.loadingMessage}>Loading App</div>
                                <Spinner color="secondary" />
                            </div>
                        )}
                </div>
            </>
        </ConnectedRouter>
    ) : null
);

App.defaultProps = {
    auth: {
        isLoaded: false
    },
    gameId: null,
    history: {},
    loadingApp: false,
    pathname: '',
    styles: defaultStyles
};

App.propTypes = {
    auth: PropTypes.shape({
        isLoaded: PropTypes.bool,
        uid: PropTypes.string
    }),
    gameId: PropTypes.string,
    history: PropTypes.shape({}),
    loadingApp: PropTypes.bool,
    pathname: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    gameId: selectors.getMyGames(state),
    loadingApp: state.auth.loadingApp,
    pathname: state.router.location.pathname
});

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect(() => [
        {
            collection: 'games'
        }
    ]),
)(App);
