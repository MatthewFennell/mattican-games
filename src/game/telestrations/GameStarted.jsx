/* eslint-disable react/no-unused-prop-types */
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import { destroyGameRequest, leaveGameRequest } from '../actions';
import { addWordRequest, startGameRequest } from './actions';
import { mapUserIdToName } from '../helpers';
import defaultStyles from './GameStarted.module.scss';
import AddingWords from './statuses/AddingWords';
import JoinNextRound from './statuses/JoinNextRound';
import PlayingGame from './statuses/PlayingGame';

const convertToString = items => {
    let string = '';
    items.forEach((item, index) => {
        if (index === items.length - 1) {
            string += item;
        } else {
            string = `${string + item}, `;
        }
    });
    return string;
};

const GameStarted = props => {
    const generateComponent = () => {
        if (props.currentGame.usersToJoinNextRound.includes(props.auth.uid)) {
            return (
                <JoinNextRound
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingWord={props.isAddingWord}
                    leaveGameRequest={props.leaveGameRequest}
                    isLeavingGame={props.isLeavingGame}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.telestrationGameStatuses.AddingWords) {
            return (
                <AddingWords
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingWord={props.isAddingWord}
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
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    deleteGameRequest={props.destroyGameRequest}
                    isAddingWord={props.isAddingWord}
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

    return (
        <>
            <div className={props.styles.gameTitle}>
                {constants.gameModes.Telestrations}
            </div>
            {generateComponent()}
            <div className={props.styles.textWrapper}>
                <div>Current players:</div>
                <div className={props.styles.textValue}>
                    {convertToString(props.currentGame.currentPlayers
                        .filter(x => !props.currentGame.usersToJoinNextRound.includes(x))
                        .map(x => mapUserIdToName(props.currentGame.usernameMappings, x)))}
                </div>
            </div>
            {props.currentGame.usersToJoinNextRound.length > 0
            && (
                <div className={props.styles.textWrapperTwo}>
                    <div>Players waiting to join:</div>
                    <div className={props.styles.textValue}>
                        {convertToString(props.currentGame.usersToJoinNextRound
                            .map(x => mapUserIdToName(props.currentGame.usernameMappings, x)))}
                    </div>
                </div>
            )}
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    addWordRequest: noop,
    currentGame: {
        currentPlayers: [],
        status: '',
        usersToJoinNextRound: [],
        usernameMappings: {}
    },
    destroyGameRequest: noop,
    currentGameId: '',
    isAddingWord: false,
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
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
        usersToJoinNextRound: PropTypes.arrayOf(PropTypes.string),
        usernameMappings: PropTypes.shape({})
    }),
    currentGameId: PropTypes.string,
    destroyGameRequest: PropTypes.func,
    isAddingWord: PropTypes.bool,
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
    isAddingWord: state.telestrations.isAddingWord,
    isDestroyingGame: state.game.isDestroyingGame,
    isLeavingGame: state.game.isLeavingGame,
    isStartingGame: state.game.isStartingGame
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
