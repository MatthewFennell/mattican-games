/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { noop } from 'lodash';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import defaultStyles from './History.module.scss';
import * as helpers from '../helpers';
import * as constants from '../../constants';

const History = props => (
    props.history.map(h => {
        if (h.type === constants.historyTypes.Quest) {
            return (
                <div className={props.styles.questHistoryWrapper} key={`${h.round}-${h.type}-${h.questers.toString()}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realQuestHistory}>
                        <div>
                            {`Players on quest: ${h.questers.map(q => helpers.mapUserIdToName(props.users, q)).join(', ')} `}
                        </div>

                        <div className={props.styles.questResults}>
                            <div>Result</div>
                            {[...Array(h.succeeds)].map((a, index) => <div className={props.styles.questSucceeds} key={index}><FiberManualRecordIcon fontSize="small" /></div>)}
                            {[...Array(h.fails)].map((a, index) => <div className={props.styles.questFails} key={index}><FiberManualRecordIcon fontSize="small" /></div>)}
                        </div>
                    </div>
                </div>
            );
        }
        if (h.type === constants.historyTypes.Vote) {
            if (h.forcedByConsecutiveRejections) {
                return (
                    <div className={props.styles.voteHistoryWrapper} key={`${h.round}-${h.type}-${h.leader}`}>
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
                            <div>
                                This round had no voting
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className={props.styles.voteHistoryWrapper} key={`${h.round}-${h.type}-${h.leader}`}>
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
                                    {`Votes Yes (${h.votesYes.length}) - ${h.votesYes.map(p => helpers.mapUserIdToName(props.users, p)).join(', ')}`}
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
                                    {`Votes No (${h.votesNo.length}) - ${h.votesNo.map(p => helpers.mapUserIdToName(props.users, p)).join(', ')}`}
                                </div>
                            ) : null
                        ) : (
                            <div>
                                {'Votes No: All players'}
                            </div>
                        )}
                    </div>
                    <div className={props.styles.round}>
                        {h.votesYes.length > h.votesNo.length ? (
                            <div>
                                <div className={props.styles.questSucceed}><CheckIcon fontSize="large" /></div>
                            </div>
                        ) : (
                            <div>
                                <div className={props.styles.questFail}><CloseIcon fontSize="large" /></div>
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
    makeQuestRequest: noop,
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
    makeVoteRequest: PropTypes.func,
    makeQuestRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default History;

export { History as HistoryUnconnected };
