import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import defaultStyles from './Overview.module.scss';
import * as constants from '../constants';
import {
    createAvalonGameRequest, joinGameRequest, createHiterGameRequest,
    createWhoInHatGameRequest
} from './actions';
import CreateGame from './CreateGame';
import * as selectors from './selectors';
import ConfirmModal from '../common/modal/ConfirmModal';
import { mapUserIdToName } from '../game/helpers';
import Spinner from '../common/spinner/Spinner';
import ErrorModal from '../common/modal/ErrorModal';
import { closeGameError } from '../game/actions';

const Overview = props => {
    // ------------------------- AVALON GAME CREATION ------------------------- //
    const [makingGame, setMakingGame] = useState(false);
    const [gameMode, setGameMode] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(5);
    const [gameName, setGameName] = useState('');
    const [activeAvalonRoles, setActiveAvalonRoles] = useState([]);

    const [skippingRule, setSkippingRule] = useState(constants.whoInHatSkipping.Unlimited);
    const [isCustomNames, setCustomNames] = useState(false);

    const toggleRole = useCallback(role => {
        if (activeAvalonRoles.includes(role)) {
            setActiveAvalonRoles(activeAvalonRoles.filter(x => x !== role));
        } else {
            setActiveAvalonRoles([...activeAvalonRoles, role]);
        }
    }, [setActiveAvalonRoles, activeAvalonRoles]);

    const changeNumberOfPlayers = useCallback(numPlayers => {
        if (numPlayers <= 6) {
            setActiveAvalonRoles(activeAvalonRoles.filter(x => x.isGood));
        }
        setNumberOfPlayers(numPlayers);
    }, [setActiveAvalonRoles, setNumberOfPlayers, activeAvalonRoles]);

    const createGame = useCallback(() => {
        if (gameMode === constants.gameModes.Avalon) {
            props.createAvalonGameRequest(gameMode, gameName,
                parseInt(numberOfPlayers, 10), activeAvalonRoles);
        }
        if (gameMode === constants.gameModes.Hitler) {
            props.createHiterGameRequest(gameMode, gameName, parseInt(numberOfPlayers, 10));
        }
        if (gameMode === constants.gameModes.WhosInTheHat) {
            props.createWhoInHatGameRequest(gameName, skippingRule, isCustomNames);
        }
        setMakingGame(false);

        // eslint-disable-next-line
    }, [activeAvalonRoles, gameName, gameMode, numberOfPlayers]);
    // ------------------------------------------------------------------------ //

    const [gameToJoin, setGameToJoin] = useState('');
    const [gameModeToJoin, setGameModeToJoin] = useState('');

    const clickOnGameToJoin = useCallback(game => {
        if (!game.hasStarted) {
            setGameModeToJoin(game.mode);
            setGameToJoin(game.id);
        }
    }, [setGameToJoin, setGameModeToJoin]);

    const joinGame = useCallback(() => {
        props.joinGameRequest(gameToJoin, gameModeToJoin);
        setGameToJoin('');
        // eslint-disable-next-line
    }, [gameToJoin, setGameToJoin, gameModeToJoin])
    // ------------------------------------------------------------------------ //

    const toggleCustomNames = useCallback(() => {
        setCustomNames(!isCustomNames);
    }, [isCustomNames, setCustomNames]);

    return (
        <>
            <div className={props.styles.overviewWrapper}>
                <CreateGame
                    activeAvalonRoles={activeAvalonRoles}
                    createGame={createGame}
                    creatingGame={props.creatingGame}
                    changeNumberOfPlayers={changeNumberOfPlayers}
                    gameMode={gameMode}
                    gameName={gameName}
                    isCustomNames={isCustomNames}
                    makingGame={makingGame}
                    numberOfPlayers={numberOfPlayers}
                    setGameMode={setGameMode}
                    setGameName={setGameName}
                    setMakingGame={setMakingGame}
                    setSkippingRule={setSkippingRule}
                    skippingRule={skippingRule}
                    toggleCustomNames={toggleCustomNames}
                    toggleRole={toggleRole}
                />

                <div className={props.styles.allGamesHeader}>
                    {props.allGames.length ? 'All Games' : 'No Games Exist'}
                </div>

                {props.allGames.map(game => (
                    <div
                        className={props.styles.gameWrapper}
                        onClick={() => clickOnGameToJoin(game)}
                        role="button"
                        tabIndex={0}
                        key={game.name}
                    >
                        <div className={props.styles.gameName}>
                            <div>
                                {`Name: ${game.name}`}
                            </div>
                            {game.currentPlayers && (
                                <div>
                                    {`Number of players: ${game.currentPlayers.length}/${game.numberOfPlayers}` }
                                </div>
                            )}
                            <div>
                                {`Game Mode: ${game.mode}` }
                            </div>
                            {game.mode === constants.gameModes.Avalon && game && game.roles
                            && (
                                <div>
                                    {`Roles: ${game.roles.reduce((acc, cur) => `${acc}, ${cur}`, '')}` }
                                </div>
                            ) }
                            {game.currentPlayers
                        && (
                            <div className={props.styles.gameCurrentPlayers}>
                                {`Current players: ${game.currentPlayers.map(x => mapUserIdToName(game.usernameMappings, x))}`}
                            </div>
                        ) }
                            {game.hasStarted && (
                                <div className={props.styles.alreadyStarted}>
                                    {game.status === constants.hitlerGameStatuses.Finished
                                        ? 'Game has finished' : 'Game has already started'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <ConfirmModal
                    cancel={() => setGameToJoin('')}
                    closeModal={() => setGameToJoin('')}
                    submit={joinGame}
                    isOpen={Boolean(gameToJoin)}
                    text="Are you sure you want to join this game?"
                />

                {props.joiningGame && (
                    <div className={props.styles.joiningGame}>
                        <Spinner color="secondary" />
                    </div>
                )}

            </div>
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

Overview.defaultProps = {
    allGames: [],
    creatingGame: false,
    joiningGame: false,
    styles: defaultStyles,
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

Overview.propTypes = {
    allGames: PropTypes.arrayOf(PropTypes.shape({})),
    closeGameError: PropTypes.func.isRequired,
    createAvalonGameRequest: PropTypes.func.isRequired,
    createHiterGameRequest: PropTypes.func.isRequired,
    createWhoInHatGameRequest: PropTypes.func.isRequired,
    creatingGame: PropTypes.bool,
    joiningGame: PropTypes.bool,
    joinGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    errorHeader: PropTypes.string,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string
};

const mapDispatchToProps = {
    closeGameError,
    createHiterGameRequest,
    createAvalonGameRequest,
    createWhoInHatGameRequest,
    joinGameRequest
};

const mapStateToProps = state => ({
    allGames: selectors.getGames(state),
    creatingGame: state.overview.creatingGame,
    joiningGame: state.overview.joiningGame,
    errorHeader: state.avalon.errorHeader,
    errorMessage: state.avalon.errorMessage,
    errorCode: state.avalon.errorCode
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        }
    ]),
)(Overview);


export { Overview as OverviewUnconnected };
