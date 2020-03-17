import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import defaultStyles from './App.module.scss';
import NewNavbar from './navbar/NewNavbar';

import RenderRoutes from './RenderRoutes';

const App = props => (
    props.auth && props.auth.isLoaded ? (
        <ConnectedRouter history={props.history}>
            <>
                <CssBaseline />
                <div className={props.styles.app}>
                    <NewNavbar />
                    <Toolbar />
                    <Container className={props.styles.appContainer}>
                        <RenderRoutes auth={props.auth} maxGameWeek={props.maxGameWeek} />
                    </Container>
                </div>
            </>
        </ConnectedRouter>
    ) : null
);

App.defaultProps = {
    auth: {
        isLoaded: false
    },
    history: {},
    maxGameWeek: null,
    styles: defaultStyles
};

App.propTypes = {
    auth: PropTypes.shape({
        isLoaded: PropTypes.bool,
        uid: PropTypes.string
    }),
    history: PropTypes.shape({}),
    maxGameWeek: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    maxGameWeek: state.overview.maxGameWeek
});

export default connect(mapStateToProps)(App);
