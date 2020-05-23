import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './GameActive.module.scss';

const GameActive = props => (
    <div className={props.styles.gameActiveWrapper}>
        Game Active
    </div>
);

GameActive.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
    },
    currentGameId: '',
    styles: defaultStyles,
    users: {}
};

GameActive.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
    }),
    currentGameId: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameActive;
