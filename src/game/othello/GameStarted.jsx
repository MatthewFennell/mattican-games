/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './GameStarted.module.scss';
import GameActive from './statuses/GameActive';
import GameFinished from './statuses/GameFinished';

const GameStarted = props => {
    const generateComponent = () => {
        if (!props.currentGame.hasFinished) {
            return (
                <GameActive
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    users={props.users}
                />
            );
        }

        return (
            <GameFinished
                auth={props.auth}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                users={props.users}
            />
        );
    };

    return (
        <>
            {generateComponent()}
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        hasFinished: false
    },
    currentGameId: '',
    users: {},
    styles: defaultStyles
};

GameStarted.propTypes = {

    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        hasFinished: PropTypes.bool
    }),
    currentGameId: PropTypes.string,
    users: PropTypes.shape({}),
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
