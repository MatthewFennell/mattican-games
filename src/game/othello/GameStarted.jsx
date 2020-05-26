/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './GameStarted.module.scss';
import GameActive from './statuses/GameActive';
import { placeDiscRequest, leaveGameRequest } from './actions';

const GameStarted = props => {
    const generateComponent = () => (
        <GameActive
            auth={props.auth}
            currentGame={props.currentGame}
            currentGameId={props.currentGameId}
            leaveGameRequest={() => props.leaveGameRequest(props.currentGameId)}
            placeDiscRequest={props.placeDiscRequest}
            users={props.users}
        />
    );

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
    }),
    currentGameId: PropTypes.string,
    leaveGameRequest: PropTypes.func.isRequired,
    placeDiscRequest: PropTypes.func.isRequired,
    users: PropTypes.shape({}),
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    leaveGameRequest,
    placeDiscRequest
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
