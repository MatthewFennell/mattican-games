import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import defaultStyles from './Game.module.scss';
import * as selectors from './selectors';
import GameNotStarted from './GameNotStarted';

const Game = props => {
    console.log('currentGame', props.currentGame);


    if (!props.currentGame.hasStarted) {
        return <GameNotStarted />;
    }


    return (
        <div className={props.styles.gameWrapper}>
            In a game
        </div>
    );
};

Game.defaultProps = {
    currentGame: {
        hasStarted: false
    },
    styles: defaultStyles
};

Game.propTypes = {
    currentGame: PropTypes.shape({
        hasStarted: PropTypes.bool
    }),
    styles: PropTypes.objectOf(PropTypes.string)
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
