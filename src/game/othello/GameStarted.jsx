/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './GameStarted.module.scss';
import GameActive from './statuses/GameActive';
import { placeDiscRequest, leaveGameRequest, regenerateComputerMove } from './actions';

const GameStarted = props => {
    const generateComponent = () => (
        <GameActive
            auth={props.auth}
            currentGame={props.currentGame}
            currentGameId={props.currentGameId}
            generatingMove={props.generatingMove}
            leaveGameRequest={() => props.leaveGameRequest(props.currentGameId)}
            placeDiscRequest={props.placeDiscRequest}
            regenerateComputerMove={props.regenerateComputerMove}
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
        hasResigned: false
    },
    currentGameId: '',
    generatingMove: false,
    users: {},
    styles: defaultStyles
};

GameStarted.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        hasResigned: PropTypes.bool
    }),
    currentGameId: PropTypes.string,
    generatingMove: PropTypes.bool,
    leaveGameRequest: PropTypes.func.isRequired,
    placeDiscRequest: PropTypes.func.isRequired,
    regenerateComputerMove: PropTypes.func.isRequired,
    users: PropTypes.shape({}),
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    leaveGameRequest,
    placeDiscRequest,
    regenerateComputerMove
};

const mapStateToProps = state => ({
    generatingMove: state.othello.generatingMove
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
