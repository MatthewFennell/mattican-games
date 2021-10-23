/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { addWordRequest, startGameRequest } from './actions';
import { destroyGameRequest, leaveGameRequest } from '../actions';

import * as constants from '../../constants';
import PlayingGame from './statuses/PlayingGame';
import AddingWords from './statuses/AddingWords';
import defaultStyles from './GameStarted.module.scss';

const GameStarted = props => {
    const generateComponent = () => {
        if (props.currentGame.status === constants.telestrationGameStatuses.AddingWords) {
            return (
                <AddingWords
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isStartingGame={props.isStartingGame}
                    startGameRequest={props.startGameRequest}
                    users={props.users}
                />
            );
        }
        if (props.currentGame.status === constants.telestrationGameStatuses.Drawing) {
            return (
                <PlayingGame
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    deleteGameRequest={props.destroyGameRequest}
                    leaveGameRequest={props.leaveGameRequest}
                    isLeavingGame={props.isLeavingGame}
                    isStartingGame={props.isStartingGame}
                    isDestroyingGame={props.isDestroyingGame}
                    startGameRequest={props.startGameRequest}
                    users={props.users}
                />
            );
        }
        return <div>Error. Contact Matt</div>;
    };

    // if (props.currentGame.status === constants.whoInHatGameStatuses.PrepareToGuess) {
    //     return (
    //         <PrepareToGuess
    //             auth={props.auth}
    //             currentGame={props.currentGame}
    //             currentGameId={props.currentGameId}
    //             joinTeamMidgameRequest={props.joinTeamMidgameRequest}
    //             startWhoInHatRoundRequest={props.startWhoInHatRoundRequest}
    //             users={props.users}
    //         />
    //     );
    // }

    // if (props.currentGame.status === constants.whoInHatGameStatuses.Guessing) {
    //     return (
    //         <Guessing
    //             auth={props.auth}
    //             currentGame={props.currentGame}
    //             currentGameId={props.currentGameId}
    //             gotWordRequest={props.gotWordRequest}
    //             loadScoreSummaryRequest={props.loadScoreSummaryRequest}
    //             skipWordRequest={props.skipWordRequest}
    //             trashWordRequest={props.trashWordRequest}
    //             users={props.users}
    //         />
    //     );
    // }

    // if (props.currentGame.status === constants.whoInHatGameStatuses.RoundSummary) {
    //     return (
    //         <RoundSummary
    //             auth={props.auth}
    //             confirmScoreRequest={props.confirmScoreRequest}
    //             currentGame={props.currentGame}
    //             currentGameId={props.currentGameId}
    //             realignConfirmedWords={props.realignConfirmedWords}
    //             setWordConfirmedRequest={props.setWordConfirmedRequest}
    //             users={props.users}
    //         />
    //     );
    // }

    // if (props.currentGame.status === constants.whoInHatGameStatuses.ScoreCapReached
    // || props.currentGame.status === constants.whoInHatGameStatuses.NoCardsLeft) {
    //     return (
    //         <GameFinished
    //             auth={props.auth}
    //             currentGame={props.currentGame}
    //             currentGameId={props.currentGameId}
    //             leaveUnconstrainedGameRequest={props.leaveUnconstrainedGameRequest}
    //             users={props.users}
    //         />
    //     );
    // }

    return (
        <>
            <div className={props.styles.gameTitle}>
                {constants.gameModes.Telestrations}
            </div>
            {generateComponent()}
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    addWordRequest: noop,
    currentGame: {
        status: ''
    },
    destroyGameRequest: noop,
    currentGameId: '',
    isDestroyingGame: false,
    isLeavingGame: false,
    isRandomisingTeams: false,
    isStartingGame: false,
    leaveGameRequest: noop,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    addWordRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        status: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    destroyGameRequest: PropTypes.func,
    isDestroyingGame: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    isRandomisingTeams: PropTypes.bool,
    isStartingGame: PropTypes.bool,
    leaveGameRequest: PropTypes.func,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addWordRequest,
    destroyGameRequest,
    leaveGameRequest,
    startGameRequest
};

const mapStateToProps = state => ({
    isDestroyingGame: state.game.isDestroyingGame,
    isLeavingGame: state.game.isLeavingGame,
    isStartingGame: state.game.isStartingGame
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
