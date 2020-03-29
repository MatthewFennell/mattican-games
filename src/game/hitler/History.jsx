/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import Looks3Icon from '@material-ui/icons/Looks3';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import defaultStyles from './History.module.scss';
import Bullet from './Bullet.png';

const History = props => (
    props.history.map(h => {
        if (h.type === constants.historyTypes.Vote) {
            return (
                <div className={props.styles.voteHistoryWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div>
                            {`President: ${helpers.mapUserIdToName(props.users, h.president)}`}
                        </div>
                        <div>
                            {`Chancellor: ${helpers.mapUserIdToName(props.users, h.chancellor)}`}
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
        if (h.type === constants.historyTypes.PlayChancellorCard) {
            return (
                <div className={props.styles.chancellorPlayCardWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div>
                            {`President: ${helpers.mapUserIdToName(props.users, h.president)}`}
                        </div>
                        <div>
                            {`Chancellor: ${helpers.mapUserIdToName(props.users, h.chancellor)}`}
                        </div>
                        <div>
                            {`Card played: ${h.card === 1 ? 'Liberal' : 'Fascist'}`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        {h.card === 1 ? (
                            <div className={props.styles.liberalPlayed} />
                        ) : (
                            <div className={props.styles.fascistPlayed} />
                        )}
                    </div>
                </div>
            );
        }
        if (h.type === constants.historyTypes.Peek) {
            return (
                <div className={props.styles.chancellorPlayCardWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div className={props.styles.checkTopThree}>
                            {`${helpers.mapUserIdToName(props.users, h.president)} has looked at the top 3 cards`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        <div>
                            <div className={props.styles.questSucceed}><Looks3Icon fontSize="large" /></div>
                        </div>
                    </div>
                </div>
            );
        }
        if (h.type === constants.historyTypes.Kill) {
            return (
                <div className={props.styles.killPlayerWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div className={props.styles.whoKilledWho}>
                            {`${helpers.mapUserIdToName(props.users, h.president)} killed ${helpers.mapUserIdToName(props.users, h.killed)}`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        <img src={Bullet} className={props.styles.tempBullet} alt="Bullet" />
                    </div>
                    <div>
                        <div className={props.styles.hidden}><SearchIcon fontSize="large" /></div>
                    </div>
                </div>
            );
        }
        if (h.type === constants.historyTypes.TopCardFlipped) {
            return (
                <div className={props.styles.topCardFlippedWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.whichCardFlipped}>
                        {`Top card flipped. It was a ${h.card === 1 ? 'Liberal' : 'Fascist'} card`}
                    </div>
                    <div className={props.styles.round}>
                        {h.card === 1 ? (
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
        if (h.type === constants.historyTypes.Veto) {
            return (
                <div className={props.styles.vetoWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div>
                            {`President: ${helpers.mapUserIdToName(props.users, h.president)}`}
                        </div>
                        <div>
                            {`Chancellor: ${helpers.mapUserIdToName(props.users, h.chancellor)}`}
                        </div>
                        <div className={props.styles.vetoOption}>
                            {`${helpers.mapUserIdToName(props.users, h.chancellor)} requested to veto and
                             ${helpers.mapUserIdToName(props.users, h.president)}${h.approvedVeto ? ' agreed' : ' rejected'}`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        {h.approvedVeto ? (
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
        if (h.type === constants.historyTypes.Investigate) {
            return (
                <div className={props.styles.investigateWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div className={props.styles.investigateCard}>
                            {`${helpers.mapUserIdToName(props.users, h.president)} has looked at the card of ${helpers.mapUserIdToName(props.users, h.investigated)}`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        <SearchIcon fontSize="large" />
                    </div>
                </div>
            );
        }
        if (h.type === constants.historyTypes.TransferPresident) {
            return (
                <div className={props.styles.investigateWrapper} key={`${h.round}-${h.type}-${h.president}`}>
                    <div className={props.styles.round}>
                        {`Round ${h.round}`}
                    </div>
                    <div className={props.styles.realVoteHistory}>
                        <div className={props.styles.investigateCard}>
                            {`${helpers.mapUserIdToName(props.users, h.president)} made ${helpers.mapUserIdToName(props.users, h.temporaryPresident)} the president`}
                        </div>
                    </div>
                    <div className={props.styles.round}>
                        <StarHalfIcon fontSize="large" />
                    </div>
                </div>
            );
        }
        return null;
    })
);


History.defaultProps = {
    history: [],
    styles: defaultStyles,
    users: {}
};

History.propTypes = {
    history: PropTypes.arrayOf(PropTypes.shape({})),
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default History;
