import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import defaultStyles from './CurrentGameStatus.module.scss';
import * as selectors from '../selectors';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import StyledButton from '../../common/StyledButton/StyledButton';
import Fade from '../../common/Fade/Fade';
import { makeVoteRequest, makeQuestRequest } from '../actions';
// import GameFinished from './GameFinished';

const CurrentGameStatus = props => {
    const [makingVote, setMakingVote] = useState(false);
    const toggleMakingVote = useCallback(() => {
        setMakingVote(!makingVote);
    }, [makingVote, setMakingVote]);

    const placeVote = useCallback(vote => {
        props.makeVoteRequest(props.currentGameId, vote);
        setMakingVote(false);
        // eslint-disable-next-line
    }, [props.currentGameId])

    if (props.currentGame.status === constants.hitlerGameStatuses.Nominating) {
        return (
            <div className={props.styles.nominating}>
                {`${helpers.mapUserIdToName(props.users, props.currentGame.leader)} is currently selecting a chancellor`}
            </div>
        );
    }

    if (props.currentGame.status === constants.avalonGameStatuses.Voting) {
        return (
            <div className={props.styles.votingWrapper}>
                <Fade
                    checked={makingVote}
                    onChange={toggleMakingVote}
                    includeCheckbox
                    label="Cast Vote"
                >
                    <div className={props.styles.votingButtons}>
                        {props.currentGame.votesAgainst.includes(props.auth.uid)
                        || props.currentGame.votesFor.includes(props.auth.uid)
                            ? <StyledButton text={`Voted ${props.currentGame.votesFor.includes(props.auth.uid) ? 'Yes' : 'No'}`} disabled /> : (
                                <>
                                    <StyledButton text="Vote Yes" onClick={() => placeVote(true)} />
                                    <StyledButton text="Vote No" color="secondary" onClick={() => placeVote(false)} />
                                </>
                            )}
                    </div>
                </Fade>
            </div>
        );
    }

    if (props.currentGame.status === constants.avalonGameStatuses.Finished) {
        // return <GameFinished />;
    }

    return (
        <div className={props.styles.currentGameStatus}>
            unknown
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
        votesAgainst: [],
        votesFor: []
    },
    currentGameId: '',
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
    makeVoteRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    makeVoteRequest,
    makeQuestRequest
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
)(CurrentGameStatus));

export { CurrentGameStatus as CurrentGameStatusUnconnected };
