import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import moment from 'moment';
import fp from 'lodash/fp';
import defaultStyles from './Guessing.module.scss';
import * as helpers from '../helpers';
import TeamsAndScore from './TeamsAndScore';
import * as constants from '../../constants';
import StyledButton from '../../common/StyledButton/StyledButton';
import Fade from '../../common/Fade/Fade';
import Spinner from '../../common/spinner/Spinner';

export const remainingCards = game => {
    const {
        words, skippedWords, trashedWords, wordsGuessed
    } = game;
    return words.length - skippedWords.length - trashedWords.length - wordsGuessed.length;
};

const isSkippingDisabled = (skippingRule, skippedWord) => {
    if (skippingRule === constants.whoInHatSkipping.Unlimited) {
        return false;
    }
    if (skippingRule === constants.whoInHatSkipping.NoSkipping.split(' ')
        .join('')) {
        return true;
    }
    if (skippedWord) {
        return true;
    }
    return false;
};

const isActiveExplainerOnMyTeam = (game, uid) => {
    const { activeTeam, activeExplainer, teams } = game;

    if (activeExplainer === uid) {
        return false;
    }

    const myTeam = teams.find(team => team.members.includes(uid));
    return fp.get('name')(myTeam) === activeTeam;
};

const Guessing = props => {
    const [viewingTeams, setViewingTeams] = useState(false);
    const toggleViewingTeams = useCallback(() => {
        setViewingTeams(!viewingTeams);
    }, [viewingTeams, setViewingTeams]);

    const [viewingOtherTeamWord, setViewingOtherTeamWord] = useState(false);

    const toggleViewingOtherTeamWord = useCallback(() => {
        setViewingOtherTeamWord(!viewingOtherTeamWord);
    }, [viewingOtherTeamWord, setViewingOtherTeamWord]);

    const [time, setTime] = useState(moment());


    const timeUntil = moment(props.currentGame.finishTime).diff(moment(time), 'seconds', true);

    const { words } = props.currentGame;

    const [currentWordIndex, setCurrentWordIndex] = useState(
        props.currentGame.currentWordIndex || 0
    );
    const [skippedWord, setSkippedWord] = useState(fp.first(props.currentGame.skippedWords) || '');
    const [viewingSkippedWord, setViewingSkippedWord] = useState(false);
    const [triedToEndRound, setTriedToEndRound] = useState(false);


    const skipWord = useCallback(() => {
        if (props.currentGame.skippingRule === constants.whoInHatSkipping.OneSkip.split(' ').join('')) {
            setSkippedWord(words[currentWordIndex]);
            setCurrentWordIndex(currentWordIndex + 1);
        }
        if (props.currentGame.skippingRule === constants.whoInHatSkipping.Unlimited) {
            props.skipWordRequest(props.currentGameId, words[currentWordIndex]);
            setCurrentWordIndex(currentWordIndex + 1);
        }
        // eslint-disable-next-line
    }, [words, currentWordIndex, props.currentGame, currentWordIndex,
        setCurrentWordIndex, setSkippedWord, props.currentGameId]);

    const swapSkippedWord = useCallback(() => {
        setViewingSkippedWord(!viewingSkippedWord);
    }, [setViewingSkippedWord, viewingSkippedWord]);


    const gotWord = useCallback(() => {
        if (viewingSkippedWord) {
            setViewingSkippedWord(false);
            setSkippedWord('');
            props.gotWhoInHatWordRequest(props.currentGameId, skippedWord);
        } else {
            props.gotWhoInHatWordRequest(props.currentGameId, words[currentWordIndex]);
            setCurrentWordIndex(currentWordIndex + 1);
        }
        // eslint-disable-next-line
    }, [setViewingSkippedWord, setSkippedWord, viewingSkippedWord, setCurrentWordIndex,
        currentWordIndex, words, props.currentGameId]);

    const trashWord = useCallback(() => {
        props.trashWordRequest(props.currentGameId, words[currentWordIndex]);
        if (viewingSkippedWord) {
            setViewingSkippedWord(false);
            setSkippedWord('');
        } else {
            setCurrentWordIndex(currentWordIndex + 1);
        }

        // eslint-disable-next-line
    }, [props.currentGameId, words, currentWordIndex, setCurrentWordIndex, props.trashWordRequest,
        setViewingSkippedWord, setSkippedWord, viewingSkippedWord]);


    useEffect(() => {
        const interval = setInterval(() => setTime(moment()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (Math.round(timeUntil < 1) && !triedToEndRound
        && props.currentGame.status === constants.whoInHatGameStatuses.Guessing) {
            props.loadScoreSummaryRequest(props.currentGameId);
            setTriedToEndRound(true);
        }
        // eslint-disable-next-line
    }, [time, props.currentGame, props.auth, props.loadScoreSummaryRequest, triedToEndRound, setTriedToEndRound]);

    return (
        Math.round(timeUntil) > 0 ? (
            <div className={props.styles.guessingWrapper}>
                <div className={props.styles.remainingWordsInPool}>
                    {`Remaining cards: ${remainingCards(props.currentGame)}`}
                </div>
                {isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                && (
                    <div className={props.styles.guessingHeader}>
                        {`Silence! ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} is currently describing to their team`}
                    </div>
                ) }


                <div className={props.styles.remainingTime}>
                    {Math.round(timeUntil)}
                </div>

                {isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid) && (
                    <div className={props.styles.guessDescribedWord}>
                        {'Guess the word being described!'}
                    </div>
                ) }

                {!isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                 && props.auth.uid !== props.currentGame.activeExplainer
                 && (
                     <div className={props.styles.viewTeamsWrapper}>
                         <div className={props.styles.otherTeamGuessingMessage}>
                             {'Shh! Other team is guessing'}
                         </div>
                         <div className={props.styles.otherCardsWrapper}>
                             <Fade
                                 checked={viewingOtherTeamWord}
                                 onChange={toggleViewingOtherTeamWord}
                                 includeCheckbox
                                 label="View word being described"
                             >
                                 <div className={props.styles.viewOtherTeamWordWrapper}>
                                     {words[props.currentGame.currentWordIndex]}
                                 </div>
                             </Fade>
                         </div>
                     </div>
                 ) }

                {props.auth.uid === props.currentGame.activeExplainer && (
                    <div className={props.styles.describeWords}>
                        <div className={props.styles.wordToDescribe}>
                            {viewingSkippedWord ? skippedWord : words[currentWordIndex] || 'No cards left'}
                        </div>

                        <div className={props.styles.buttonOptions}>
                            <div className={props.styles.unlimitedSkip}>
                                <StyledButton
                                    disabled={isSkippingDisabled(
                                        props.currentGame.skippingRule, skippedWord
                                    )}
                                    onClick={skipWord}
                                    text="Skip word"
                                />
                            </div>

                            <div className={props.styles.trashWord}>
                                <StyledButton
                                    onClick={trashWord}
                                    text="Trash word"
                                />
                            </div>
                        </div>

                        <div className={props.styles.gotWord}>
                            <StyledButton
                                onClick={gotWord}
                                text="Got it!"
                            />
                        </div>

                        {props.currentGame.skippingRule === constants.whoInHatSkipping.OneSkip.split(' ')
                            .join('') && skippedWord && (
                            <div
                                className={props.styles.skippedWord}
                                tabIndex={0}
                                role="button"
                                onClick={swapSkippedWord}
                            >
                                {viewingSkippedWord ? `Original word: ${words[currentWordIndex]}` : `Skipped word : ${skippedWord}`}
                                <div className={props.styles.swapBackMessage}>
                                    (Touch to swap)
                                </div>
                            </div>
                        )}
                    </div>
                ) }
                <div className={props.styles.viewTeamsWrapper}>
                    <Fade
                        checked={viewingTeams}
                        onChange={toggleViewingTeams}
                        includeCheckbox
                        label="View teams"
                    >
                        <TeamsAndScore
                            auth={props.auth}
                            currentGame={props.currentGame}
                            showScore
                            users={props.users}
                        />
                    </Fade>
                </div>
            </div>
        ) : (
            <div className={props.styles.loadingWrapper}>
                <div>Loading score</div>
                <Spinner />
            </div>
        )
    );
};

Guessing.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activeExplainer: '',
        activeTeam: '',
        currentWordIndex: 0,
        finishTime: null,
        words: [],
        host: '',
        isCustomNames: false,
        skippingRule: '',
        skippedWords: [],
        status: '',
        teams: []
    },
    currentGameId: '',
    gotWhoInHatWordRequest: noop,
    loadScoreSummaryRequest: noop,
    skipWordRequest: noop,
    trashWordRequest: noop,
    styles: defaultStyles,
    users: {}
};

Guessing.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        currentWordIndex: PropTypes.number,
        finishTime: PropTypes.string,
        words: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        skippingRule: PropTypes.string,
        skippedWords: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        }))
    }),
    currentGameId: PropTypes.string,
    gotWhoInHatWordRequest: PropTypes.func,
    loadScoreSummaryRequest: PropTypes.func,
    skipWordRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    trashWordRequest: PropTypes.func,
    users: PropTypes.shape({})
};

export default Guessing;
