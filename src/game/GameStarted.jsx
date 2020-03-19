import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import defaultStyles from './GameStarted.module.scss';
import * as selectors from './selectors';
import Fade from '../common/Fade/Fade';
import * as helpers from './helpers';
import * as constants from '../constants';


const GameStarted = props => {
    const [viewingRole, setViewingRole] = useState(false);
    const toggleViewRoles = useCallback(() => {
        setViewingRole(!viewingRole);
    }, [viewingRole, setViewingRole]);


    const generateSecretInfo = role => {
        console.log('role', role);
        if (role === constants.avalonRoles.Merlin.name) {
            return props.currentGame.playerRoles
                .filter(r => !constants.avalonRoles[r.role].isGood)
                .filter(r => r.role !== constants.avalonRoles.Mordred.name)
                .map(r => (
                    <div>{`${helpers.mapUserIdToName(props.users, r.player)} is bad`}</div>
                ));
        }
        if (role === constants.avalonRoles.RegularGood.name
            || role === constants.avalonRoles.Oberon.name) {
            return <div>Afraid you know nothing</div>;
        }
        if (role === constants.avalonRoles.RegularBad.name
            || role === constants.avalonRoles.Mordred.name
            || role === constants.avalonRoles.Morgana.name) {
            return props.currentGame.playerRoles.filter(r => !constants.avalonRoles[r.role].isGood)
                .filter(r => r.role !== constants.avalonRoles.Oberon.name)
                .map(r => (
                    <div>{`${helpers.mapUserIdToName(props.users, r.player)} is bad with you`}</div>
                ));
        }
        if (role === constants.avalonRoles.Percival.name) {
            if (props.currentGame.roles.includes(constants.avalonRoles.Merlin.name)
            && props.currentGame.roles.includes(constants.avalonRoles.Morgana.name)) {
                const potentialPairs = props.currentGame.playerRoles
                    .filter(r => r.role === constants.avalonRoles.Merlin.name
                || r.role === constants.avalonRoles.Morgana.name);

                console.log('Potential pairs', potentialPairs);

                const names = `${helpers.mapUserIdToName(props.users, potentialPairs[0].player)} / ${helpers.mapUserIdToName(props.users, potentialPairs[1].player)}`;

                return <div>{`${names} are Merlin / Morgana`}</div>;
            }
            return props.currentGame.playerRoles
                .filter(r => r.role === constants.avalonRoles.Merlin.name)
                .map(r => <div>{`${helpers.mapUserIdToName(props.users, r.player)} is Merlin`}</div>);
        }
        return null;
    };


    return (
        <div className={props.styles.gameStartedWrapper}>
            <div className={props.styles.roundHeader}>
                {`Round: ${props.currentGame.round}`}
            </div>

            <div className={props.styles.viewSecretInfoWrapper}>
                <Fade
                    checked={viewingRole}
                    label="View secret info"
                    includeCheckbox
                    onChange={toggleViewRoles}
                >
                    <div className={classNames({
                        [props.styles.viewingRole]: true,
                        [props.styles.isGood]: helpers.isRoleGood(props.myRole),
                        [props.styles.isBad]: !helpers.isRoleGood(props.myRole)
                    })}
                    >
                        {`Role: ${props.myRole}`}
                    </div>
                    {generateSecretInfo(props.myRole)}
                </Fade>
            </div>

            <div className={props.styles.currentLeaderWrapper}>
                {`The current leader is ${helpers.mapUserIdToName(props.users, props.currentGame.leader)}`}
            </div>

            <div className={props.styles.playerOrder}>
                {props.currentGame.currentPlayers.map((player, index) => (
                    <div className={props.styles.playerWrapper}>
                        <div className={props.styles.playerNumber}>{`#:${index + 1}`}</div>
                        <div className={classNames({
                            [props.styles.playerName]: true,
                            [props.styles.activePlayer]: player === props.currentGame.leader
                        })}
                        >
                            {helpers.mapUserIdToName(props.users, player)}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        currentPlayers: [],
        host: '',
        leader: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        round: 0,
        playersReady: [],
        playerRoles: []
    },
    currentGameId: '',
    myRole: '',
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {

    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        leader: PropTypes.string,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.number,
        playersReady: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string
        }))
    }),
    currentGameId: PropTypes.string,
    myRole: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    currentGame: selectors.getCurrentGame(state, props),
    currentGameId: selectors.getGameId(props),
    myRole: selectors.getMyRole(state, props),
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
)(GameStarted));

export { GameStarted as GameStartedUnconnected };
