import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import defaultStyles from './GameNotStarted.module.scss';
import * as selectors from './selectors';
import { mapUserIdToName } from './helpers';
import * as constants from '../constants';
import StyledButton from '../common/StyledButton/StyledButton';
import { leaveGameRequest, readyUpRequest, startGameRequest } from './actions';
import Switch from '../common/Switch/Switch';

const GameNotStarted = props => (
    <div className={props.styles.gameNotStartedWrapper}>
        <div className={props.styles.lobbyHeader}>
                Game Lobby
        </div>

        <div className={props.styles.hostWrapper}>
                Host
        </div>

        <div className={props.styles.hostValue}>
            {mapUserIdToName(props.users, props.currentGame.host)}
            {props.currentGame.host === props.auth.uid && ' (you)'}
        </div>

        <div className={props.styles.currentPlayersWrapper}>
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

            <div className={props.styles.gameModeText}>
                {`Mode: ${props.currentGame.mode}`}
            </div>

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
        </div>

        <div className={props.styles.readyUp}>
            <div>Ready Up</div>
            <Switch
                checked={props.isReady}
                onChange={() => props.readyUpRequest(props.currentGameId, !props.isReady)}
            />
        </div>

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
                        onClick={() => props.startGameRequest(props.currentGameId)}
                    />
                </div>
            )}

        {props.currentGame.playersReady.length === props.currentGame.numberOfPlayers
        && props.currentGame.host !== props.auth.uid && (
            <div className={props.styles.waitingForHost}>
                {`Waiting for ${mapUserIdToName(props.users, props.currentGame.host)} to start the game`}
            </div>
        )}

        {props.currentGame.playersReady.length < props.currentGame.numberOfPlayers && (
            <div className={props.styles.waitingForPlayersToReady}>
                Waiting for players to ready up
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
);

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
    startGameRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    leaveGameRequest,
    readyUpRequest,
    startGameRequest
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    currentGame: selectors.getCurrentGame(state, props),
    currentGameId: selectors.getGameId(props),
    isReady: selectors.getIsReady(state, props),
    users: state.firestore.data.users
});

export default withRouter(compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        },
        {
            collection: 'users'
        }
    ]),
)(GameNotStarted));

export { GameNotStarted as GameNotStartedUnconnected };
