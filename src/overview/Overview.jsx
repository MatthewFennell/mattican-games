import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import defaultStyles from './Overview.module.scss';
import * as constants from '../constants';
import {
    joinGameRequest,
    joinTeamMidgameRequest,
    createGameRequest
} from './actions';
import CreateGame from './CreateGame';
import * as selectors from './selectors';
import ConfirmModal from '../common/modal/ConfirmModal';
import { mapUserIdToName } from '../game/helpers';
import ErrorModal from '../common/modal/ErrorModal';
import { closeGameError } from '../game/actions';
import LoadingDiv from '../common/loadingDiv/LoadingDiv';

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

const Overview = props => {
    // ------------------------- AVALON GAME CREATION ------------------------- //
    const [makingGame, setMakingGame] = useState(false);
    const [gameMode, setGameMode] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(5);
    const [gameName, setGameName] = useState('');
    const [activeAvalonRoles, setActiveAvalonRoles] = useState([]);

    const [skippingRule, setSkippingRule] = useState(constants.whoInHatSkipping.Unlimited);
    const [isCustomNames, setCustomNames] = useState(false);
    const [scoreCap, setScoreCap] = useState(50);
    const [timePerRound, setTimePerRound] = useState(60);

    const [othelloPlayerType, setOthelloPlayerType] = useState('');
    const [othelloDifficulty, setOthelloDifficulty] = useState(constants
        .othelloAIDifficulties.Easy);

    const [joiningId, setJoiningId] = useState('');

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
            props.createGameRequest(gameMode, {
                name: gameName,
                numberOfPlayers: parseInt(numberOfPlayers, 10),
                roles: activeAvalonRoles
            });
        }
        if (gameMode === constants.gameModes.Hitler) {
            props.createGameRequest(gameMode, {
                name: gameName,
                numberOfPlayers: parseInt(numberOfPlayers, 10)
            });
        }
        if (gameMode === constants.gameModes.WhosInTheHat) {
            props.createGameRequest(gameMode,
                {
                    name: gameName,
                    skippingRule,
                    isCustomNames,
                    scoreCap: parseInt(scoreCap, 10),
                    timePerRound: parseInt(timePerRound, 10)
                });
        }
        if (gameMode === constants.gameModes.Articulate) {
            props.createGameRequest(gameMode, {
                name: gameName,
                skippingRule,
                scoreCap: parseInt(scoreCap, 10),
                timePerRound: parseInt(timePerRound, 10)
            });
        }
        if (gameMode === constants.gameModes.Othello) {
            props.createGameRequest(gameMode,
                {
                    name: gameName,
                    opponent: othelloPlayerType,
                    difficulty: othelloDifficulty
                });
        }
        setMakingGame(false);

        // eslint-disable-next-line
    }, [activeAvalonRoles, gameName, gameMode, numberOfPlayers, isCustomNames, skippingRule,
        scoreCap, timePerRound, othelloDifficulty, othelloPlayerType]);
    // ------------------------------------------------------------------------ //

    const [gameToJoin, setGameToJoin] = useState('');
    const [gameModeToJoin, setGameModeToJoin] = useState('');

    const clickOnGameToJoin = useCallback(game => {
        if (!game.hasStarted) {
            setGameModeToJoin(game.mode);
            setGameToJoin(game.id);
        }
        if (game.hasStarted && (game.mode === constants.gameModes.WhosInTheHat
            || game.mode === constants.gameModes.Articulate)) {
            setGameToJoin(game.id);
            setGameModeToJoin(game.mode);
        }
    }, [setGameToJoin, setGameModeToJoin]);

    const joinGame = useCallback(() => {
        if (gameModeToJoin === constants.gameModes.WhosInTheHat
            || gameModeToJoin === constants.gameModes.Articulate) {
            props.joinTeamMidgameRequest(gameToJoin);
        } else {
            props.joinGameRequest(gameToJoin, gameModeToJoin);
        }
        setGameToJoin('');
        setJoiningId(gameToJoin);
        // eslint-disable-next-line
    }, [gameToJoin, setGameToJoin, gameModeToJoin, gameModeToJoin])
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
                    othelloDifficulty={othelloDifficulty}
                    othelloPlayerType={othelloPlayerType}
                    scoreCap={scoreCap}
                    setGameMode={setGameMode}
                    setGameName={setGameName}
                    setMakingGame={setMakingGame}
                    setOthelloDifficulty={setOthelloDifficulty}
                    setOthelloPlayerType={setOthelloPlayerType}
                    setScoreCap={setScoreCap}
                    setSkippingRule={setSkippingRule}
                    setTimePerRound={setTimePerRound}
                    skippingRule={skippingRule}
                    timePerRound={timePerRound}
                    toggleCustomNames={toggleCustomNames}
                    toggleRole={toggleRole}
                />

                <div className={props.styles.allGamesHeader}>
                    {props.allGames.length ? 'All Games' : 'No Games Exist'}
                </div>

                {props.allGames.map(game => (
                    <LoadingDiv isMargin isLoading={game.id === joiningId} isBorderRadius isBlack>
                        <div
                            className={props.styles.gameWrapper}
                            onClick={() => clickOnGameToJoin(game)}
                            role="button"
                            tabIndex={0}
                            key={game.name}
                        >
                            <div className={props.styles.gameName}>
                                <div className={props.styles.textWrapper}>
                                    <div>Name:</div>
                                    <div className={props.styles.textValue}>
                                        {game.name}
                                    </div>
                                </div>
                                {game.currentPlayers && game.numberOfPlayers && (
                                    <div className={props.styles.textWrapper}>
                                        <div>Number of players:</div>
                                        <div className={props.styles.textValue}>
                                            {`${game.currentPlayers.length}/${game.numberOfPlayers}`}
                                        </div>
                                    </div>
                                )}

                                <div className={props.styles.textWrapper}>
                                    <div>Game Mode:</div>
                                    <div className={props.styles.textValue}>
                                        {game.mode}
                                    </div>
                                </div>


                                {game.currentPlayers
                        && (
                            <div className={props.styles.textWrapper}>
                                <div>Current players:</div>
                                <div className={props.styles.textValue}>
                                    {convertToString(game.currentPlayers
                                        .map(x => mapUserIdToName(game.usernameMappings, x)))}
                                </div>
                            </div>
                        ) }
                                {game.hasStarted && (
                                    <div className={props.styles.alreadyStarted}>
                                        {game.status === constants.hitlerGameStatuses.Finished
                                    || game.hasFinished
                                            ? 'Game has finished' : 'Game has already started'}
                                    </div>
                                )}

                                {game.mode === constants.gameModes.Othello && game.opponentType
                            === constants.othelloPlayerTypes.Computer
                            && (
                                <div className={props.styles.textWrapper}>
                                    <div className={props.styles.textValue}>
                                        Playing against AI
                                    </div>
                                </div>
                            )}

                                {game.mode === constants.gameModes.Othello && game.opponentType
                            === constants.othelloPlayerTypes.Human
                            && game.currentPlayers.length === 1 && !game.hasFinished
                            && (
                                <div className={props.styles.textWrapper}>
                                    <div className={props.styles.textValue}>
                                        Looking for human opponent
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </LoadingDiv>
                ))}

                <ConfirmModal
                    cancel={() => setGameToJoin('')}
                    closeModal={() => setGameToJoin('')}
                    submit={joinGame}
                    isOpen={Boolean(gameToJoin)}
                    text="Are you sure you want to join this game?"
                />

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
    styles: defaultStyles,
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

Overview.propTypes = {
    allGames: PropTypes.arrayOf(PropTypes.shape({})),
    closeGameError: PropTypes.func.isRequired,
    createGameRequest: PropTypes.func.isRequired,
    joinTeamMidgameRequest: PropTypes.func.isRequired,
    creatingGame: PropTypes.bool,
    joinGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    errorHeader: PropTypes.string,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string
};

const mapDispatchToProps = {
    closeGameError,
    createGameRequest,
    joinGameRequest,
    joinTeamMidgameRequest
};

const mapStateToProps = state => ({
    allGames: selectors.getGames(state),
    creatingGame: state.overview.creatingGame,
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
    ])
)(Overview);


export { Overview as OverviewUnconnected };
