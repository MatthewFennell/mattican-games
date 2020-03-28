import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { noop } from 'lodash';
import fp from 'lodash/fp';
import defaultStyles from './GameStarted.module.scss';
import * as selectors from '../selectors';
import Fade from '../../common/Fade/Fade';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import CurrentGameStatus from './CurrentGameStatus';
import {
    nominateChancellorRequest, confirmChancellorRequest, leaveGameRequest,
    destroyGameRequest, approveLeaveMidgameRequest, selectInvestigateRequest,
    confirmInvesigationRequest, makeTemporaryPresidentRequest, confirmPresidentRequest
} from '../actions';
import StyledButton from '../../common/StyledButton/StyledButton';
import Switch from '../../common/Switch/Switch';
import SuccessModal from '../../common/modal/SuccessModal';
import HitlerBoard from './HitlerBoard';

const GameStarted = props => {
    const {
        ChancellorDecidingCards,
        Finished,
        Nominating,
        PresidentDecidingCards,
        Voting,
        Investigate,
        Transfer,
        TemporaryPresident
    } = constants.hitlerGameStatuses;

    const [viewingRole, setViewingRole] = useState(false);
    const [viewingBoard, setViewingBoard] = useState(false);
    const [showingHistory, setShowingHistory] = useState(false);

    const submitNominations = useCallback(() => {
        props.confirmChancellorRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [props.currentGame])

    const generateHiddenInfo = () => {
        const items = props.currentGame.hiddenInfo.filter(x => x.president === props.auth.uid);
        if (items && items.length) {
            const info = fp.first(items);
            if (info.type === Investigate) {
                const playerSeen = props.currentGame.playerRoles
                    .find(x => x.player === info.investigated);
                if (playerSeen.role === constants.hitlerRoles.Liberal) {
                    return <div>{`You saw ${helpers.mapUserIdToName(props.users, playerSeen.player)} as a liberal`}</div>;
                }
                return <div>{`You saw ${helpers.mapUserIdToName(props.users, playerSeen.player)} as a fascist`}</div>;
            }
        }
        return null;
    };

    const generateSecretInfo = role => {
        if (props.currentGame.numberOfPlayers <= 6) {
            if (role === constants.hitlerRoles.Fascist) {
                const hitler = fp.get('player')(props.currentGame.playerRoles.find(x => x.role === constants.hitlerRoles.Hitler));
                return <div>{`${helpers.mapUserIdToName(props.users, hitler)} is Hitler`}</div>;
            }
            if (role === constants.hitlerRoles.Hitler) {
                const fascist = fp.get('player')(props.currentGame.playerRoles.find(x => x.role === constants.hitlerRoles.Fascist));
                return <div>{`${helpers.mapUserIdToName(props.users, fascist)} is your regular fascist`}</div>;
            }
        }
        if (props.currentGame.numberOfPlayers <= 8) {
            if (role === constants.hitlerRoles.Fascist) {
                const hitler = fp.get('player')(props.currentGame.playerRoles.find(x => x.role === constants.hitlerRoles.Hitler));
                const fascist = fp.get('player')(props.currentGame.playerRoles.find(x => x.role === constants.hitlerRoles.Fascist));

                return (
                    <div>
                        <div>{`${helpers.mapUserIdToName(props.users, fascist)} is your regular fascist`}</div>
                        <div>{`${helpers.mapUserIdToName(props.users, hitler)} is Hitler`}</div>
                    </div>
                );
            }
        }
        if (role === constants.hitlerRoles.Fascist) {
            const hitler = fp.get('player')(props.currentGame.playerRoles.find(x => x.role === constants.hitlerRoles.Hitler));
            const fascists = props.currentGame.playerRoles
                .filter(x => x.role === constants.hitlerRoles.Fascist
                    && x.player !== props.auth.uid)
                .map(x => helpers.mapUserIdToName(props.users, x.player));
            return (
                <div>
                    <div>
                        {`${fascists[0]} and ${fascists[1]} are your regular fascists`}
                    </div>
                    <div>{`${helpers.mapUserIdToName(props.users, hitler)} is Hitler`}</div>
                </div>
            );
        }
        return <div>Afraid you know nothing</div>;
    };

    const nominatePlayer = useCallback(player => {
        if (props.currentGame.status === Nominating) {
            if (props.currentGame.president === props.auth.uid) {
                props.nominateChancellorRequest(props.currentGameId, player);
            }
        }
        if (props.currentGame.status === Investigate) {
            if (props.currentGame.president === props.auth.uid) {
                props.selectInvestigateRequest(props.currentGameId, player);
            }
        }
        if (props.currentGame.status === Transfer) {
            if (props.currentGame.president === props.auth.uid) {
                props.makeTemporaryPresidentRequest(props.currentGameId, player);
            }
        }
        if (props.currentGame.status === TemporaryPresident) {
            if (props.currentGame.temporaryPresident === props.auth.uid) {
                props.nominateChancellorRequest(props.currentGameId, player);
            }
        }
        // eslint-disable-next-line
    }, [props.currentGame, props.auth.uid]);    

    return (
        <div className={props.styles.gameStartedWrapper}>
            {props.currentGame.status === Finished
                ? <div className={props.styles.gameFinished}>Game finished </div> : (
                    <div className={props.styles.roundHeader}>
                        {`Round: ${props.currentGame.round}`}
                    </div>
                )}

            {props.currentGame.status !== Finished
            && (
                <div className={props.styles.currentLeaderWrapper}>
                    {`The current President is ${helpers.mapUserIdToName(props.users, props.currentGame.president)}`}
                </div>
            )}
            <CurrentGameStatus />

            <div className={props.styles.playerOrder}>
                {props.currentGame.currentPlayers.map((player, index) => (
                    <div
                        className={classNames({
                            [props.styles.playerWrapper]: true,
                            [props.styles.nominatedChancellor]: props.currentGame
                                .chancellor === player && props.currentGame.status
                                === Nominating,
                            [props.styles.isActivePlayer]: player === props.currentGame.president,
                            [props.styles.activeChancellor]: (props.currentGame.status
                                === PresidentDecidingCards
                                || props.currentGame.status === ChancellorDecidingCards)
                                && props.currentGame.chancellor === player,
                            [props.styles.potentialInvestigation]: props.currentGame.status
                            === Investigate
                            && props.currentGame.playerToInvestigate === player,
                            [props.styles.potentialTempPres]: props.currentGame.status
                            === Transfer
                            && props.currentGame.temporaryPresident === player
                        })}
                        role="button"
                        tabIndex={0}
                        onClick={() => nominatePlayer(player)}
                        key={player}
                    >
                        <div className={props.styles.playerNumber}>
                            <div>{`#${index + 1}`}</div>
                            {props.currentGame.president === player
                            && props.currentGame.status !== TemporaryPresident
                            && <div className={props.styles.currentPresident}>(President)</div>}
                            {props.currentGame.chancellor === player
                            && <div className={props.styles.currentChancellor}>(Chancellor)</div>}
                            {props.currentGame.temporaryPresident === player
                            && props.currentGame.status === TemporaryPresident
                            && <div className={props.styles.currentPresident}>(Pres)</div>}
                        </div>
                        <div className={classNames({
                            [props.styles.playerName]: true,
                            [props.styles.activePlayer]: player === props.currentGame.president
                        })}
                        >
                            {helpers.mapUserIdToName(props.users, player)}
                            {props.auth.uid === player && ' (you)'}
                        </div>
                        {props.currentGame.status === Voting
                        && (
                            <div className={classNames({
                                [props.styles.votingStage]: true,
                                [props.styles.haveVoted]: props.currentGame
                                    .votesFor.includes(player)
                                || props.currentGame
                                    .votesAgainst.includes(player),
                                [props.styles.notVoted]: !props.currentGame
                                    .votesFor.includes(player)
                            && !props.currentGame
                                .votesAgainst.includes(player)
                            })}
                            >
                                <FiberManualRecordIcon fontSize="small" />
                            </div>
                        )}

                    </div>
                ))}
            </div>

            {((props.currentGame.president === props.auth.uid
            && props.currentGame.status === Nominating)
             || (props.currentGame.temporaryPresident === props.auth.uid
            && props.currentGame.status === TemporaryPresident))
            && (
                <div className={props.styles.confirmNominationWrapper}>
                    <StyledButton
                        text="Confirm Nominations"
                        onClick={submitNominations}
                        disabled={!props.currentGame.chancellor}
                    />
                </div>
            ) }

            {props.currentGame.president === props.auth.uid
            && props.currentGame.status === Transfer
            && (
                <div className={props.styles.confirmNominationWrapper}>
                    <StyledButton
                        text="Confirm President"
                        onClick={() => props.confirmPresidentRequest(props.currentGameId)}
                        disabled={!props.currentGame.temporaryPresident}
                    />
                </div>
            ) }

            {props.currentGame.president === props.auth.uid
            && props.currentGame.status === Investigate
            && (
                <div className={props.styles.confirmNominationWrapper}>
                    <StyledButton
                        text="Confirm Investigation"
                        onClick={() => props.confirmInvesigationRequest(props.currentGameId)}
                        disabled={!props.currentGame.playerToInvestigate}
                    />
                </div>
            ) }

            {props.currentGame.status === Finished && (
                <div className={props.styles.leaveGameButton}>
                    <StyledButton text="Leave Game" color="secondary" onClick={() => props.leaveGameRequest(props.currentGameId)} />
                </div>
            )}

            {props.currentGame.status === Finished
            && props.currentGame.host === props.auth.uid && (
                <div className={props.styles.destroyGameButton}>
                    <StyledButton text="Destroy Game" color="secondary" onClick={() => props.destroyGameRequest(props.currentGameId)} />
                </div>
            )}

            <div className={props.styles.toggleWrappers}>
                <div className={props.styles.switchWrapper}>
                    <div>View Info</div>
                    <div><Switch onChange={setViewingRole} checked={viewingRole} /></div>
                </div>
                <div className={props.styles.switchWrapper}>
                    <div>View Board</div>
                    <div><Switch onChange={setViewingBoard} checked={viewingBoard} /></div>
                </div>
                <div className={props.styles.switchWrapper}>
                    <div>View History</div>
                    <div><Switch onChange={setShowingHistory} checked={showingHistory} /></div>
                </div>
            </div>

            <div className={props.styles.viewSecretInfoWrapper}>
                <Fade
                    checked={viewingRole}
                >
                    <div className={classNames({
                        [props.styles.viewingRole]: true,
                        [props.styles.isGood]: props.myRole === constants.hitlerRoles.Liberal,
                        [props.styles.isBad]: props.myRole !== constants.hitlerRoles.Liberal
                    })}
                    >
                        {`Role: ${props.myRole}`}
                    </div>
                    {generateSecretInfo(props.myRole)}
                    {generateHiddenInfo()}
                </Fade>
            </div>

            <div className={props.styles.viewingBoardWrapper}>
                <Fade
                    checked={viewingBoard}
                >
                    <div className={props.styles.avalonBoard}>
                        <HitlerBoard
                            numberOfPlayers={props.currentGame.numberOfPlayers}
                            numberOfLiberals={props.currentGame.numberLiberalPlayed}
                            numberOfFascists={props.currentGame.numberFascistPlayed}
                        />

                        <div className={props.styles.consecutiveRejections}>
                            {`Consecutive rejections: ${props.currentGame.consecutiveRejections}`}
                        </div>
                    </div>
                </Fade>
            </div>

            {/* <div className={props.styles.historyWrapper}>
                <Fade
                    checked={showingHistory}
                >
                    <History />
                </Fade>
            </div> */}

            <SuccessModal
                backdrop
                closeModal={noop}
                error
                isOpen={Boolean(props.currentGame.requestToEndGame)}
                headerMessage={`${helpers.mapUserIdToName(props.users, props.currentGame.requestToEndGame)} wants to end the game`}
            >
                <div className={props.styles.endGameWrapper}>
                    <div className={props.styles.numVotes}>3 Votes are required</div>
                    <div className={props.styles.endGameVotes}>
                        {props.currentGame.approveLeaveMidgame.map(id => <div className={props.styles.approval} key={id}><FiberManualRecordIcon fontSize="small" /></div>)}
                        {props.currentGame.rejectLeaveMidgame.map(id => <div className={props.styles.rejection} key={id}><FiberManualRecordIcon fontSize="small" /></div>)}
                    </div>

                    <div className={props.styles.endGameButtons}>

                        <StyledButton
                            text="Approve"
                            onClick={() => props.approveLeaveMidgameRequest(
                                props.currentGameId, true
                            )}
                            disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)}
                        />
                        <StyledButton
                            text="Reject"
                            color="secondary"
                            onClick={() => props.approveLeaveMidgameRequest(
                                props.currentGameId, false
                            )}
                            disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)}
                        />
                    </div>
                </div>
            </SuccessModal>
        </div>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        approveLeaveMidgame: [],
        chancellor: '',
        currentPlayers: [],
        consecutiveRejections: 0,
        hiddenInfo: [],
        host: '',
        president: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        round: 0,
        numberLiberalPlayed: 0,
        numberFascistPlayed: 0,
        playersReady: [],
        playerRoles: [],
        playerToInvestigate: '',
        status: '',
        temporaryPresident: '',
        votesAgainst: [],
        votesFor: [],
        requestToEndGame: '',
        rejectLeaveMidgame: []
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
    confirmChancellorRequest: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        approveLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        chancellor: PropTypes.string,
        consecutiveRejections: PropTypes.number,
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        hiddenInfo: PropTypes.arrayOf(PropTypes.shape({
            president: PropTypes.string,
            type: PropTypes.string
        })),
        host: PropTypes.string,
        president: PropTypes.string,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        numberLiberalPlayed: PropTypes.number,
        numberFascistPlayed: PropTypes.number,
        round: PropTypes.number,
        playerToInvestigate: PropTypes.string,
        playersReady: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            role: PropTypes.string,
            player: PropTypes.string
        })),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        rejectLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        requestToEndGame: PropTypes.string,
        status: PropTypes.string,
        temporaryPresident: PropTypes.string
    }),
    confirmInvesigationRequest: PropTypes.func.isRequired,
    destroyGameRequest: PropTypes.func.isRequired,
    leaveGameRequest: PropTypes.func.isRequired,
    nominateChancellorRequest: PropTypes.func.isRequired,
    makeTemporaryPresidentRequest: PropTypes.func.isRequired,
    approveLeaveMidgameRequest: PropTypes.func.isRequired,
    confirmPresidentRequest: PropTypes.func.isRequired,
    selectInvestigateRequest: PropTypes.func.isRequired,
    currentGameId: PropTypes.string,
    myRole: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    confirmInvesigationRequest,
    destroyGameRequest,
    confirmChancellorRequest,
    leaveGameRequest,
    nominateChancellorRequest,
    approveLeaveMidgameRequest,
    selectInvestigateRequest,
    makeTemporaryPresidentRequest,
    confirmPresidentRequest
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
