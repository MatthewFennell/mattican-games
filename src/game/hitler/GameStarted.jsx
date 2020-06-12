/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import fp from 'lodash/fp';
import SearchIcon from '@material-ui/icons/Search';
import defaultStyles from './GameStarted.module.scss';
import Fade from '../../common/Fade/Fade';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import CurrentGameStatus from './CurrentGameStatus';
import {
    leaveGameRequest,
    destroyGameRequest, approveLeaveMidgameRequest,
    gameError
} from '../actions';
import StyledButton from '../../common/StyledButton/StyledButton';
import Switch from '../../common/Switch/Switch';
import HitlerBoard from './HitlerBoard';
import Skull from './Skull.png';
import Bullet from './bullet.png';
import History from './History';
import Modals from './Modals';
import {
    nominateChancellorRequest, confirmChancellorRequest, selectInvestigateRequest,
    confirmInvesigationRequest, makeTemporaryPresidentRequest, confirmPresidentRequest,
    killPlayerRequest, confirmKillPlayerRequest, closeLookAtTopThreeRequest, closeLookAtInvestigationRequest
} from './actions';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';

const playerIsBad = (player, roles) => {
    const role = fp.get('role')(roles.find(x => x.player === player));
    return role !== constants.hitlerRoles.Liberal;
};

