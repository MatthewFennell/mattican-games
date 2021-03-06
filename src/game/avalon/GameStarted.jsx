/* eslint-disable max-len */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import _, { noop } from 'lodash';
import fp from 'lodash/fp';
import defaultStyles from './GameStarted.module.scss';
import Fade from '../../common/Fade/Fade';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import CurrentGameStatus from './CurrentGameStatus';
import {
    leaveGameRequest,
    destroyGameRequest, approveLeaveMidgameRequest
} from '../actions';
import StyledButton from '../../common/StyledButton/StyledButton';
import Radio from '../../common/radio/RadioButton';
import History from './History';
import Switch from '../../common/Switch/Switch';
import SuccessModal from '../../common/modal/SuccessModal';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';

import {
    nominatePlayerForQuest, confirmNominationsRequest, guessMerlinRequest,
    realignQuestNominations
} from './actions';

const GameStarted = props => {
    const [viewingRole, setViewingRole] = useState(true);
    const [viewingBoard, setViewingBoard] = useState(true);
    const [merlinGuess, setMerlinGuess] = useState('');
    const [showingHistory, setShowingHistory] = useState(false);
    const [localOnQuest, setLocalOnQuest] = useState(_.union([...props.currentGame.questNominations, ...props.currentGame.playersOnQuest]));
    const [hasSentNominations, setHasSentNominations] = useState(false);
    const [hasGuessedMerlin, setHasGuessedMerlin] = useState(false);
    const [isLeavingOrDestroyingGame, setIsLeavingOrDestroyingGame] = useState(false);

    const destroyGame = useCallback(() => {
        setIsLeavingOrDestroyingGame(true);
        props.destroyGameRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [setIsLeavingOrDestroyingGame, props.currentGameId])

    const leaveGame = useCallback(() => {
        setIsLeavingOrDestroyingGame(true);
        props.leaveGameRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [setIsLeavingOrDestroyingGame, props.currentGameId])

    const toggleLocalOnQuest = useCallback(player => {
        const { numberOfPlayers, round } = props.currentGame;
        const maxNumberOfPlayersOnQuest = constants.avalonRounds[numberOfPlayers][round];

        if (localOnQuest.includes(player)) {
            setLocalOnQuest(localOnQuest.filter(x => x !== player));
        } else if (localOnQuest.length < maxNumberOfPlayersOnQuest) {
            setLocalOnQuest([...localOnQuest, player]);
        }
    }, [localOnQuest, setLocalOnQuest, props.currentGame]);

    const [guessingMerlin, setGuessingMerlin] = useState(false);
    const toggleGuessingMerlin = useCallback(() => {
        setGuessingMerlin(!guessingMerlin);
        // eslint-disable-next-line
    }, [guessingMerlin, setGuessingMerlin]);

    const makeMerlinGuess = useCallback(() => {
        if (merlinGuess) {
            props.guessMerlinRequest(props.currentGameId, merlinGuess);
            setHasGuessedMerlin(true);
        }
        // eslint-disable-next-line
    }, [merlinGuess, props, setHasGuessedMerlin])

    const submitNominations = useCallback(() => {
        props.confirmNominationsRequest(props.currentGameId, localOnQuest);
        setHasSentNominations(true);
        // eslint-disable-next-line
    }, [props.currentGameId, localOnQuest, setHasSentNominations])

    useEffect(() => {
        if (props.auth.uid !== props.currentGame.leader) {
            setLocalOnQuest([]);
            setHasSentNominations(false);
        }
    }, [setLocalOnQuest, props.auth.uid, props.currentGame.leader, setHasSentNominations]);

    const generateSecretInfo = role => {
        if (role === constants.avalonRoles.Merlin.name) {
            return props.currentGame.playerRoles
                .filter(r => !constants.avalonRoles[r.role].isGood)
                .filter(r => r.role !== constants.avalonRoles.Mordred.name)
                .map(r => (
                    <div key={r.player}>{`${helpers.mapUserIdToName(props.users, r.player)} is bad`}</div>
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
                .filter(r => r.role !== role)
                .map(r => (
                    <div key={r.player}>{`${helpers.mapUserIdToName(props.users, r.player)} is bad with you`}</div>
                ));
        }
        if (role === constants.avalonRoles.Percival.name) {
            if (props.currentGame.roles.includes(constants.avalonRoles.Merlin.name)
            && props.currentGame.roles.includes(constants.avalonRoles.Morgana.name)) {
                const potentialPairs = props.currentGame.playerRoles
                    .filter(r => r.role === constants.avalonRoles.Merlin.name
                || r.role === constants.avalonRoles.Morgana.name);

                const names = `${helpers.mapUserIdToName(props.users, potentialPairs[0].player)} / ${helpers.mapUserIdToName(props.users, potentialPairs[1].player)}`;

                return <div>{`${names} are Merlin / Morgana`}</div>;
            }
            return props.currentGame.playerRoles
                .filter(r => r.role === constants.avalonRoles.Merlin.name)
                .map(r => <div key={r.player}>{`${helpers.mapUserIdToName(props.users, r.player)} is Merlin`}</div>);
        }
        return null;
    };

    const nominatePlayer = useCallback(player => {
        if (props.currentGame.status === constants.avalonGameStatuses.Nominating) {
            if (props.currentGame.leader === props.auth.uid) {
                const playerAlreadyOnMission = props.currentGame.questNominations.includes(player);
                props.nominatePlayerForQuest(props.currentGameId, player, !playerAlreadyOnMission);
                toggleLocalOnQuest(player);
            }
        }
        // eslint-disable-next-line
    }, [props.currentGame, props.auth.uid, localOnQuest, setLocalOnQuest]);

    const generateResultIcon = (result, round) => {
        if (result === 1) {
            return (
                <div className={props.styles.successResult}>
                    <div className={props.styles.missionNum}>
                        {constants.avalonRounds[props.currentGame.numberOfPlayers][round]}
                    </div>
                    <div><FiberManualRecordIcon fontSize="small" /></div>
                </div>
            );
        }
        if (result === -1) {
            return (
                <div className={props.styles.failResult}>
                    <div className={props.styles.missionNum}>
                        {constants.avalonRounds[props.currentGame.numberOfPlayers][round]}
                    </div>
                    <div><FiberManualRecordIcon fontSize="small" /></div>
                </div>
            );
        }
        return (
            <div>
                <div className={props.styles.missionNum}>
                    {constants.avalonRounds[props.currentGame.numberOfPlayers][round]}
                </div>
                <div><FiberManualRecordIcon fontSize="small" /></div>
            </div>
        );
    };

    const isPlayerOnQuest = useCallback(player => {
        if (props.currentGame.leader === props.auth.uid) {
            return localOnQuest.includes(player);
        }
        if (props.currentGame.status === constants.avalonGameStatuses.Questing) {
            return props.currentGame.playersOnQuest.includes(player);
        }
        return props.currentGame.questNominations.includes(player);
        // eslint-disable-next-line
    }, [props.currentGame, props.auth.uid, localOnQuest, props.currentGame.questNominations, props.currentGame.playersOnQuest,
        props.currentGame.status]);

    const [hasLocalVoted, setHasLocalVoted] = useState(props.currentGame.votesFor.includes(props.auth.uid) || props.currentGame.votesAgainst.includes(props.auth.uid));

    const [hasLocalPlayed, setHasLocalPlayed] = useState(props.currentGame.questSuccesses.includes(props.auth.uid)
    || props.currentGame.questFails.includes(props.auth.uid));

    useEffect(() => {
        setHasLocalPlayed(false);
    }, [props.auth.uid, props.currentGame.round, props.currentGame.consecutiveRejections,
        setHasLocalPlayed]);

    useEffect(() => {
        setHasLocalVoted(false);
    }, [props.auth.uid, props.currentGame.leader, props.currentGame.round, setHasLocalVoted]);

    const hasPlayerVoted = useCallback(player => {
        if (player === props.auth.uid) {
            return hasLocalVoted;
        }
        return props.currentGame.votesFor.includes(player) || props.currentGame.votesAgainst.includes(player);
    }, [props.auth.uid, props.currentGame, hasLocalVoted]);

    const hasPlayedPlayedCard = useCallback(player => {
        if (player === props.auth.uid) {
            return hasLocalPlayed;
        }
        return props.currentGame.questSuccesses.includes(player) || props.currentGame.questFails.includes(player);
    }, [hasLocalPlayed, props.currentGame, props.auth.uid]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.currentGame.leader === props.auth.uid) {
                if (props.currentGame.status === constants.avalonGameStatuses.Nominating) {
                    if (!hasSentNominations) {
                        const nominationsConsistent = _.isEqual(_.sortBy(localOnQuest), _.sortBy(props.currentGame.questNominations));
                        if (!nominationsConsistent) {
                            props.realignQuestNominations(props.currentGameId, localOnQuest);
                        }
                    }
                }
            }
        }, 4000);
        return () => clearInterval(interval);

        // eslint-disable-next-line
    }, [props.currentGame.leader, props.auth.uid, props.currentGameId, localOnQuest, props.currentGame.questNominations,
        hasSentNominations]);

    const getRole = role => {
        if (role === constants.avalonRoles.RegularGood.name) {
            return 'Regular Good';
        }
        if (role === constants.avalonRoles.RegularBad.name) {
            return 'Regular Bad';
        }
        return role;
    };

    return (
        <div className={props.styles.gameStartedWrapper}>
            {props.currentGame.status === constants.avalonGameStatuses.Finished
            || props.currentGame.status === constants.avalonGameStatuses.GuessingMerlin
                ? <div className={props.styles.gameFinished}>Game finished </div> : (
                    <div className={props.styles.roundHeader}>
                        {`Round: ${props.currentGame.round}`}
                    </div>
                )}

            {props.currentGame.status !== constants.avalonGameStatuses.Finished
            && props.currentGame.status !== constants.avalonGameStatuses.GuessingMerlin && (
                <div className={props.styles.currentLeaderWrapper}>
                    {`The current leader is ${helpers.mapUserIdToName(props.users, props.currentGame.leader)}`}
                </div>
            )}

            <CurrentGameStatus
                auth={props.auth}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                hasLocalPlayed={hasLocalPlayed}
                hasLocalVoted={hasLocalVoted}
                myRole={props.myRole}
                setHasLocalVoted={setHasLocalVoted}
                setHasLocalPlayed={setHasLocalPlayed}
                users={props.users}
            />

            {props.currentGame.status === constants.avalonGameStatuses.GuessingMerlin
            && props.currentGame
                .playerToGuessMerlin === props.auth.uid && (
                <LoadingDiv isLoading={hasGuessedMerlin} isMargin isBlack isBorderRadius>
                    <div className={props.styles.guessingMerlinWrapper}>
                        <Fade
                            includeCheckbox
                            label="Guess Merlin"
                            checked={guessingMerlin}
                            onChange={toggleGuessingMerlin}
                        >
                            <Radio
                                onChange={setMerlinGuess}
                                value={merlinGuess}
                                options={props.currentGame.playerRoles
                                    .filter(r => constants.avalonRoles[r.role].isGood)
                                    .map(r => ({
                                        text: helpers.mapUserIdToName(props.users, r.player),
                                        value: r.player
                                    }))}
                            />
                            <div className={props.styles.submitMerlinGuessWrapper}>
                                <StyledButton
                                    text="Confirm Guess"
                                    onClick={makeMerlinGuess}
                                    disabled={hasGuessedMerlin}
                                />
                            </div>
                        </Fade>
                    </div>
                </LoadingDiv>
            )}

            <div className={props.styles.playerOrder}>
                {props.currentGame.currentPlayers.map((player, index) => (
                    <div
                        className={classNames({
                            [props.styles.playerWrapper]: true,
                            [props.styles.isActivePlayer]: player === props.currentGame.leader,
                            [props.styles.isOnQuest]: isPlayerOnQuest(player)
                        })}
                        role="button"
                        tabIndex={0}
                        onClick={() => nominatePlayer(player)}
                        key={player}
                    >
                        <div className={props.styles.playerNumber}>
                            <div>{`#${index + 1}`}</div>
                            {props.currentGame.leader === player
                        && <div className={props.styles.currentPresident}>(Leader)</div>}
                        </div>
                        <div className={classNames({
                            [props.styles.playerName]: true,
                            [props.styles.activePlayer]: player === props.currentGame.leader
                        })}
                        >
                            {helpers.mapUserIdToName(props.users, player)}
                            {props.auth.uid === player && ' (you)'}
                        </div>
                        {props.currentGame.status === constants.avalonGameStatuses.Voting
                        && (
                            <div className={classNames({
                                [props.styles.votingStage]: true,
                                [props.styles.haveVoted]: hasPlayerVoted(player),
                                [props.styles.notVoted]: !hasPlayerVoted(player)
                            })}
                            >
                                <FiberManualRecordIcon fontSize="small" />
                            </div>
                        )}

                        {props.currentGame.status === constants.avalonGameStatuses.Questing
                        && props.currentGame.playersOnQuest.includes(player) && (
                            <div className={classNames({
                                [props.styles.questingStage]: true,
                                [props.styles.haveVoted]: hasPlayedPlayedCard(player),
                                [props.styles.notVoted]: !hasPlayedPlayedCard(player)
                            })}
                            >
                                <FiberManualRecordIcon fontSize="small" />
                            </div>
                        )}

                    </div>
                ))}
            </div>

            {props.currentGame.leader === props.auth.uid
            && props.currentGame.status === constants.avalonGameStatuses.Nominating
            && (
                <LoadingDiv isMargin isLoading={hasSentNominations} isFitContent isRed isBorderRadius>
                    <div className={props.styles.confirmNominationWrapper}>
                        <StyledButton
                            text="Confirm Nominations"
                            onClick={submitNominations}
                            disabled={(localOnQuest.length
                            < constants.avalonRounds[props
                                .currentGame.numberOfPlayers][props.currentGame.round]) || hasSentNominations}
                        />
                    </div>
                </LoadingDiv>
            ) }

            {props.currentGame.status === constants.avalonGameStatuses.Finished && (
                <LoadingDiv isMargin isFitContent isLoading={isLeavingOrDestroyingGame} isBorderRadius>
                    <div className={props.styles.endGameWrapper}>
                        {props.currentGame.host === props.auth.uid && (
                            <div className={props.styles.destroyGameButton}>
                                <StyledButton
                                    text="Destroy Game"
                                    color="secondary"
                                    onClick={destroyGame}
                                    disabled={isLeavingOrDestroyingGame}
                                />
                            </div>
                        )}
                        <div className={props.styles.leaveGameButton}>
                            <StyledButton
                                text="Leave Game"
                                color="secondary"
                                onClick={leaveGame}
                                disabled={isLeavingOrDestroyingGame}
                            />
                        </div>
                    </div>
                </LoadingDiv>
            )}

            <div className={props.styles.toggleWrappers}>
                <div className={props.styles.switchWrapper}>
                    <div>View Role</div>
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

            <Fade
                checked={viewingRole}
            >
                <div className={props.styles.viewSecretInfoWrapper}>
                    <div className={classNames({
                        [props.styles.viewingRole]: true,
                        [props.styles.isGood]: helpers.isRoleGood(props.myRole),
                        [props.styles.isBad]: !helpers.isRoleGood(props.myRole)
                    })}
                    >
                        {`Role: ${getRole(props.myRole)}`}
                    </div>
                    {generateSecretInfo(props.myRole)}
                </div>
            </Fade>

            <div className={props.styles.viewingBoardWrapper}>
                <Fade
                    checked={viewingBoard}
                >
                    <div className={props.styles.avalonBoard}>
                        <div className={props.styles.boardState}>
                            {generateResultIcon(props.currentGame.questResult[0], 1)}
                            {generateResultIcon(props.currentGame.questResult[1], 2)}
                            {generateResultIcon(props.currentGame.questResult[2], 3)}
                            {generateResultIcon(props.currentGame.questResult[3], 4)}
                            {generateResultIcon(props.currentGame.questResult[4], 5)}
                        </div>

                        <div className={props.styles.consecutiveRejections}>
                            {`Consecutive rejections: ${props.currentGame.consecutiveRejections}`}
                            {props.currentGame.consecutiveRejections === 3
                && (
                    <div className={props.styles.noVoting}>
                        No voting will ococur next round if this is rejected
                    </div>
                )}
                            {props.currentGame.consecutiveRejections === 4
                && (
                    <div className={props.styles.noVoting}>
                        No voting will occur this round
                    </div>
                )}
                        </div>

                        {props.currentGame.numberOfPlayers >= 7 && (
                            <div className={props.styles.specialRoundMessage}>
                                The 4th mission requires 2 fails for it to fail
                            </div>
                        )}
                    </div>
                </Fade>
            </div>

            <div className={props.styles.historyWrapper}>
                <Fade
                    checked={showingHistory}
                >
                    <History
                        auth={props.auth}
                        currentGame={props.currentGame}
                        currentGameId={props.currentGameId}
                        history={fp.get('history')(props.currentGame)}
                        myRole={props.myRole}
                        users={props.users}
                    />
                </Fade>
            </div>

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

                    <LoadingDiv isLoading={props.isApprovingLeaveMidgame} isBorderRadius isBlack>
                        <div className={props.styles.endGameButtons}>
                            <StyledButton
                                text="Approve"
                                onClick={() => props.approveLeaveMidgameRequest(
                                    props.currentGameId, true
                                )}
                                disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)
                                || props.isApprovingLeaveMidgame}
                            />
                            <StyledButton
                                text="Reject"
                                color="secondary"
                                onClick={() => props.approveLeaveMidgameRequest(
                                    props.currentGameId, false
                                )}
                                disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)
                                || props.isApprovingLeaveMidgame}
                            />
                        </div>
                    </LoadingDiv>
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
        currentPlayers: [],
        consecutiveRejections: 0,
        host: '',
        leader: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        round: 0,
        playersOnQuest: [],
        playersReady: [],
        playerRoles: [],
        status: '',
        playerToGuessMerlin: '',
        questNominations: [],
        questSuccesses: [],
        questFails: [],
        votesAgainst: [],
        votesFor: [],
        questResult: [],
        requestToEndGame: '',
        rejectLeaveMidgame: []
    },
    currentGameId: '',
    isApprovingLeaveMidgame: false,
    myRole: '',
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    confirmNominationsRequest: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        approveLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        consecutiveRejections: PropTypes.number,
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        leader: PropTypes.string,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.number,
        playersOnQuest: PropTypes.arrayOf(PropTypes.string),
        playersReady: PropTypes.arrayOf(PropTypes.string),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        rejectLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string
        })),
        playerToGuessMerlin: PropTypes.string,
        requestToEndGame: PropTypes.string,
        questFails: PropTypes.arrayOf(PropTypes.string),
        questNominations: PropTypes.arrayOf(PropTypes.string),
        questSuccesses: PropTypes.arrayOf(PropTypes.string),
        questResult: PropTypes.arrayOf(PropTypes.number),
        status: PropTypes.string
    }),
    destroyGameRequest: PropTypes.func.isRequired,
    isApprovingLeaveMidgame: PropTypes.bool,
    leaveGameRequest: PropTypes.func.isRequired,
    guessMerlinRequest: PropTypes.func.isRequired,
    nominatePlayerForQuest: PropTypes.func.isRequired,
    approveLeaveMidgameRequest: PropTypes.func.isRequired,
    realignQuestNominations: PropTypes.func.isRequired,
    currentGameId: PropTypes.string,
    myRole: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    destroyGameRequest,
    confirmNominationsRequest,
    leaveGameRequest,
    guessMerlinRequest,
    nominatePlayerForQuest,
    approveLeaveMidgameRequest,
    realignQuestNominations
};

const mapStateToProps = state => ({
    isApprovingLeaveMidgame: state.game.isApprovingLeaveMidgame
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
