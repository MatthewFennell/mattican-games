import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import fp from 'lodash/fp';
import defaultStyles from './Overview.module.scss';
import * as constants from '../constants';
import { createGameRequest, joinGameRequest } from './actions';
import CreateAvalonGame from './CreateAvalonGame';
import * as selectors from './selectors';
import ConfirmModal from '../common/modal/ConfirmModal';
import { mapUserIdToName } from '../game/helpers';
import Spinner from '../common/spinner/Spinner';

const Overview = props => {
    // ------------------------- AVALON GAME CREATION ------------------------- //
    const [makingGame, setMakingGame] = useState(false);
    const [gameMode, setGameMode] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(5);
    const [gameName, setGameName] = useState('');
    const [activeAvalonRoles, setActiveAvalonRoles] = useState([]);

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
        let roles = [];

        if (gameMode === constants.gameModes.Avalon) {
            roles = activeAvalonRoles;
        }

        props.createGameRequest(gameMode, gameName, parseInt(numberOfPlayers, 10), roles);
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


    return (
        <div className={props.styles.overviewWrapper}>
            <CreateAvalonGame
                activeAvalonRoles={activeAvalonRoles}
                createGame={createGame}
                creatingGame={props.creatingGame}
                changeNumberOfPlayers={changeNumberOfPlayers}
                gameMode={gameMode}
                gameName={gameName}
                makingGame={makingGame}
                numberOfPlayers={numberOfPlayers}
                setGameMode={setGameMode}
                setGameName={setGameName}
                setMakingGame={setMakingGame}
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
                        <div>
                            {`Number of players: ${game.currentPlayers.length}/${game.numberOfPlayers}` }
                        </div>
                        <div>
                            {`Game Mode: ${game.mode}` }
                        </div>
                        <div>
                            {`Roles: ${game.roles.reduce((acc, cur) => `${acc}, ${cur}`)}` }
                        </div>
                        {game.currentPlayers && !fp.isEmpty(props.users)
                        && (
                            <div>
                                {`Current players: ${game.currentPlayers.map(x => mapUserIdToName(props.users, x))}`}
                            </div>
                        ) }
                        {game.hasStarted && (
                            <div className={props.styles.alreadyStarted}>
                                Game has already started
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
    );
};

Overview.defaultProps = {
    allGames: [],
    creatingGame: false,
    joiningGame: false,
    styles: defaultStyles,
    users: {}
};

Overview.propTypes = {
    allGames: PropTypes.arrayOf(PropTypes.shape({})),
    createGameRequest: PropTypes.func.isRequired,
    creatingGame: PropTypes.bool,
    joiningGame: PropTypes.bool,
    joinGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.objectOf(PropTypes.shape({}))
};

const mapDispatchToProps = {
    createGameRequest,
    joinGameRequest
};

const mapStateToProps = state => ({
    allGames: selectors.getGames(state),
    creatingGame: state.overview.creatingGame,
    joiningGame: state.overview.joiningGame,
    users: state.firestore.data.users
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        },
        {
            collection: 'users'
        }
    ]),
)(Overview);


export { Overview as OverviewUnconnected };
