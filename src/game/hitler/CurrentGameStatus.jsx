import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import defaultStyles from './CurrentGameStatus.module.scss';
import * as selectors from '../selectors';
import * as helpers from '../helpers';
import * as constants from '../../constants';
import StyledButton from '../../common/StyledButton/StyledButton';
import Fade from '../../common/Fade/Fade';
import {
    makeHitlerVoteRequest, makeQuestRequest, giveCardsToChancellorRequest, playChancellorCardRequest
} from '../actions';
// import GameFinished from './GameFinished';

const CurrentGameStatus = props => {
    const [makingVote, setMakingVote] = useState(false);
    const toggleMakingVote = useCallback(() => {
        setMakingVote(!makingVote);
    }, [makingVote, setMakingVote]);

    const placeVote = useCallback(vote => {
        props.makeHitlerVoteRequest(props.currentGameId, vote);
        setMakingVote(false);
        // eslint-disable-next-line
    }, [props.currentGameId])

    // Done via index of currentGame.presidentCards
    const [selectedPresidentCards, setSelectedPresidentCards] = useState([]);

    const [selectedChancellorCard, setSelectedChancellorCard] = useState('');
    const [selectingChancellorCard, setSelectingChancellorCard] = useState(false);

    const toggleChancellorSelectingCards = useCallback(() => {
        setSelectingChancellorCard(!selectingChancellorCard);
    }, [selectingChancellorCard, setSelectingChancellorCard]);

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


    const [selectingPresidentCards, setSelectingPresidentCards] = useState(false);
    const toggleSelectingPresident = useCallback(() => {
        setSelectingPresidentCards(!selectingPresidentCards);
    }, [selectingPresidentCards, setSelectingPresidentCards]);

    const giveCardsToChancellor = useCallback(() => {
        const { presidentCards } = props.currentGame;
        if (selectedPresidentCards.length === 2) {
            const cardOne = presidentCards[selectedPresidentCards[0]];
            const cardTwo = presidentCards[selectedPresidentCards[1]];
            props.giveCardsToChancellorRequest(props.currentGameId, [cardOne, cardTwo]);
        }
        // eslint-disable-next-line
    }, [props.currentGame, selectedPresidentCards]);

    const playChancellorCard = useCallback(() => {
        const { chancellorCards } = props.currentGame;
        if (selectedChancellorCard === 0 || selectedChancellorCard === 1) {
            const card = chancellorCards[selectedChancellorCard];
            props.playChancellorCardRequest(props.currentGameId, card);
        }
        // eslint-disable-next-line
    }, [props.currentGame, selectedChancellorCard])


    if (props.currentGame.status === constants.hitlerGameStatuses.Nominating) {
        return (
            <div className={props.styles.nominating}>
                {`${helpers.mapUserIdToName(props.users, props.currentGame.president)} is currently selecting a chancellor`}
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.PresidentDecidingCards) {
        if (props.auth.uid !== props.currentGame.president) {
            return (
                <div className={props.styles.presidentDeciding}>
                    {`${helpers.mapUserIdToName(props.users, props.currentGame.president)} 
                is currently selecting 2 cards to give to ${helpers.mapUserIdToName(props.users, props.currentGame.chancellor)}`}
                </div>
            );
        }
        const { presidentCards } = props.currentGame;

        return (
            <div className={props.styles.presidentDecidingWrapper}>
                <Fade
                    checked={selectingPresidentCards}
                    onChange={toggleSelectingPresident}
                    includeCheckbox
                    label="Select cards"
                >
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
                            >
                                {card === 1 ? 'Liberal' : 'Fascist'}
                            </div>
                        ))}
                    </div>
                    <div className={props.styles.confirmChancellorCards}>
                        <StyledButton
                            onClick={giveCardsToChancellor}
                            disabled={selectedPresidentCards.length < 2}
                            text="Confirm cards"
                        />
                    </div>
                </Fade>
            </div>
        );
    }

    if (props.currentGame.status === constants.hitlerGameStatuses.Voting) {
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

    if (props.currentGame.status === constants.hitlerGameStatuses.ChancellorDecidingCards) {
        if (props.auth.uid !== props.currentGame.chancellor) {
            return (
                <div className={props.styles.chancellorDeciding}>
                    {`${helpers.mapUserIdToName(props.users, props.currentGame.chancellor)} 
                is currently selecting which card to play`}
                </div>
            );
        }
        const { chancellorCards } = props.currentGame;
        return (
            <div className={props.styles.presidentDecidingWrapper}>
                <Fade
                    checked={selectingChancellorCard}
                    onChange={toggleChancellorSelectingCards}
                    includeCheckbox
                    label="Select cards"
                >
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
                            >
                                {card === 1 ? 'Liberal' : 'Fascist'}
                            </div>
                        ))}
                    </div>
                    <div className={props.styles.confirmChancellorCards}>
                        <StyledButton
                            onClick={playChancellorCard}
                            disabled={selectedChancellorCard !== 0 && selectedChancellorCard !== 1}
                            text="Confirm card"
                        />
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
        chancellor: '',
        chancellorCards: [],
        currentPlayers: [],
        host: '',
        president: '',
        mode: '',
        numberOfPlayers: 0,
        roles: [],
        round: 0,
        playersReady: [],
        playerToGuessMerlin: '',
        playersOnQuest: [],
        playerRoles: [],
        presidentCards: [],
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
        chancellor: PropTypes.string,
        chancellorCards: PropTypes.arrayOf(PropTypes.number),
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        president: PropTypes.string,
        mode: PropTypes.string,
        numberOfPlayers: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        round: PropTypes.number,
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
        status: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    giveCardsToChancellorRequest: PropTypes.func.isRequired,
    makeHitlerVoteRequest: PropTypes.func.isRequired,
    playChancellorCardRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    giveCardsToChancellorRequest,
    makeHitlerVoteRequest,
    makeQuestRequest,
    playChancellorCardRequest
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
