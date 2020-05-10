import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import defaultStyles from './GameNotStarted.module.scss';
import { mapUserIdToName, gameHasSetNumberOfPlayers } from './helpers';
import * as constants from '../constants';
import StyledButton from '../common/StyledButton/StyledButton';
import {
    leaveGameRequest, readyUpRequest, startGameRequest,
    editHitlerGameRequest, gameError, editAvalonGameRequest, editWhoInHateGameRequest
} from './actions';
import Switch from '../common/Switch/Switch';
import Fade from '../common/Fade/Fade';
import TextInput from '../common/TextInput/TextInput';
import { shouldBeDisabled } from '../overview/CreateGame';
import Dropdown from '../common/dropdown/Dropdown';

import {
    editGameRequest as editArticulateGameRequest
} from './articulate/actions';

const canStartGame = game => {
    if (game.mode === constants.gameModes.Hitler || game.mode === constants.gameModes.Avalon) {
        return (game.currentPlayers.length === game.numberOfPlayers)
            && game.playersReady.length === game.numberOfPlayers;
    }
    if (game.mode === constants.gameModes.WhosInTheHat) {
        return game.currentPlayers.length === game.playersReady.length;
    }
    if (game.mode === constants.gameModes.Articulate) {
        return game.currentPlayers.length === game.playersReady.length;
    }
    return false;
};

