/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import defaultStyles from './History.module.scss';
import * as selectors from './selectors';
import * as helpers from './helpers';
import * as constants from '../constants';

const History = props => (
    props.history.map(h => {
        if (h.type === constants.historyTypes.Quest) {
            return (
                <div className={props.styles.questHistoryWrapper}>


                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>

                    <div className={props.styles.realQuestHistory}>
                        <div>
                            {`Players on quest: ${h.questers.map(q => helpers.mapUserIdToName(props.users, q)).join(', ')} `}
                        </div>

                        <div className={props.styles.questResults}>
                                Result:
                            {[...Array(h.succeeds)].map(() => <div className={props.styles.questSucceeds}><FiberManualRecordIcon fontSize="small" /></div>)}
                            {[...Array(h.fails)].map(() => <div className={props.styles.questFails}><FiberManualRecordIcon fontSize="small" /></div>)}

                        </div>

                    </div>


                </div>
            );
        }
        if (h.type === constants.historyTypes.Vote) {
            return (
                <div className={props.styles.voteHistoryWrapper}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div>
                            {`Leader: ${helpers.mapUserIdToName(props.users, h.leader)}`}
                        </div>
                        <div>
                            {`Nominated: ${h.nominated.map(p => helpers.mapUserIdToName(props.users, p)).join(', ')}`}
                        </div>

                        {h.votesNo.length ? (
                            h.votesYes.length ? (
                                <div>
                                    {`Votes Yes: ${h.votesYes.map(p => helpers.mapUserIdToName(props.users, p)).join(', ')}`}
                                </div>
                            ) : null
                        ) : (
                            <div>
                                {'Votes Yes: All players'}
                            </div>
                        )}

                        {h.votesYes.length ? (
                            h.votesNo.length ? (
                                <div>
                                    {`Votes No: ${h.votesNo.map(p => helpers.mapUserIdToName(props.users, p)).join(', ')}`}
                                </div>
                            ) : null
                        ) : (
                            <div>
                                {'Votes No: All players'}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    })
);

History.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        currentPlayers: [],
        host: '',
        history: [],
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
    history: [],
    styles: defaultStyles,
    users: {}
};

History.propTypes = {
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
    history: PropTypes.arrayOf(PropTypes.shape({

    })),
    makeVoteRequest: PropTypes.func.isRequired,
    makeQuestRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    currentGame: selectors.getCurrentGame(state, props),
    currentGameId: selectors.getGameId(props),
    history: selectors.getCurrentGame(state, props).history,
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
)(History));

export { History as HistoryUnconnected };
