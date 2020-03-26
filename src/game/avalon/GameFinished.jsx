import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import defaultStyles from './GameFinished.module.scss';
import * as selectors from '../selectors';
import * as helpers from '../helpers';
import * as constants from '../../constants';

const GameFinished = props => {
    const questResults = props.currentGame.questResult;
    const goodWon = questResults.filter(x => x === 1).length === 3;

    if (goodWon) {
        if (props.currentGame.guessedMerlinCorrectly) {
            return (
                <div className={props.styles.resultWrapper}>
                    <div className={props.styles.guessedMerlin}>
                   The Bad Guys Guessed Merlin Correctly
                    </div>
                    <div className={props.styles.allRolesWrapper}>
                        {props.currentGame.playerRoles.map(r => (
                            <div key={r.player}>{`${helpers.mapUserIdToName(props.users, r.player)} was ${r.role}`}</div>
                        ))}
                    </div>
                </div>
            );
        }

        if (props.currentGame.status === constants.avalonGameStatuses.GuessingMerlin) {
            return (
                <div>
                    Guessing Merlin
                </div>
            );
        }

        return (
            <div className={props.styles.goodGuysWonWrapper}>
                <div className={props.styles.goodGuysHeader}>The loyal servants of Arthur won</div>
                <div className={props.styles.allRolesWrapper}>
                    {props.currentGame.playerRoles.map(r => (
                        <div>{`${helpers.mapUserIdToName(props.users, r.player)} was ${r.role}`}</div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={props.styles.badGuysWonWrapper}>
            <div className={props.styles.badGuysHeader}>The minions of mordred won</div>

            <div className={props.styles.finalPlayerRoles}>
                {props.currentGame.playerRoles.map(role => (
                    <div key={role.player}>{`${helpers.mapUserIdToName(props.users, role.player)} was ${helpers.printRoleName(role.role)}`}</div>
                ))}
            </div>

        </div>
    );
};

GameFinished.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        currentPlayers: [],
        host: '',
        leader: '',
        guessedMerlinCorrectly: false,
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        round: 0,
        playersReady: [],
        playersOnQuest: [],
        playerRoles: [],
        status: '',
        questFails: [],
        questSuccesses: [],
        votesAgainst: [],
        votesFor: [],
        questResult: []
    },
    styles: defaultStyles,
    users: {}
};

GameFinished.propTypes = {

    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        leader: PropTypes.string,
        guessedMerlinCorrectly: PropTypes.bool,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.number,
        questFails: PropTypes.arrayOf(PropTypes.string),
        questSuccesses: PropTypes.arrayOf(PropTypes.string),
        playersReady: PropTypes.arrayOf(PropTypes.string),
        playersOnQuest: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string
        })),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        questResult: PropTypes.arrayOf(PropTypes.number),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.objectOf(PropTypes.shape({}))
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
)(GameFinished));

export { GameFinished as GameFinishedUnconnected };