const GameNotStarted = props => {
    const [editingGame, setEditingGame] = useState(false);
    const [numberOfPlayers, setNumberOfPlayers] = useState(props.currentGame.numberOfPlayers || '');

    const [editedIsCustomNames, setIsEditedCustomNames] = useState(props.currentGame.isCustomNames);
    const [editedSkippingRule, setEditedSkippingRule] = useState(props.currentGame.skippingRule);
    const [scoreCap, setScoreCap] = useState(props.currentGame.scoreCap || 20);
    const [timePerRound, setTimePerRound] = useState(props.currentGame.timePerRound || 60);

    const toggleEditedCustomNames = useCallback(() => {
        setIsEditedCustomNames(!editedIsCustomNames);
    }, [setIsEditedCustomNames, editedIsCustomNames]);

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
                props.editHitlerGameRequest(props.currentGameId, parseInt(numberOfPlayers, 10));
            }
        }
        if (props.currentGame.mode === constants.gameModes.Avalon) {
            props.editAvalonGameRequest(props.currentGameId, numberOfPlayers, editedAvalonRoles);
        }
        if (props.currentGame.mode === constants.gameModes.WhosInTheHat) {
            props.editWhoInHateGameRequest(props.currentGameId,
                editedSkippingRule, editedIsCustomNames, scoreCap, timePerRound);
        }
        if (props.currentGame.mode === constants.gameModes.Articulate) {
            props.editArticulateGameRequest(props.currentGameId,
                editedSkippingRule, timePerRound, scoreCap);
        }
        setEditingGame(false);
        // eslint-disable-next-line
    }, [props.currentGame, numberOfPlayers, editedAvalonRoles, editedSkippingRule, editedIsCustomNames, scoreCap, timePerRound])

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

                {(props.currentGame.mode === constants.gameModes.Articulate
                || props.currentGame.mode === constants.gameModes.WhosInTheHat) && (
                    <>
                        <div className={props.styles.timePerRoundWrapper}>
                            <div>Time per round:</div>

                            <div className={props.styles.timePerRoundValue}>
                                <div>{`${props.currentGame.timePerRound} (s)`}</div>
                            </div>
                        </div>
                        <div className={props.styles.timePerRoundWrapper}>
                            <div>Skipping:</div>

                            <div className={props.styles.timePerRoundValue}>
                                <div>{`${constants.whoInHatSkipping[props.currentGame.skippingRule]}`}</div>
                            </div>
                        </div>
                        <div className={props.styles.timePerRoundWrapper}>
                            <div>Score cap:</div>

                            <div className={props.styles.timePerRoundValue}>
                                <div>{`${props.currentGame.scoreCap}`}</div>
                            </div>
                        </div>
                    </>
                )}

                <div className={props.styles.currentPlayersText}>
                    <div>Current Players:</div>
                    <div className={props.styles.currentPlayersValue}>
                        {props.currentGame.numberOfPlayers ? `${props.currentGame.currentPlayers.length}/${props.currentGame.numberOfPlayers}`
                            : props.currentGame.currentPlayers.length }
                    </div>
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

            {props.currentGame.host === props.auth.uid

            && (
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
                        <div>
                            <div>Edit game</div>
                            <Switch
                                checked={editingGame}
                                onChange={toggleEditingGame}
                            />
                        </div>
                    </div>
                    <Fade

                        checked={editingGame}
                    >

                        <div className={props.styles.editGameWrapper}>
                            {gameHasSetNumberOfPlayers(props.currentGame.mode)
                        && (
                            <div className={props.styles.editNumberOfPlayers}>
                                <TextInput
                                    label="Number of players"
                                    type="number"
                                    value={numberOfPlayers}
                                    onChange={val => editNumberOfPlayers(val)}
                                />
                            </div>
                        ) }
                        </div>

                        {props.currentGame.mode === constants.gameModes.Avalon && (
                            <div className={props.styles.avalonWrapper}>
                                <div className={props.styles.goodGuyRoles}>
                                    {Object.values(constants.avalonRoles)
                                        .filter(role => role.isGood).filter(role => role.isSpecial)
                                        .map(role => (
                                            <div
                                                className={props.styles.roleWrapper}
                                                key={role.name}
                                            >
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
                                            <div
                                                className={props.styles.roleWrapper}
                                                key={role.name}
                                            >
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

                        {props.currentGame.mode === constants.gameModes.WhosInTheHat
                    && (
                        <div className={props.styles.editWhoInGame}>
                            <div className={props.styles.skippingRules}>
                                <div>
                                    <Dropdown
                                        options={Object.keys(constants.whoInHatSkipping)
                                            .map(mode => ({
                                                id: mode,
                                                value: mode,
                                                text: constants.whoInHatSkipping[mode]
                                            }))}
                                        value={editedSkippingRule}
                                        onChange={setEditedSkippingRule}
                                        title="Skipping"
                                    />
                                </div>
                                <div>
                                    <div>
                            Custom Names
                                    </div>
                                    <Switch
                                        checked={editedIsCustomNames}
                                        onChange={toggleEditedCustomNames}
                                        color="primary"
                                    />
                                </div>
                            </div>
                            {editedIsCustomNames && (
                                <div className={props.styles.scoreCap}>
                                    <TextInput
                                        type="number"
                                        value={scoreCap}
                                        onChange={setScoreCap}
                                        label="Score cap"
                                    />
                                </div>
                            )}
                            <div className={props.styles.timePerRound}>
                                <TextInput
                                    type="number"
                                    value={timePerRound}
                                    onChange={setTimePerRound}
                                    label="Time to guess (seconds)"
                                />
                            </div>
                        </div>
                    )}

                        {props.currentGame.mode === constants.gameModes.Articulate
                    && (
                        <div className={props.styles.editWhoInGame}>
                            <div className={props.styles.skippingRules}>
                                <Dropdown
                                    options={Object.keys(constants.articulateSkipping)
                                        .map(mode => ({
                                            id: mode,
                                            value: mode,
                                            text: constants.articulateSkipping[mode]
                                        }))}
                                    value={editedSkippingRule}
                                    onChange={setEditedSkippingRule}
                                    title="Skipping"
                                />
                            </div>
                            <div className={props.styles.timePerRound}>
                                <TextInput
                                    type="number"
                                    value={timePerRound}
                                    onChange={setTimePerRound}
                                    label="Time to guess (seconds)"
                                />
                            </div>
                            <div className={props.styles.scoreCap}>
                                <TextInput
                                    type="number"
                                    value={scoreCap}
                                    onChange={setScoreCap}
                                    label="Score cap"
                                />
                            </div>
                        </div>
                    )}

                        <div className={props.styles.confirmEditButton}>
                            <StyledButton
                                disabled={(props.currentGame.numberOfPlayers === numberOfPlayers
                                || numberOfPlayers < 5)
                                && !differenceInRoles(editedAvalonRoles, props.currentGame.roles)
                                && props.currentGame.mode !== constants.gameModes.WhosInTheHat
                                && props.currentGame.mode !== constants.gameModes.Articulate}
                                text="Confirm"
                                onClick={editGame}
                            />
                        </div>
                    </Fade>
                </div>
            )}


            <div className={props.styles.startAndLeave}>
                {props.currentGame.host !== props.auth.uid
                && (
                    <div>
                        <div>Ready Up</div>
                        <Switch
                            checked={props.isReady}
                            onChange={() => props.readyUpRequest(props.currentGameId,
                                !props.isReady)}
                        />
                    </div>
                ) }
                {props.currentGame.host === props.auth.uid
            && (
                <div
                    className={props.styles.startGameWrapper}
                >
                    <StyledButton
                        text="Start Game"
                        disabled={!canStartGame(props.currentGame)}
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

            {!props.currentGame.numberOfPlayers
            && props.currentGame.playersReady.length < props.currentGame.currentPlayers.length && (
                <div className={props.styles.waitingForPlayersToReady}>
                Waiting for players to ready up
                </div>
            )}

            {!props.currentGame.numberOfPlayers
            && props.currentGame.playersReady.length === props.currentGame.currentPlayers.length
            && props.currentGame.host !== props.auth.uid && (
                <div className={props.styles.waitingForHost}>
                    {`Waiting for ${mapUserIdToName(props.users,
                        props.currentGame.host)} to start the game`}
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
        isCustomNames: false,
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        scoreCap: 0,
        skippingRule: '',
        timePerRound: 0,
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
        isCustomNames: PropTypes.bool,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        scoreCap: PropTypes.number,
        skippingRule: PropTypes.string,
        timePerRound: PropTypes.number,
        playersReady: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    editArticulateGameRequest: PropTypes.func.isRequired,
    isReady: PropTypes.bool,
    leaveGameRequest: PropTypes.func.isRequired,
    readyUpRequest: PropTypes.func.isRequired,
    editHitlerGameRequest: PropTypes.func.isRequired,
    gameError: PropTypes.func.isRequired,
    startGameRequest: PropTypes.func.isRequired,
    editAvalonGameRequest: PropTypes.func.isRequired,
    editWhoInHateGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    editArticulateGameRequest,
    leaveGameRequest,
    readyUpRequest,
    startGameRequest,
    gameError,
    editAvalonGameRequest,
    editHitlerGameRequest,
    editWhoInHateGameRequest
};

export default connect(null, mapDispatchToProps)(GameNotStarted);

export { GameNotStarted as GameNotStartedUnconnected };