const GameStarted = props => {
    const {
        ChancellorDecidingCards,
        Finished,
        Nominating,
        PresidentDecidingCards,
        Voting,
        Investigate,
        Transfer,
        TemporaryPresident,
        Peek,
        Kill
    } = constants.hitlerGameStatuses;

    const [viewingRole, setViewingRole] = useState(false);
    const [viewingBoard, setViewingBoard] = useState(false);
    const [showingHistory, setShowingHistory] = useState(false);

    const [hasLocalVoted, setHasLocalVoted] = useState(props.currentGame.votesFor.includes(props.auth.uid) || props.currentGame.votesAgainst.includes(props.auth.uid));
    const [localPlayerToKill, setLocalPlayerToKill] = useState(props.currentGame.playerToKill);
    const [localInvestigate, setLocalInvestigate] = useState(props.currentGame.playerToInvestigate);
    const [localTempPresident, setLocalTempPresident] = useState(props.currentGame.temporaryPresident);
    const [localChancellor, setLocalChancellor] = useState(props.currentGame.chancellor);
    const [hasConfirmedNominations, setHasConfirmedNominations] = useState(false);
    const [hasKilledPlayer, setHasKilledPlayer] = useState(false);
    const [hasLeftOrDestroyedGame, setHasLeftOrDestroyedGame] = useState(false);
    const [hasInvestigated, setHasInvestigated] = useState(false);
    const [hasConfirmedPresident, setHasConfirmedPresident] = useState(false);

    const destroyGame = useCallback(() => {
        setHasLeftOrDestroyedGame(true);
        props.destroyGameRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [setHasLeftOrDestroyedGame, props.currentGameId])

    const confirmPresident = useCallback(() => {
        setHasConfirmedPresident(true);
        props.confirmPresidentRequest(props.currentGameId, localTempPresident);
        // eslint-disable-next-line
    }, [setHasConfirmedPresident, props.currentGameId, localTempPresident]);

    const confirmInvestigation = useCallback(() => {
        setHasInvestigated(true);
        props.confirmInvesigationRequest(props.currentGameId, localInvestigate);
        // eslint-disable-next-line
    }, [props.currentGameId, setHasInvestigated, localInvestigate])

    const leaveGame = useCallback(() => {
        setHasLeftOrDestroyedGame(true);
        props.leaveGameRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [setHasLeftOrDestroyedGame, props.currentGameId])

    const hasPlayerVoted = useCallback(player => {
        if (player === props.auth.uid) {
            return hasLocalVoted;
        }
        return props.currentGame.votesFor.includes(player) || props.currentGame.votesAgainst.includes(player);
    }, [props.auth.uid, props.currentGame, hasLocalVoted]);

    const shouldShowChancellor = useCallback(player => {
        if (props.currentGame.temporaryPresident === props.auth.uid || (props.currentGame.president === props.auth.uid
            && !props.currentGame.temporaryPresident)) {
            return player === localChancellor;
        }
        return props.currentGame.chancellor === player;
    }, [props.auth.uid, props.currentGame.chancellor, localChancellor,
        props.currentGame.president, props.currentGame.temporaryPresident]);


    const submitNominations = useCallback(() => {
        props.confirmChancellorRequest(props.currentGameId, localChancellor);
        setHasConfirmedNominations(true);
        // eslint-disable-next-line
    }, [props.currentGame, localChancellor, setHasConfirmedNominations])

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
            if (info.type === Peek) {
                const { cards } = info;
                return (
                    <div className={props.styles.peekInfo}>
                        <div>The top 3 cards you saw were</div>
                        <div className={props.styles.topThreeCards}>

                            {cards.map((card, index) => (
                                <div
                                    className={classNames({
                                        [props.styles.isLiberal]: card === 1,
                                        [props.styles.isFascist]: card === -1
                                    })}
                                    key={`card-${card}-${index}`}
                                >
                                    {card === 1 ? 'L' : 'F'}
                                </div>
                            ))}

                        </div>
                    </div>
                );
            }
        }
        return null;
    };

    const isPresident = player => {
        if (props.currentGame.temporaryPresident) {
            return player === props.currentGame.temporaryPresident;
        }
        return props.currentGame.president === player;
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
                const fascist = fp.get('player')(props.currentGame.playerRoles
                    .find(x => x.role === constants.hitlerRoles.Fascist && x.player !== props.auth.uid));

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

    const canNominatePlayer = player => {
        const numberOfDeadPlayers = props.currentGame.deadPlayers.length;
        const remainingPlayers = props.currentGame.numberOfPlayers - numberOfDeadPlayers;

        if (player === props.auth.uid) {
            return false;
        }

        if (remainingPlayers <= 5) {
            if (props.currentGame.previousChancellor === player) {
                return false;
            }
            return true;
        }
        if (props.currentGame.previousChancellor === player
            || props.currentGame.previousPresident === player) {
            return false;
        }
        return true;
    };

    const nominatePlayer = useCallback(player => {
        if (props.currentGame.status === Nominating) {
            if (props.currentGame.president === props.auth.uid) {
                if (props.currentGame.deadPlayers.includes(player)) {
                    props.gameError({
                        code: 'invalid-nomination',
                        message: 'Can\'t nominate dead players'
                    }, 'Nominate error');
                } else if (!canNominatePlayer(player)) {
                    props.gameError({
                        code: 'invalid-nomination',
                        message: 'Invalid nomination target'
                    }, 'Nominate error');
                } else {
                    props.nominateChancellorRequest(props.currentGameId, player);
                    setLocalChancellor(player);
                }
            }
        }
        if (props.currentGame.status === Investigate) {
            if (props.currentGame.president === props.auth.uid) {
                if (props.currentGame.playerInvestigated === player) {
                    props.gameError({
                        code: 'already-investigated',
                        message: 'That player has already been investigated. Not allowed twice'
                    }, 'Investigation error');
                } else if (player === props.auth.uid) {
                    props.gameError({
                        code: 'already-investigated',
                        message: 'You cannot investigate yourself'
                    }, 'Investigation error');
                } else {
                    setLocalInvestigate(player);
                    props.selectInvestigateRequest(props.currentGameId, player);
                }
            }
        }
        if (props.currentGame.status === Transfer) {
            if (props.currentGame.president === props.auth.uid) {
                if (player === props.auth.uid) {
                    props.gameError({
                        code: 'invalid-target',
                        message: 'You cannot nominate yourself'
                    }, 'Transfer Presidency error');
                } else {
                    setLocalTempPresident(player);
                    props.makeTemporaryPresidentRequest(props.currentGameId, player);
                }
            }
        }
        if (props.currentGame.status === TemporaryPresident) {
            if (props.currentGame.temporaryPresident === props.auth.uid) {
                if (canNominatePlayer(player)) {
                    setLocalChancellor(player);
                    props.nominateChancellorRequest(props.currentGameId, player);
                } else {
                    props.gameError({
                        code: 'invalid-nomination',
                        message: 'Invalid nomination target'
                    }, 'Nominate error');
                }
            }
        }
        if (props.currentGame.status === Kill) {
            if ((!props.currentGame.temporaryPresident && props.currentGame.president === props.auth.uid)
            || (props.currentGame.temporaryPresident === props.auth.uid)) {
                if (props.currentGame.deadPlayers.includes(player)) {
                    props.gameError({
                        code: 'bullying',
                        message: 'That player is already dead'
                    }, 'Killing error');
                } else if (player === props.auth.uid) {
                    props.gameError({
                        code: 'no-suicidal-thoughts',
                        message: 'You can\'t kill yourself'
                    }, 'Killing error');
                } else {
                    setLocalPlayerToKill(player);
                    props.killPlayerRequest(props.currentGameId, player);
                }
            }
        }
        // eslint-disable-next-line
    }, [props.currentGame, props.auth.uid, setLocalPlayerToKill, setLocalInvestigate, setLocalTempPresident]);   

    const isPlayerToKill = useCallback(player => {
        if (props.currentGame.temporaryPresident === props.auth.uid) {
            return localPlayerToKill === player;
        } if (props.currentGame.president === props.auth.uid && !props.currentGame.temporaryPresident) {
            return localPlayerToKill === player;
        }
        return props.currentGame.playerToKill === player;
    }, [props.currentGame.temporaryPresident, props.currentGame.president, props.auth.uid,
        localPlayerToKill, props.currentGame.playerToKill]);

    const isPlayerToInvestigate = useCallback(player => {
        if (props.currentGame.president === props.auth.uid) {
            return localInvestigate === player;
        }
        return props.currentGame.playerToInvestigate === player;
    }, [props.currentGame.president, localInvestigate, props.auth.uid, props.currentGame.playerToInvestigate]);

    const isTemporaryPresident = useCallback(player => {
        if (props.currentGame.president === props.auth.uid && props.currentGame.status === Transfer) {
            return localTempPresident === player;
        }
        return props.currentGame.temporaryPresident === player;
    }, [props.currentGame.president, props.auth.uid, localTempPresident, props.currentGame.temporaryPresident,
        props.currentGame.status, Transfer]);

    useEffect(() => {
        setHasLocalVoted(false);
    }, [props.auth.uid, props.currentGame.president, props.currentGame.round, setHasLocalVoted]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.currentGame.status === constants.hitlerGameStatuses.Kill) {
                if (isPresident(props.auth.uid)) {
                    if (props.currentGame.playerToKill !== localPlayerToKill) {
                        props.killPlayerRequest(props.currentGameId, localPlayerToKill);
                    }
                }
            } else {
                setLocalPlayerToKill('');
                setHasKilledPlayer(false);
            }
        }, 5000);
        return () => clearInterval(interval);


        // eslint-disable-next-line
    }, [props.currentGame.temporaryPresident, props.currentGame.president, props.auth.uid, localPlayerToKill,
        props.currentGame.status, isPresident, props.currentGameId, setLocalPlayerToKill, setHasKilledPlayer]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (props.currentGame.status === constants.hitlerGameStatuses.Investigate) {
                if (isPresident(props.auth.uid)) {
                    if (props.currentGame.playerToInvestigate !== localInvestigate) {
                        props.selectInvestigateRequest(props.currentGameId, localInvestigate);
                    }
                }
            } else {
                setLocalInvestigate('');
                setHasInvestigated(false);
            }
        }, 5000);
        return () => clearInterval(interval);


        // eslint-disable-next-line
        }, [props.currentGame.temporaryPresident, props.currentGame.president, props.auth.uid, localInvestigate,
        props.currentGame.status, isPresident, props.currentGameId, setLocalInvestigate,
        setHasInvestigated]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (props.currentGame.status === TemporaryPresident) {
                if (props.currentGame.temporaryPresident === props.auth.uid && localChancellor) {
                    if (canNominatePlayer(localChancellor)) {
                        props.nominateChancellorRequest(props.currentGameId, localChancellor);
                    }
                }
            }
            if (props.currentGame.status === Nominating) {
                if (props.currentGame.president === props.auth.uid && localChancellor) {
                    if (props.currentGame.chancellor !== localChancellor) {
                        if (canNominatePlayer(localChancellor)) {
                            props.nominateChancellorRequest(props.currentGameId, localChancellor);
                        }
                    }
                }
            }
        }, 5000);
        return () => clearInterval(interval);

        // eslint-disable-next-line
    }, [props.currentGame, Nominating, TemporaryPresident, localChancellor, props.auth.uid, props.currentGameId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.currentGame.status === Transfer) {
                if (isPresident(props.auth.uid)) {
                    if (props.currentGame.temporaryPresident !== localTempPresident) {
                        props.makeTemporaryPresidentRequest(props.currentGameId, localTempPresident);
                    }
                }
            } else {
                setLocalTempPresident('');
            }
        }, 5000);
        return () => clearInterval(interval);


        // eslint-disable-next-line
        }, [props.currentGame.temporaryPresident, props.currentGame.president, props.auth.uid, localTempPresident,
        props.currentGame.status, isPresident, props.currentGameId, setLocalTempPresident]);

    useEffect(() => {
        if (props.auth.uid !== props.currentGame.president) {
            setLocalChancellor('');
            setHasConfirmedNominations(false);
        }
    }, [props.currentGame.president, props.currentGame.temporaryPresident, props.auth.uid,
        setHasConfirmedNominations]);

    useEffect(() => {
        setLocalChancellor('');
        setHasConfirmedNominations(false);
    }, [props.currentGame.numberFascistPlayed, props.currentGame.numberLiberalPlayed,
        setLocalChancellor, setHasConfirmedNominations]);

    const confirmKillPlayer = useCallback(() => {
        props.confirmKillPlayerRequest(props.currentGameId, localPlayerToKill);
        setHasKilledPlayer(true);
        // eslint-disable-next-line
    }, [props.auth.uid, props.currentGameId, localPlayerToKill, setHasKilledPlayer]);

    return (
        <>
            <div className={props.styles.gameStartedWrapper}>
                {props.currentGame.status === Finished
                    ? <div className={props.styles.gameFinished}>Game finished </div> : (
                        <div className={props.styles.roundHeader}>
                            {`Round: ${props.currentGame.round}`}
                        </div>
                    )}
                <CurrentGameStatus
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    hasLocalVoted={hasLocalVoted}
                    setHasLocalVoted={setHasLocalVoted}
                    users={props.users}
                />

                <div className={props.styles.playerOrder}>
                    {props.currentGame.currentPlayers.map((player, index) => (
                        <div
                            className={classNames({
                                [props.styles.playerWrapper]: true,
                                [props.styles.nominatedChancellor]: (shouldShowChancellor(player) && props.currentGame.status
                                === Nominating) || (shouldShowChancellor(player)
                                    && props.currentGame.status === Voting)
                                    || (shouldShowChancellor(player)
                                        && props.currentGame.status === TemporaryPresident),
                                [props.styles.isActivePlayer]: (player === props.currentGame.president
                            && !props.currentGame.temporaryPresident)
                             || (isTemporaryPresident(player)),
                                [props.styles.activeChancellor]: (props.currentGame.status
                                === PresidentDecidingCards
                                || props.currentGame.status === ChancellorDecidingCards)
                                && props.currentGame.chancellor === player,
                                [props.styles.potentialInvestigation]: props.currentGame.status
                            === Investigate
                            && isPlayerToInvestigate(player),
                                [props.styles.potentialTempPres]: props.currentGame.status
                            === Transfer
                            && isTemporaryPresident(player),
                                [props.styles.potentialKill]: props.currentGame.status
                            === Kill && isPlayerToKill(player),
                                [props.styles.deadPlayer]: props.currentGame
                                    .deadPlayers.includes(player),
                                [props.styles.fascistRevealed]: props.currentGame.status === constants.hitlerGameStatuses.Finished
                            && playerIsBad(player, props.currentGame.playerRoles)
                            })}
                            role="button"
                            tabIndex={0}
                            onClick={() => nominatePlayer(player)}
                            key={player}
                        >
                            <div className={props.styles.playerNumber}>
                                <div>{`#${index + 1}`}</div>
                                {((props.currentGame.president === player
                            && !props.currentGame.temporaryPresident)
                            || (props.currentGame.president === player
                                && props.currentGame.status === Transfer))
                            && <div className={props.styles.currentPresident}>(President)</div>}
                                {shouldShowChancellor(player)
                            && <div className={props.styles.currentChancellor}>(Chancellor)</div>}
                                {props.currentGame.temporaryPresident === player
                            && props.currentGame.temporaryPresident
                            && props.currentGame.status !== Transfer
                            && <div className={props.styles.currentPresident}>(Pres)</div>}
                            </div>
                            <div className={classNames({
                                [props.styles.playerName]: true,
                                [props.styles.activePlayer]: (player === props.currentGame.president && !props.currentGame.temporaryPresident)
                             || (isTemporaryPresident(player))
                            })}
                            >
                                {helpers.mapUserIdToName(props.users, player)}
                                {props.auth.uid === player && ' (you)'}
                            </div>
                            {props.currentGame.status === Voting && !props.currentGame.deadPlayers
                                .includes(player)
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

                            {props.currentGame.deadPlayers.includes(player) && (
                                <img src={Skull} className={props.styles.skullImage} alt="Skull" />
                            )}

                            {isPlayerToKill(player) && (
                                <img src={Bullet} className={props.styles.tempBullet} alt="Bullet" />
                            )}

                            {isPlayerToInvestigate(player) && (
                                <div className={props.styles.temporarySearch}>
                                    <SearchIcon />
                                </div>
                            )}

                            {props.currentGame.status
                            === Transfer
                            && isTemporaryPresident(player) && (
                                <div className={props.styles.temporarySearch}>
                                    <StarHalfIcon />
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
                <LoadingDiv isLoading={hasConfirmedNominations} isFitContent isBorderRadius isRed isMargin>
                    <div className={props.styles.confirmNominationWrapper}>
                        <StyledButton
                            text="Confirm Nomination"
                            onClick={submitNominations}
                            disabled={!localChancellor || hasConfirmedNominations}
                        />
                    </div>
                </LoadingDiv>
            ) }

                {props.currentGame.president === props.auth.uid
            && props.currentGame.status === Transfer
            && (
                <LoadingDiv isRed isMargin isFitContent isLoading={hasConfirmedPresident} isBorderRadius>
                    <div className={props.styles.confirmNominationWrapper}>
                        <StyledButton
                            text="Confirm President"
                            onClick={confirmPresident}
                            disabled={!localTempPresident || hasConfirmedPresident}
                        />
                    </div>
                </LoadingDiv>
            ) }

                {props.currentGame.president === props.auth.uid
            && props.currentGame.status === Investigate
            && (
                <LoadingDiv isLoading={hasInvestigated} isMargin isFitContent isRed isBorderRadius>
                    <div className={props.styles.confirmNominationWrapper}>
                        <StyledButton
                            text="Confirm Investigation"
                            onClick={confirmInvestigation}
                            disabled={!localInvestigate || hasInvestigated}
                        />
                    </div>
                </LoadingDiv>
            ) }

                {((props.currentGame.president === props.auth.uid
            && props.currentGame.status === Kill && !props.currentGame.temporaryPresident)
            || (props.currentGame.temporaryPresident === props.auth.uid && props.currentGame.status === Kill))
            && (
                <LoadingDiv isLoading={hasKilledPlayer} isMargin isFitContent isRed isBorderRadius>
                    <div className={props.styles.confirmNominationWrapper}>
                        <StyledButton
                            text="Confirm Kill"
                            onClick={confirmKillPlayer}
                            disabled={!localPlayerToKill || hasKilledPlayer}
                        />
                    </div>
                </LoadingDiv>
            ) }

                {props.currentGame.status === Finished && (
                    <LoadingDiv isLoading={hasLeftOrDestroyedGame} isMargin isBorderRadius>
                        <div className={props.styles.endGameButtons}>
                            {props.currentGame.host === props.auth.uid && (
                                <div className={props.styles.destroyGameButton}>
                                    <StyledButton
                                        text="Destroy Game"
                                        color="secondary"
                                        onClick={destroyGame}
                                        disabled={hasLeftOrDestroyedGame}
                                    />
                                </div>
                            )}
                            <div className={props.styles.leaveGameButton}>
                                <StyledButton
                                    text="Leave Game"
                                    color="secondary"
                                    onClick={leaveGame}
                                    disabled={hasLeftOrDestroyedGame}
                                />
                            </div>
                        </div>
                    </LoadingDiv>
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


                <Fade
                    checked={viewingRole}
                >
                    <div className={props.styles.viewSecretInfoWrapper}>
                        <div className={classNames({
                            [props.styles.isGood]: props.myRole === constants.hitlerRoles.Liberal,
                            [props.styles.isBad]: props.myRole !== constants.hitlerRoles.Liberal
                        })}
                        >
                            {`Role: ${props.myRole}`}
                        </div>
                        {generateSecretInfo(props.myRole)}
                        {generateHiddenInfo()}
                    </div>
                </Fade>


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
                            {props.currentGame.previousPresident && (
                                <div className={props.styles.consecutiveRejections}>
                                    {`Previous president: ${helpers.mapUserIdToName(props.users,
                                        props.currentGame.previousPresident)}`}
                                </div>
                            )}
                            {props.currentGame.previousChancellor && (
                                <div className={props.styles.consecutiveRejections}>
                                    {`Previous chancellor: ${helpers.mapUserIdToName(props.users,
                                        props.currentGame.previousChancellor)}`}
                                </div>
                            )}
                            <div className={props.styles.consecutiveRejections}>
                                {`Consecutive rejections: ${props.currentGame.consecutiveRejections}`}
                            </div>
                            <div className={props.styles.consecutiveRejections}>
                                {props.currentGame.cardDeck.length === 1 ? 'Draw deck: 1 card' : `Draw deck: ${props.currentGame.cardDeck.length} cards`}
                            </div>
                            <div className={props.styles.consecutiveRejections}>
                                {props.currentGame.discardPile.length === 1 ? 'Discard deck: 1 card' : `Discard deck: ${props.currentGame.discardPile.length} cards`}
                            </div>
                        </div>
                    </Fade>
                </div>

                <div className={props.styles.historyWrapper}>
                    <Fade
                        checked={showingHistory}
                    >
                        <History users={props.users} history={props.currentGame.history} />
                    </Fade>
                </div>
            </div>
            <Modals
                approveLeaveMidgameRequest={props.approveLeaveMidgameRequest}
                auth={props.auth}
                closeLookAtTopThreeRequest={props.closeLookAtTopThreeRequest}
                closeLookAtInvestigationRequest={props.closeLookAtInvestigationRequest}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                haveClosedPeekModal={props.haveClosedPeekModal}
                haveClosedFirstInvestigation={props.haveClosedFirstInvestigation}
                haveClosedSecondInvestigation={props.haveClosedSecondInvestigation}
                users={props.users}
            />
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        approveLeaveMidgame: [],
        cardDeck: [],
        chancellor: '',
        currentPlayers: [],
        deadPlayers: [],
        discardPile: [],
        consecutiveRejections: 0,
        hiddenInfo: [],
        history: [],
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
        previousChancellor: '',
        peakingAtTopThree: {
            player: '',
            cards: []
        },
        playerToKill: '',
        previousPresident: '',
        playerInvestigated: '',
        votesAgainst: [],
        votesFor: [],
        requestToEndGame: '',
        rejectLeaveMidgame: []
    },
    currentGameId: '',
    haveClosedPeekModal: false,
    haveClosedFirstInvestigation: false,
    haveClosedSecondInvestigation: false,
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
        cardDeck: PropTypes.arrayOf(PropTypes.number),
        discardPile: PropTypes.arrayOf(PropTypes.number),
        chancellor: PropTypes.string,
        consecutiveRejections: PropTypes.number,
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        deadPlayers: PropTypes.arrayOf(PropTypes.string),
        hiddenInfo: PropTypes.arrayOf(PropTypes.shape({
            president: PropTypes.string,
            type: PropTypes.string
        })),
        host: PropTypes.string,
        president: PropTypes.string,
        mode: PropTypes.string,
        history: PropTypes.arrayOf(PropTypes.shape({})),
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
        peakingAtTopThree: PropTypes.shape({
            player: PropTypes.string,
            cards: PropTypes.arrayOf(PropTypes.number)
        }),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        rejectLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        requestToEndGame: PropTypes.string,
        previousChancellor: PropTypes.string,
        playerToKill: PropTypes.string,
        previousPresident: PropTypes.string,
        playerInvestigated: PropTypes.string,
        status: PropTypes.string,
        temporaryPresident: PropTypes.string
    }),
    confirmInvesigationRequest: PropTypes.func.isRequired,
    closeLookAtInvestigationRequest: PropTypes.func.isRequired,
    destroyGameRequest: PropTypes.func.isRequired,
    gameError: PropTypes.func.isRequired,
    haveClosedPeekModal: PropTypes.bool,
    haveClosedFirstInvestigation: PropTypes.bool,
    haveClosedSecondInvestigation: PropTypes.bool,
    leaveGameRequest: PropTypes.func.isRequired,
    nominateChancellorRequest: PropTypes.func.isRequired,
    closeLookAtTopThreeRequest: PropTypes.func.isRequired,
    makeTemporaryPresidentRequest: PropTypes.func.isRequired,
    approveLeaveMidgameRequest: PropTypes.func.isRequired,
    confirmPresidentRequest: PropTypes.func.isRequired,
    confirmKillPlayerRequest: PropTypes.func.isRequired,
    selectInvestigateRequest: PropTypes.func.isRequired,
    killPlayerRequest: PropTypes.func.isRequired,
    currentGameId: PropTypes.string,
    myRole: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    gameError,
    confirmInvesigationRequest,
    destroyGameRequest,
    confirmChancellorRequest,
    leaveGameRequest,
    nominateChancellorRequest,
    approveLeaveMidgameRequest,
    selectInvestigateRequest,
    makeTemporaryPresidentRequest,
    confirmPresidentRequest,
    killPlayerRequest,
    confirmKillPlayerRequest,
    closeLookAtTopThreeRequest,
    closeLookAtInvestigationRequest
};

const mapStateToProps = state => ({
    haveClosedPeekModal: state.avalon.haveClosedPeekModal,
    haveClosedFirstInvestigation: state.avalon.haveClosedFirstInvestigation,
    haveClosedSecondInvestigation: state.avalon.haveClosedSecondInvestigation
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
