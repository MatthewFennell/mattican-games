import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as selectors from './selectors';
import GameNotStarted from './GameNotStarted';
import GameStarted from './GameStarted';

const Game = props => {
    if (!props.currentGame.hasStarted) {
        return <GameNotStarted />;
    }

    return (
        <GameStarted />
    );
};

Game.defaultProps = {
    currentGame: {
        hasStarted: false
    }
};

Game.propTypes = {
    currentGame: PropTypes.shape({
        hasStarted: PropTypes.bool
    })
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, props) => ({
    currentGame: selectors.getCurrentGame(state, props)
});

export default withRouter(compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        }
    ]),
)(Game));

export { Game as GameUnconnected };
