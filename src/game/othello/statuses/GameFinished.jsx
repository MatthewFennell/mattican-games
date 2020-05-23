import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './GameFinished.module.scss';

const GameFinished = props => (
    <div className={props.styles.gameFinishedWrapper}>
        Game Finished
    </div>
);

GameFinished.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
    },
    currentGameId: '',
    styles: defaultStyles,
    users: {}
};

GameFinished.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
    }),
    currentGameId: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameFinished;
