import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import defaultStyles from './GameNotStarted.module.scss';
import { mapUserIdToName } from './helpers';
import * as constants from '../constants';
import StyledButton from '../common/StyledButton/StyledButton';
import {
    leaveGameRequest, readyUpRequest, startGameRequest,
    editHitlerGameRequest, gameError, editAvalonGameRequest
} from './actions';
import Switch from '../common/Switch/Switch';
import Fade from '../common/Fade/Fade';
import TextInput from '../common/TextInput/TextInput';
import { shouldBeDisabled } from '../overview/CreateGame';

const GameNotStarted = props => {
    const [editingGame, setEditingGame] = useState(false);
    const [numberOfPlayers, setNumberOfPlayers] = useState(props.currentGame.numberOfPlayers || '');

    const toggleEditingGame = useCallback(() => {
        setEditingGame(!editingGame);
    }, [editingGame, setEditingGame]);

    const [editedAvalonRoles, setEditedAvalonRoles] = useState(props.currentGame.roles || []);

    const editNumberOfPlayers = useCallback(val => {
        setNumberOfPlayers(val);
        if (val <= 6) {
            setEditedAvalonRoles([]);
        }
    }, [setNumberOfPlayers, setEditedAvalonRoles]);

    const toggleRole = useCallback(role => {
        if (editedAvalonRoles.includes(role)) {
            setEditedAvalonRoles(editedAvalonRoles.filter(x => x !== role));
        } else {
            setEditedAvalonRoles([...editedAvalonRoles, role]);
        }
    }, [setEditedAvalonRoles, editedAvalonRoles]);

    const differenceInRoles = (roles, rolesTwo) => (roles && roles.some(x => !rolesTwo.includes(x)))
    || (rolesTwo && rolesTwo.some(x => !roles.includes(x)));

    const editGame = useCallback(() => {
        if (props.currentGame.mode === constants.gameModes.Hitler) {
            if (props.currentGame.currentPlayers.length > numberOfPlayers) {
                props.gameError({
                    code: 'invalid-argument',
                    message: 'You already have too many players for that'
                }, 'Edit Game error');
            } else {
                props.editHitlerGameRequest(props.currentGameId, numberOfPlayers);
            }
        }
        if (props.currentGame.mode === constants.gameModes.Avalon) {
            props.editAvalonGameRequest(props.currentGameId, numberOfPlayers, editedAvalonRoles);
        }
        // eslint-disable-next-line
    }, [props.currentGame, numberOfPlayers, editedAvalonRoles])

    return (
        <div className={props.styles.gameNotStartedWrapper}>
            <div className={props.styles.lobbyHeader}>
                Game Lobby
            </div>

            <div className={props.styles.currentPlayersWrapper}>
                <div className={props.styles.gameInfo}>
                    <div className={props.styles.hostWrapper}>
                        <div>Host:</div>

                        <div className={props.styles.hostValue}>
                            <div>{mapUserIdToName(props.users, props.currentGame.host)}</div>
                            <div>{props.currentGame.host === props.auth.uid && ' (you)'}</div>
                        </div>
                    </div>

                    <div className={props.styles.gameModeText}>
                        <div>Mode:</div>
                        <div className={props.styles.gameModeValue}>
                            {props.currentGame.mode}
                        </div>
                    </div>
                </div>

                <div className={props.styles.currentPlayersMessage}>
                    {`Current players: (${props.currentGame.currentPlayers.length}/${props.currentGame.numberOfPlayers})` }
                </div>

                {props.currentGame.currentPlayers.map(player => (
                    <div className={props.styles.playerName} key={player}>
                        <div className={props.styles.name}>
                            {mapUserIdToName(props.users, player)}
                            {player === props.auth.uid && ' (you)'}
                        </div>
                        <div className={classNames({
                            [props.styles.status]: true,
                            [props.styles.ready]: props.currentGame.playersReady.includes(player),
                            [props.styles.notReady]: !props.currentGame
                                .playersReady.includes(player)
                        })}
                        >
                            <FiberManualRecordIcon fontSize="small" />
                        </div>
                    </div>
                ))}

                {props.currentGame.mode === constants.gameModes.Avalon
            && (
                <div className={props.styles.roles}>
                    <div className={props.styles.rolesMessage}>
                        Roles
                    </div>
                    {Object.values(constants.avalonRoles)
                        .filter(role => props.currentGame.roles
                            .includes(role.name))
                        .filter(role => role.isGood).filter(role => role.isSpecial)
                        .map(role => (
                            <div className={props.styles.goodRole} key={role.name}>{role.name}</div>
                        ))}
                    {Object.values(constants.avalonRoles)
                        .filter(role => props.currentGame.roles
                            .includes(role.name))
                        .filter(role => !role.isGood).filter(role => role.isSpecial)
                        .map(role => (
                            <div className={props.styles.badRole} key={role.name}>{role.name}</div>
                        ))}
                </div>
            )}
            </div>

            <div className={props.styles.editGame}>
                <div className={props.styles.readyUp}>
                    <div>
                        <div>Ready Up</div>
                        <Switch
                            checked={props.isReady}
                            onChange={() => props.readyUpRequest(props.currentGameId,
                                !props.isReady)}
                        />
                    </div>
                    {props.currentGame.host === props.auth.uid && (
                        <div>
                            <div>Edit game</div>
                            <Switch
                                checked={editingGame}
                                onChange={toggleEditingGame}
                            />
                        </div>
                    ) }
                </div>
                <Fade

                    checked={editingGame}
                >

                    <div className={props.styles.editGameWrapper}>
                        <div className={props.styles.editNumberOfPlayers}>
                            <TextInput
                                label="Number of players"
                                type="number"
                                value={numberOfPlayers}
                                onChange={val => editNumberOfPlayers(val)}
                            />
                        </div>
                    </div>

                    {props.currentGame.mode === constants.gameModes.Avalon && (
                        <div className={props.styles.avalonWrapper}>
                            <div className={props.styles.goodGuyRoles}>
                                {Object.values(constants.avalonRoles)
                                    .filter(role => role.isGood).filter(role => role.isSpecial)
                                    .map(role => (
                                        <div className={props.styles.roleWrapper} key={role.name}>
                                            <div className={props.styles.avalonGoodRoleName}>
                                                {role.name}
                                            </div>
                                            <Switch
                                                checked={editedAvalonRoles.includes(role.name)}
                                                onChange={() => toggleRole(role.name)}
                                                color="primary"
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className={props.styles.badGuyRoles}>
                                {Object.values(constants.avalonRoles)
                                    .filter(role => !role.isGood).filter(role => role.isSpecial)
                                    .map(role => (
                                        <div className={props.styles.roleWrapper} key={role.name}>
                                            <div className={props.styles.avalonBadRoleName}>
                                                {role.name}
                                            </div>
                                            <Switch
                                                checked={editedAvalonRoles.includes(role.name)}
                                                onChange={() => toggleRole(role.name)}
                                                color="secondary"
                                                disabled={shouldBeDisabled(numberOfPlayers,
                                                    editedAvalonRoles, role.name)}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className={props.styles.confirmEditButton}>
                        <StyledButton
                            disabled={(props.currentGame.numberOfPlayers === numberOfPlayers
                                || numberOfPlayers < 5)
                                && !differenceInRoles(editedAvalonRoles, props.currentGame.roles)}
                            text="Confirm"
                            onClick={editGame}
                        />
                    </div>
                </Fade>
            </div>


            <div className={props.styles.startAndLeave}>
                {props.currentGame.host === props.auth.uid
            && (
                <div
                    className={props.styles.startGameWrapper}
                >
                    <StyledButton
                        text="Start Game"
                        disabled={(props.currentGame.currentPlayers.length
                            < props.currentGame.numberOfPlayers)
                            || props.currentGame.playersReady.length
                            !== props.currentGame.numberOfPlayers}
                        onClick={() => props.startGameRequest(props.currentGameId,
                            props.currentGame.mode)}
                    />
                </div>
            )}
                <div className={props.styles.leaveGameWrapper}>
                    <StyledButton
                        text="Leave Game"
                        color="secondary"
                        onClick={() => props.leaveGameRequest(props.currentGameId)}
                    />
                </div>
            </div>

            {props.currentGame.playersReady.length === props.currentGame.numberOfPlayers
            && props.currentGame.host !== props.auth.uid && (
                <div className={props.styles.waitingForHost}>
                    {`Waiting for ${mapUserIdToName(props.users,
                        props.currentGame.host)} to start the game`}
                </div>
            )}

            {props.currentGame.playersReady.length < props.currentGame.numberOfPlayers
            && props.currentGame.numberOfPlayers === props.currentGame.currentPlayers.length && (
                <div className={props.styles.waitingForPlayersToReady}>
                Waiting for players to ready up
                </div>
            )}

            {props.currentGame.currentPlayers.length < props.currentGame.numberOfPlayers && (
                <div className={props.styles.waitingForPlayersToJoin}>
                Waiting for players to join the lobby
                </div>
            )}
        </div>
    );
};

GameNotStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        currentPlayers: [],
        host: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        playersReady: []
    },
    currentGameId: '',
    isReady: false,
    styles: defaultStyles,
    users: {}
};

GameNotStarted.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        playersReady: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    isReady: PropTypes.bool,
    leaveGameRequest: PropTypes.func.isRequired,
    readyUpRequest: PropTypes.func.isRequired,
    editHitlerGameRequest: PropTypes.func.isRequired,
    gameError: PropTypes.func.isRequired,
    startGameRequest: PropTypes.func.isRequired,
    editAvalonGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    leaveGameRequest,
    readyUpRequest,
    startGameRequest,
    gameError,
    editHitlerGameRequest,
    editAvalonGameRequest
};

export default connect(null, mapDispatchToProps)(GameNotStarted);

export { GameNotStarted as GameNotStartedUnconnected };
