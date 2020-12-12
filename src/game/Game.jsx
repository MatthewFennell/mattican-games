/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as selectors from './selectors';
import GameNotStarted from './GameNotStarted';
import AvalonGameStarted from './avalon/GameStarted';
import HitlerGameStarted from './hitler/GameStarted';
import WhoInHatGameStarted from './whoInHat/GameStarted';
import OthelloGameStarted from './othello/GameStarted';
import Articulate from './articulate/GameStarted';
import ErrorModal from '../common/modal/ErrorModal';
import { closeGameError } from './actions';
import * as constants from '../constants';

const Game = props => {
    const generateGameThingToLoad = (gameId, isReady, myRole) => {
        if (!props.currentGame.hasStarted) {
            return (
                <GameNotStarted
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={gameId}
                    isReady={isReady}
                    users={props.users}
                />
            );
        }
        if (props.currentGame.mode === constants.gameModes.Avalon) {
            return (
                <AvalonGameStarted
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    myRole={props.myRole}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.mode === constants.gameModes.Hitler) {
            return (
                <HitlerGameStarted
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    myRole={myRole}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.mode === constants.gameModes.WhosInTheHat) {
            return (
                <WhoInHatGameStarted
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingTeam={props.isAddingTeam}
                    isRandomisingTeams={props.isRandomisingTeams}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.mode === constants.gameModes.Articulate) {
            return (
                <Articulate
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingTeam={props.isAddingTeam}
                    isRandomisingTeams={props.isRandomisingTeams}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.mode === constants.gameModes.Othello) {
            return (
                <OthelloGameStarted
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    users={props.users}
                />
            );
        }

        return <div>Unknown game mode</div>;
    };

    return (
        <>
            {generateGameThingToLoad(props.currentGameId, props.isReady, props.myRole)}
            <ErrorModal
                closeModal={props.closeGameError}
                headerMessage={props.errorHeader}
                isOpen={props.errorMessage.length > 0}
                errorCode={props.errorCode}
                errorMessage={props.errorMessage}
            />
        </>
    );
};

Game.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        currentPlayers: [],
        hasStarted: false,
        host: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        playersReady: []
    },
    currentGameId: '',
    errorHeader: '',
    errorMessage: '',
    errorCode: '',
    isReady: '',
    myRole: '',
    users: {}
};

Game.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    isReady: PropTypes.bool,
    closeGameError: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        hasStarted: PropTypes.bool,
        mode: PropTypes.string
    }),
    errorHeader: PropTypes.string,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    myRole: PropTypes.string,
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    closeGameError
};

const mapStateToProps = (state, props) => ({
    currentGame: selectors.getCurrentGame(state, props),
    errorHeader: state.game.errorHeader,
    errorMessage: state.game.errorMessage,
    errorCode: state.game.errorCode,

    isAddingTeam: state.game.isAddingTeam,
    isRandomisingTeams: state.game.isRandomisingTeams,

    auth: state.firebase.auth,
    currentGameId: selectors.getGameId(props),
    isReady: selectors.getIsReady(state, props),
    myRole: selectors.getMyRole(state, props),
    users: selectors.getUsernameMappings(state, props)
});

export default withRouter(compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        }
    ])
)(Game));

export { Game as GameUnconnected };
