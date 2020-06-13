/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './CurrentGameStatus.module.scss';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import StyledButton from '../../common/StyledButton/StyledButton';
import Fade from '../../common/Fade/Fade';
import {
    giveCardsToChancellorRequest, makeVoteRequest, playChancellorCardRequest,
    initiateVetoRequest, replyToVetoRequest
} from './actions';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';

const CurrentGameStatus = props => {
    const [localVote, setLocalVote] = useState(false);

    const [confirmCardsDisabled, setConfirmCardsDisabled] = useState(false);
    const [confirmCardDisabled, setConfirmCardDisabled] = useState(false);

    const placeVote = useCallback(vote => {
        props.makeVoteRequest(props.currentGameId, vote);
        props.setHasLocalVoted(true);
        setLocalVote(vote);
        // eslint-disable-next-line
    }, [props.currentGameId, props.setHasLocalVoted, setLocalVote])

    // Done via index of currentGame.presidentCards
    const [selectedPresidentCards, setSelectedPresidentCards] = useState([]);

    const [selectedChancellorCard, setSelectedChancellorCard] = useState('');

    const [selectingVeto, setSelectingVeto] = useState(false);
    const [replyingToVeto, setReplyingToVeto] = useState(false);

    const toggleSelectingVeto = useCallback(() => {
        setSelectingVeto(!selectingVeto);
    }, [selectingVeto, setSelectingVeto]);

    const toggleReplyingToVeto = useCallback(() => {
        setReplyingToVeto(!replyingToVeto);
    }, [replyingToVeto, setReplyingToVeto]);

    const onClickChancellorCard = useCallback(card => {
        if (selectedChancellorCard === card) {
            setSelectedChancellorCard('');
        } else {
            setSelectedChancellorCard(card);
        }
    }, [selectedChancellorCard, setSelectedChancellorCard]);

    const onClickPresidentCard = useCallback(cardIndex => {
        if (!selectedPresidentCards.includes(cardIndex)) {
            if (selectedPresidentCards.length < 2) {
                setSelectedPresidentCards([...selectedPresidentCards, cardIndex]);
            }

            if (selectedPresidentCards.length === 2) {
                const { presidentCards } = props.currentGame;
                const firstValue = presidentCards[selectedPresidentCards[0]];
                const secondValue = presidentCards[selectedPresidentCards[1]];
                if (firstValue === secondValue) {
                    setSelectedPresidentCards([selectedPresidentCards[1], cardIndex]);
                } else {
                    const valueToAdd = presidentCards[cardIndex];
                    if (valueToAdd === firstValue) {
                        setSelectedPresidentCards([cardIndex, selectedPresidentCards[0]]);
                    } else {
                        setSelectedPresidentCards([cardIndex, selectedPresidentCards[1]]);
                    }
                }
            }
        } else {
            setSelectedPresidentCards(selectedPresidentCards.filter(x => x !== cardIndex));
        }
    }, [setSelectedPresidentCards, selectedPresidentCards, props.currentGame]);


    const giveCardsToChancellor = useCallback(() => {
        const { presidentCards } = props.currentGame;
        if (selectedPresidentCards.length === 2) {
            const cardOne = presidentCards[selectedPresidentCards[0]];
            const cardTwo = presidentCards[selectedPresidentCards[1]];
            props.giveCardsToChancellorRequest(props.currentGameId, [cardOne, cardTwo]);
            setConfirmCardsDisabled(true);
        }
        // eslint-disable-next-line
    }, [props.currentGame, selectedPresidentCards, setSelectedPresidentCards, setConfirmCardsDisabled]);

    const playChancellorCard = useCallback(() => {
        const { chancellorCards } = props.currentGame;
        if (selectedChancellorCard === 0 || selectedChancellorCard === 1) {
            const card = chancellorCards[selectedChancellorCard];
            props.playChancellorCardRequest(props.currentGameId, card);
            setConfirmCardDisabled(true);
        }
        // eslint-disable-next-line
    }, [props.currentGame, selectedChancellorCard, setSelectedChancellorCard, setConfirmCardDisabled])

    const makeVetoRequest = useCallback(() => {
        props.initiateVetoRequest(props.currentGameId);
        // setSelectingVeto(false);
        // eslint-disable-next-line
    }, [setSelectingVeto, props.currentGameId])

    useEffect(() => {
        if (props.auth.uid !== props.currentGame.chancellor) {
            setSelectedChancellorCard('');
            setConfirmCardsDisabled(false);
            setConfirmCardDisabled(false);
        }
    }, [props.currentGame.chancellor, setSelectedChancellorCard, props.auth.uid, setConfirmCardDisabled,
        setConfirmCardsDisabled]);


    useEffect(() => {
        setSelectedPresidentCards([]);
    }, [props.currentGame.numberFascistPlayed, props.currentGame.numberLiberalPlayed,
        setSelectedPresidentCards]);

    if (props.currentGame.status === constants.hitlerGameStatuses.Nominating) {
        return (
            <div className={props.styles.nominating}>
                {(props.currentGame.temporaryPresident || props.currentGame.president) === props.auth.uid
                    ? 'You are the President. Select a Chancellor' : `${helpers.mapUserIdToName(props.users,
                        props.currentGame.temporaryPresident || props.currentGame.president)} is currently selecting a chancellor`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.TemporaryPresident) {
        return (
            <div className={props.styles.nominating}>
                {(props.currentGame.temporaryPresident || props.currentGame.president) === props.auth.uid
                    ? 'You are the President. Select a Chancellor' : `${helpers.mapUserIdToName(props.users, props.currentGame.temporaryPresident)} is currently selecting a chancellor`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.Kill) {
        return (
            <div className={props.styles.nominating}>
                {(props.currentGame.temporaryPresident || props.currentGame.president) === props.auth.uid
                    ? 'You are the President. Kill somebody!' : `${helpers.mapUserIdToName(props.users,
                        props.currentGame.temporaryPresident || props.currentGame.president)} is currently choosing who to kill`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.PresidentDecidingCards) {
        const inPower = props.currentGame.temporaryPresident === props.auth.uid
        || (!props.currentGame.temporaryPresident
            && props.currentGame.president === props.auth.uid);

        if (!inPower) {
            return (
                <div className={props.styles.presidentDeciding}>
                    {`${helpers.mapUserIdToName(props.users, props.currentGame.temporaryPresident || props.currentGame.president)} 
                is currently selecting 2 cards to give to ${helpers.mapUserIdToName(props.users, props.currentGame.chancellor)}`}
                </div>
            );
        }
        const { presidentCards } = props.currentGame;

        return (
            <div className={props.styles.presidentDecidingWrapper}>
                <div className={props.styles.allPresidentCards}>
                    {presidentCards.map((card, index) => (
                        <div
                            className={classNames({
                                [props.styles.fascistCard]: card === -1,
                                [props.styles.liberalCard]: card === 1,
                                [props.styles.selected]: selectedPresidentCards.includes(index)
                            })}
                            role="button"
                            tabIndex={0}
                            onClick={() => onClickPresidentCard(index)}
                            key={`Card-${card}-${index}`}
                        >
                            {card === 1 ? 'Liberal' : 'Fascist'}
                        </div>
                    ))}
                </div>
                <LoadingDiv isFitContent isBorderRadius isLoading={confirmCardsDisabled} isBlack>
                    <div className={props.styles.confirmChancellorCards}>
                        <StyledButton
                            onClick={giveCardsToChancellor}
                            disabled={selectedPresidentCards.length < 2 || confirmCardsDisabled}
                            text="Confirm cards"
                        />
                    </div>
                </LoadingDiv>
            </div>
        );
    }

    const getPlayerElecting = () => {
        if (props.currentGame.temporaryPresident) {
            return helpers.mapUserIdToName(props.users, props.currentGame.temporaryPresident);
        }
        return helpers.mapUserIdToName(props.users, props.currentGame.president);
    };

    if (props.currentGame.status === constants.hitlerGameStatuses.Voting
        && !props.currentGame.deadPlayers.includes(props.auth.uid)) {
        return (
            <div className={props.styles.votingWrapper}>
                <div>
                    {`${getPlayerElecting()} is electing ${
                        helpers.mapUserIdToName(props.users, props.currentGame.chancellor)}` }
                </div>
                <div className={props.styles.votingButtons}>
                    {props.currentGame.votesAgainst.includes(props.auth.uid)
                        || props.currentGame.votesFor.includes(props.auth.uid) || props.hasLocalVoted
                        ? <StyledButton text={`Voted ${(props.currentGame.votesFor.includes(props.auth.uid) || localVote) ? 'Yes' : 'No'}`} disabled /> : (
                            <>
                                <StyledButton text="Vote Yes" onClick={() => placeVote(true)} />
                                <StyledButton text="Vote No" color="secondary" onClick={() => placeVote(false)} />
                            </>
                        )}
                </div>
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.ChancellorDecidingCards) {
        if ((props.auth.uid === props.currentGame.president && props.currentGame.numberFascistPlayed === 5)
            && (props.currentGame.requestingVeto || props.currentGame.vetoRejected)) {
            return (
                <div className={props.styles.presidentDecidingWrapper}>

                    <Fade
                        checked={replyingToVeto}
                        onChange={toggleReplyingToVeto}
                        includeCheckbox
                        label="Reply to Veto "
                    >
                        {props.currentGame.vetoRejected && <div>You have rejected this</div>}
                        <LoadingDiv isBlack isLoading={props.hasRepliedToVeto} isMargin isBorderRadius>
                            <div className={props.styles.confirmChancellorCards}>
                                <StyledButton
                                    onClick={() => props.replyToVetoRequest(props.currentGameId, true)}
                                    text="Approve Veto"
                                    disabled={props.currentGame.vetoRejected || props.hasRepliedToVeto}
                                />
                                <StyledButton
                                    onClick={() => props.replyToVetoRequest(props.currentGameId, false)}
                                    text="Reject Veto"
                                    color="secondary"
                                    disabled={props.currentGame.vetoRejected || props.hasRepliedToVeto}
                                />
                            </div>
                        </LoadingDiv>
                    </Fade>
                </div>
            );
        }

        if (props.auth.uid !== props.currentGame.chancellor) {
            return (
                <div className={props.styles.chancellorDeciding}>
                    {helpers.mapUserIdToName(props.users, props.currentGame.chancellor)
                    + (props.currentGame.requestingVeto
                        ? ' has requested to veto' : ' is currently selecting which card to play')}
                    {props.currentGame.vetoRejected && props.currentGame.numberFascistPlayed === 5
                    && (
                        <div>
                            {`${helpers.mapUserIdToName(props.users, props.currentGame.president)} rejected the request to veto`}
                        </div>
                    )}
                </div>
            );
        }
        const { chancellorCards } = props.currentGame;
        return (
            <>
                <div className={props.styles.presidentDecidingWrapper}>
                    <div className={props.styles.allPresidentCards}>
                        {chancellorCards.map((card, index) => (
                            <div
                                className={classNames({
                                    [props.styles.fascistCard]: card === -1,
                                    [props.styles.liberalCard]: card === 1,
                                    [props.styles.selected]: selectedChancellorCard === index
                                })}
                                role="button"
                                tabIndex={0}
                                onClick={() => onClickChancellorCard(index)}
                                key={`card-${card}-${index}`}
                            >
                                {card === 1 ? 'Liberal' : 'Fascist'}
                            </div>
                        ))}
                    </div>
                    <LoadingDiv isFitContent isBorderRadius isLoading={confirmCardDisabled} isBlack>
                        <div className={props.styles.confirmChancellorCards}>
                            <StyledButton
                                onClick={playChancellorCard}
                                disabled={(selectedChancellorCard !== 0
                                    && selectedChancellorCard !== 1) || confirmCardDisabled || props.currentGame.requestingVeto}
                                text="Confirm card"
                            />
                        </div>
                    </LoadingDiv>
                </div>
                {props.currentGame.numberFascistPlayed === 5
                && !props.currentGame.vetoRejected && (
                    <div className={props.styles.presidentDecidingWrapper}>
                        <Fade
                            checked={selectingVeto}
                            onChange={toggleSelectingVeto}
                            includeCheckbox
                            label="Veto Power"
                        >
                            <LoadingDiv isLoading={props.hasRequestedVeto} isFitContent isBlack isBorderRadius>
                                <div className={props.styles.confirmChancellorCards}>
                                    <StyledButton
                                        onClick={makeVetoRequest}
                                        text="Request Veto"
                                        disabled={props.currentGame.requestingVeto}
                                    />
                                </div>
                            </LoadingDiv>
                        </Fade>
                    </div>
                )}
            </>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.Investigate) {
        return (
            <div className={props.styles.investigating}>
                {props.currentGame.president === props.auth.uid ? 'Select a player to investigate' : `${helpers.mapUserIdToName(props.users, props.currentGame.president)} 
                is currently selecting whose identity card to look at`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.Transfer) {
        return (
            <div className={props.styles.investigating}>
                {props.currentGame.president === props.auth.uid ? 'Select a player to make president' : `${helpers.mapUserIdToName(props.users, props.currentGame.president)} 
                is currently selecting who to make a temporary President`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.Finished) {
        return (
            <div className={props.styles.gameEnded}>

                {props.currentGame.hitlerKilled && (
                    <div className={props.styles.goodGuysWon}>
                        The good guys won by killing Hitler
                    </div>
                )}

                {props.currentGame.numberFascistPlayed === 6 && (
                    <div className={props.styles.badGuysWon}>
                        The bad guys won by playing 6 fascist cards
                    </div>
                )}

                {props.currentGame.numberLiberalPlayed === 5 && (
                    <div className={props.styles.goodGuysWon}>
                        The good guys won by playing 5 liberal cards
                    </div>
                )}

                {props.currentGame.hitlerElected && (
                    <div className={props.styles.badGuysWon}>
                        The fascists won by Hitler becoming chancellor
                    </div>
                )}

                <div className={props.styles.allRolesWrapper}>
                    {props.currentGame.playerRoles.map(r => (
                        <div key={`${r.player}-${r.role}`}>
                            {`${helpers.mapUserIdToName(props.users, r.player)} was ${r.role}`}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (props.currentGame.deadPlayers.includes(props.auth.uid)) {
        return (
            <div className={props.styles.investigating}>
                You are dead
            </div>
        );
    }

    return (
        <div className={props.styles.currentGameStatus}>
            Unknown game status. Contact Matt
        </div>
    );
};

CurrentGameStatus.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        chancellor: '',
        chancellorCards: [],
        currentPlayers: [],
        deadPlayers: [],
        hitlerElected: false,
        hitlerKilled: false,
        host: '',
        president: '',
        mode: '',
        numberOfPlayers: 0,
        numberFascistPlayed: 0,
        numberLiberalPlayed: 0,
        roles: [],
        round: 0,
        playersReady: [],
        playerToGuessMerlin: '',
        playersOnQuest: [],
        playerRoles: [],
        presidentCards: [],
        status: '',
        requestingVeto: false,
        temporaryPresident: '',
        votesAgainst: [],
        votesFor: [],
        vetoRejected: false
    },
    currentGameId: '',
    hasRequestedVeto: false,
    hasRepliedToVeto: false,
    hasLocalVoted: false,
    setHasLocalVoted: noop,
    styles: defaultStyles,
    users: {}
};

CurrentGameStatus.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        chancellor: PropTypes.string,
        chancellorCards: PropTypes.arrayOf(PropTypes.number),
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        deadPlayers: PropTypes.arrayOf(PropTypes.string),
        hitlerElected: PropTypes.bool,
        hitlerKilled: PropTypes.bool,
        host: PropTypes.string,
        president: PropTypes.string,
        mode: PropTypes.string,
        numberFascistPlayed: PropTypes.number,
        numberLiberalPlayed: PropTypes.number,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.number,
        requestingVeto: PropTypes.bool,
        playerToGuessMerlin: PropTypes.string,
        presidentCards: PropTypes.arrayOf(PropTypes.number),
        playersReady: PropTypes.arrayOf(PropTypes.string),
        playersOnQuest: PropTypes.arrayOf(PropTypes.string),
        playerRoles: PropTypes.arrayOf(PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string
        })),
        votesFor: PropTypes.arrayOf(PropTypes.string),
        votesAgainst: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
        temporaryPresident: PropTypes.string,
        vetoRejected: PropTypes.bool
    }),
    currentGameId: PropTypes.string,
    hasRequestedVeto: PropTypes.bool,
    hasRepliedToVeto: PropTypes.bool,
    giveCardsToChancellorRequest: PropTypes.func.isRequired,
    hasLocalVoted: PropTypes.bool,
    initiateVetoRequest: PropTypes.func.isRequired,
    makeVoteRequest: PropTypes.func.isRequired,
    replyToVetoRequest: PropTypes.func.isRequired,
    playChancellorCardRequest: PropTypes.func.isRequired,
    setHasLocalVoted: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    initiateVetoRequest,
    giveCardsToChancellorRequest,
    makeVoteRequest,
    playChancellorCardRequest,
    replyToVetoRequest
};

const mapStateToProps = state => ({
    hasRequestedVeto: state.hitler.hasRequestedVeto,
    hasRepliedToVeto: state.hitler.hasRepliedToVeto
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentGameStatus);

export { CurrentGameStatus as CurrentGameStatusUnconnected };
