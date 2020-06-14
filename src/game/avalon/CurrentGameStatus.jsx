import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { connect } from 'react-redux';
import defaultStyles from './CurrentGameStatus.module.scss';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import StyledButton from '../../common/StyledButton/StyledButton';
import GameFinished from './GameFinished';
import { makeVoteRequest, makeQuestRequest } from './actions';

const CurrentGameStatus = props => {
    const [localVoteValue, setLocalVoteValue] = useState(false);

    const [hasLocalPlayedSucceed, setHasLocalPlayedSucceed] = useState(props.currentGame
        .questSuccesses.includes(props.auth.uid));

    const makeQuest = useCallback(succeed => {
        props.makeQuestRequest(props.currentGameId, succeed);
        props.setHasLocalPlayed(true);
        setHasLocalPlayedSucceed(succeed);
        // eslint-disable-next-line
    }, [props.currentGameId, setHasLocalPlayedSucceed, props.setHasLocalPlayed]);

    const placeVote = useCallback(vote => {
        props.makeVoteRequest(props.currentGameId, vote);
        props.setHasLocalVoted(true);
        setLocalVoteValue(vote);
        // eslint-disable-next-line
    }, [props.currentGameId, props.setHasLocalVoted, props.setLocalVoteValue])

    if (props.currentGame.status === constants.avalonGameStatuses.Nominating) {
        return (
            <div className={props.styles.nominating}>
                {props.currentGame.leader === props.auth.uid ? `You are the leader. Select ${constants.avalonRounds[props.currentGame.numberOfPlayers][props.currentGame.round]} players for quest` : `${helpers.mapUserIdToName(props.users, props.currentGame.leader)} is currently selecting ${
                    constants.avalonRounds[props.currentGame.numberOfPlayers][props.currentGame.round]} players to send on a quest` }
            </div>
        );
    }


    if (props.currentGame.status === constants.avalonGameStatuses.Voting) {
        return (
            <div className={props.styles.votingWrapper}>
                <div className={props.styles.votingButtons}>
                    {props.currentGame.votesAgainst.includes(props.auth.uid)
                        || props.currentGame.votesFor.includes(props.auth.uid)
                        || props.hasLocalVoted
                        ? <StyledButton text={`Voted ${(props.currentGame.votesFor.includes(props.auth.uid) || localVoteValue) ? 'Yes' : 'No'}`} disabled /> : (
                            <>
                                <StyledButton text="Vote Yes" onClick={() => placeVote(true)} />
                                <StyledButton text="Vote No" color="secondary" onClick={() => placeVote(false)} />
                            </>
                        )}
                </div>
            </div>
        );
    }

    if (props.currentGame.status === constants.avalonGameStatuses.Finished) {
        return (
            <GameFinished
                auth={props.auth}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                myRole={props.myRole}
                users={props.users}
            />
        );
    }

    if (props.currentGame.status === constants.avalonGameStatuses.GuessingMerlin) {
        return (
            <div className={props.styles.guessingMerlinWrapper}>
                <div className={props.styles.guessingMessage}>
                    The bad guys are currently guessing Merlin
                </div>
                <div className={props.styles.badGuysWrapper}>
                    {props.currentGame.playerRoles
                        .filter(r => !constants.avalonRoles[r.role].isGood)
                        .map(r => (
                            <div key={r.player}>
                                {`${helpers.mapUserIdToName(props.users, r.player)} was ${r.role}`}
                            </div>
                        ))}
                </div>
                <div className={props.styles.playerWithGuess}>
                    {`${helpers.mapUserIdToName(props.users, props.currentGame.playerToGuessMerlin)} has the casting guess`}
                </div>

            </div>
        );
    }

    if (props.currentGame.status === constants.avalonGameStatuses.Questing) {
        if (!props.currentGame.playersOnQuest.includes(props.auth.uid)) {
            return (
                <div className={props.styles.notOnQuestMessage}>
                    Players are questing! You are not on the quest
                </div>
            );
        }

        return (
            <div className={props.styles.questingWrapper}>
                <div className={props.styles.questButtons}>
                    {props.currentGame.questSuccesses.includes(props.auth.uid)
                        || props.currentGame.questFails.includes(props.auth.uid)
                        || props.hasLocalPlayed
                        ? <StyledButton text={`Played ${(props.currentGame.questSuccesses.includes(props.auth.uid) || hasLocalPlayedSucceed) ? 'Succeed' : 'Fail'}`} disabled /> : (
                            <>
                                <StyledButton
                                    text="Play Succeed"
                                    onClick={() => makeQuest(true)}
                                />
                                <StyledButton
                                    text="Play Fail"
                                    color="secondary"
                                    onClick={() => makeQuest(false)}
                                    disabled={constants.avalonRoles[props.myRole].isGood}
                                />
                            </>
                        )}
                </div>
            </div>
        );
    }

    return (
        <div className={props.styles.currentGameStatus}>
            <div className={props.styles.currentGameStateWrapper}>
                {`${helpers.mapUserIdToName(props.users, props.currentGame.leader)} is currently selecting ${
                    constants.avalonRounds[props.currentGame.numberOfPlayers][props.currentGame.round]} players to send on a quest`}
            </div>
        </div>
    );
};

CurrentGameStatus.defaultProps = {
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
        playerToGuessMerlin: '',
        playersOnQuest: [],
        playerRoles: [],
        status: '',
        questFails: [],
        questSuccesses: [],
        votesAgainst: [],
        votesFor: []
    },
    currentGameId: '',
    hasLocalPlayed: false,
    hasLocalVoted: false,
    myRole: '',
    setHasLocalPlayed: noop,
    setHasLocalVoted: noop,
    styles: defaultStyles,
    users: {}
};

CurrentGameStatus.propTypes = {

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
        questFails: PropTypes.arrayOf(PropTypes.string),
        questSuccesses: PropTypes.arrayOf(PropTypes.string),
        playerToGuessMerlin: PropTypes.string,
        playersReady: PropTypes.arrayOf(PropTypes.string),
        playersOnQuest: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string
        })),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    hasLocalPlayed: PropTypes.bool,
    hasLocalVoted: PropTypes.bool,
    makeVoteRequest: PropTypes.func.isRequired,
    makeQuestRequest: PropTypes.func.isRequired,
    myRole: PropTypes.string,
    setHasLocalPlayed: PropTypes.func,
    setHasLocalVoted: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    makeVoteRequest,
    makeQuestRequest
};

export default connect(null, mapDispatchToProps)(CurrentGameStatus);

export { CurrentGameStatus as CurrentGameStatusUnconnected };
