import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import moment from 'moment';
import fp from 'lodash/fp';
import classNames from 'classnames';
import defaultStyles from './Guessing.module.scss';
import * as helpers from '../../helpers';
import TeamsAndScore from '../../common/TeamsAndScore';
import * as constants from '../../../constants';
import StyledButton from '../../../common/StyledButton/StyledButton';
import Fade from '../../../common/Fade/Fade';
import Spinner from '../../../common/spinner/Spinner';
import SuccessModal from '../../../common/modal/SuccessModal';
import Dropdown from '../../../common/dropdown/Dropdown';

const isSkippingDisabled = (skippingRule, skippedWord) => {
    if (skippingRule === constants.articulateSkipping.Unlimited) {
        return false;
    }
    if (skippingRule === constants.articulateSkipping.NoSkipping.split(' ')
        .join('')) {
        return true;
    }
    if (skippedWord) {
        return true;
    }
    return false;
};

const isActiveExplainerOnMyTeam = (game, uid) => {
    const {
        activeTeam, activeExplainer, teams, temporaryTeam
    } = game;

    if (activeExplainer === uid) {
        return false;
    }

    const myTeam = teams.find(team => team.members.includes(uid));
    return fp.get('name')(myTeam) === (temporaryTeam || activeTeam);
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
    const [spadeRoundCompleted, setSpadeRoundCompleted] = useState(false);
    const [winningSpadeTeam, setWinningSpadeTeam] = useState('');

    const [finalRoundCompleted, setFinalRoundCompleted] = useState(false);
    const [winningFinalTeam, setWinningFinalTeam] = useState('');

    const skipWord = useCallback(() => {
        if (props.currentGame.skippingRule === constants.articulateSkipping.OneSkip.split(' ').join('')) {
            setSkippedWord(fp.flow(
                fp.get(props.currentGame.activeCategory),
                fp.get(currentWordIndex)
            )(words));
            setCurrentWordIndex(currentWordIndex + 1);
        }
        if (props.currentGame.skippingRule === constants.articulateSkipping.Unlimited) {
            props.skipWordRequest(props.currentGameId, fp.flow(
                fp.get(props.currentGame.activeCategory),
                fp.get(currentWordIndex)
            )(words));
            setCurrentWordIndex(currentWordIndex + 1);
        }
        // eslint-disable-next-line
    }, [words, currentWordIndex, props.currentGame, currentWordIndex,
        setCurrentWordIndex, setSkippedWord, props.currentGameId]);

    const swapSkippedWord = useCallback(() => {
        setViewingSkippedWord(!viewingSkippedWord);
    }, [setViewingSkippedWord, viewingSkippedWord]);

    // NEXT THING TO DO IS WHAT HAPPENS IN gotWord when on finalRound
    // New dropdown for final team - could be same as other

    const gotWord = useCallback(() => {
        if (props.currentGame.isSpadeRound) {
            setSpadeRoundCompleted(true);
        } else if (props.currentGame.isFinalRound) {
            setFinalRoundCompleted(true);
        } else if (viewingSkippedWord) {
            setViewingSkippedWord(false);
            setSkippedWord('');
            props.gotWordRequest(props.currentGameId, skippedWord);
        } else {
            props.gotWordRequest(props.currentGameId, fp.flow(
                fp.get(props.currentGame.activeCategory),
                fp.get(currentWordIndex)
            )(words));
            setCurrentWordIndex(currentWordIndex + 1);
        }
        // eslint-disable-next-line
    }, [setViewingSkippedWord, setSkippedWord, viewingSkippedWord, setCurrentWordIndex,
        currentWordIndex, words, props.currentGameId, props.currentGame.isSpadeRound,
        setSpadeRoundCompleted, setFinalRoundCompleted]);

    const trashWord = useCallback(() => {
        props.trashWordRequest(props.currentGameId, fp.flow(
            fp.get(props.currentGame.activeCategory),
            fp.get(currentWordIndex)
        )(words));
        if (viewingSkippedWord) {
            setViewingSkippedWord(false);
            setSkippedWord('');
        } else {
            setCurrentWordIndex(currentWordIndex + 1);
        }
        // eslint-disable-next-line
    }, [props.currentGameId, words, currentWordIndex, setCurrentWordIndex, props.trashWordRequest,
        setViewingSkippedWord, setSkippedWord, viewingSkippedWord]);

    const closeSpadeFinished = useCallback(() => {
        setSpadeRoundCompleted(false);
        setWinningSpadeTeam('');
    }, [setSpadeRoundCompleted, setWinningSpadeTeam]);

    const closeFinalRound = useCallback(() => {
        setFinalRoundCompleted(false);
        setWinningFinalTeam('');
    }, [setFinalRoundCompleted, setWinningFinalTeam]);

    const confirmSpadeWinner = useCallback(() => {
        props.spadeRoundWinnerRequest(props.currentGameId, winningSpadeTeam);
        setWinningSpadeTeam('');
        setSpadeRoundCompleted(false);
        // eslint-disable-next-line
    }, [props.currentGameId, winningSpadeTeam])

    const confirmFinalWinner = useCallback(() => {
        if (props.currentGame.activeTeam === winningFinalTeam) {
            props.confirmWinner(props.currentGameId);
            setFinalRoundCompleted(false);
            setWinningFinalTeam('');
        } else {
            props.confirmScoreRequest(props.currentGameId);
            setFinalRoundCompleted(false);
            setWinningFinalTeam('');
        }
        // eslint-disable-next-line
    }, [props.currentGame.activeTeam, winningFinalTeam, props.currentGameId]);

    useEffect(() => {
        const interval = setInterval(() => setTime(moment()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (Math.round(timeUntil < 1) && !triedToEndRound
        && props.currentGame.status === constants.whoInHatGameStatuses.Guessing
        && !props.currentGame.isSpadeRound && !props.currentGame.isFinalRound) {
            props.loadSummaryRequest(props.currentGameId);
            setTriedToEndRound(true);
        }
        // eslint-disable-next-line
    }, [time, props.currentGame, props.auth, props.loadSummaryRequest, triedToEndRound, setTriedToEndRound,
        props.currentGame.isSpadeRound]);

    return (
        Math.round(timeUntil) > 0 || props.currentGame.isFinalRound
        || props.currentGame.isSpadeRound ? (
        // true ? (
            <>
                <div className={props.styles.guessingWrapper}>

                    {isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                    && !props.currentGame.isSpadeRound
                && (
                    <div className={props.styles.guessingHeader}>
                        {`Silence! ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} is currently describing to their team`}
                    </div>
                ) }

                    {!props.currentGame.isSpadeRound && !props.currentGame.isFinalRound && (
                        <div className={props.styles.remainingTime}>
                            {Math.round(timeUntil)}
                        </div>
                    )}


                    <div className={props.styles.infoWrapper}>
                        <div className={props.styles.textWrapper}>
                            <div>Team:</div>
                            <div className={props.styles.textValue}>
                                {props.currentGame.temporaryTeam || props.currentGame.activeTeam}
                            </div>
                        </div>

                        <div className={props.styles.textWrapper}>
                            <div>Category:</div>
                            <div className={props.styles.textValue}>
                                {props.currentGame.activeCategory}
                            </div>
                        </div>

                        {props.currentGame.temporaryTeam && (
                            <div className={props.styles.bonusRound}>
                                {'Bonus round'}
                            </div>
                        )}

                        {!isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                 && props.auth.uid !== props.currentGame.activeExplainer
                 && !props.currentGame.isSpadeRound && !props.currentGame.isFinalRound
                 && (
                     <div className={props.styles.otherTeamGuessingMessage}>
                         {'Shh! Other team is guessing'}
                     </div>
                 )}

                        {(isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                    || props.currentGame.isSpadeRound || props.currentGame.isFinalRound)
                    && (
                        <div className={props.styles.guessDescribedWord}>
                            {`Guess the word being described by ${helpers.mapUserIdToName(props.users,
                                props.currentGame.activeExplainer)}`}
                        </div>
                    ) }


                        {(props.currentGame.isSpadeRound || props.currentGame.isFinalRound) && (
                            <div className={props.styles.allPlayMessage}>
                                {'This is an all play round!'}
                            </div>
                        )}
                    </div>


                    {!isActiveExplainerOnMyTeam(props.currentGame, props.auth.uid)
                 && props.auth.uid !== props.currentGame.activeExplainer
                 && !props.currentGame.isSpadeRound && !props.currentGame.isFinalRound
                 && (
                     <div className={props.styles.viewTeamsWrapper}>
                         <div className={props.styles.otherCardsWrapper}>
                             <Fade
                                 checked={viewingOtherTeamWord}
                                 onChange={toggleViewingOtherTeamWord}
                                 includeCheckbox
                                 label="View word being described"
                             >
                                 <div className={props.styles.viewOtherTeamWordWrapper}>
                                     {fp.flow(
                                         fp.get(props.currentGame.activeCategory),
                                         fp.get(props.currentGame.currentWordIndex)
                                     )(words)}
                                 </div>
                             </Fade>
                         </div>
                     </div>
                 ) }

                    {props.auth.uid === props.currentGame.activeExplainer && (
                        <div className={props.styles.describeWords}>
                            <div className={classNames({
                                [props.styles.wordToDescribe]: true,
                                [props.styles[props.currentGame.activeCategory]]: true
                            })}
                            >
                                {viewingSkippedWord ? skippedWord : fp.flow(
                                    fp.get(props.currentGame.activeCategory),
                                    fp.get(currentWordIndex)
                                )(words) || 'No cards left'}
                            </div>

                            <div className={props.styles.allButtonsWrapper}>

                                <div className={props.styles.buttonOptions}>
                                    <div className={props.styles.unlimitedSkip}>
                                        <StyledButton
                                            disabled={isSkippingDisabled(
                                                props.currentGame.skippingRule, skippedWord
                                            ) || props.currentGame.isSpadeRound
                                        || props.currentGame.isFinalRound}
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
                            </div>

                            {props.currentGame.skippingRule === constants.articulateSkipping.OneSkip.split(' ')
                                .join('') && skippedWord && (
                                <div
                                    className={props.styles.skippedWord}
                                    tabIndex={0}
                                    role="button"
                                    onClick={swapSkippedWord}
                                >
                                    {viewingSkippedWord ? `Original word: ${fp.flow(
                                        fp.get(props.currentGame.activeCategory),
                                        fp.get(currentWordIndex)
                                    )(words)}` : `Skipped word : ${skippedWord}`}
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
                <SuccessModal
                    backdrop
                    closeModal={closeSpadeFinished}
                    error
                    isOpen={spadeRoundCompleted}
                    headerMessage="Select the winner"
                >
                    <div className={props.styles.spadeRoundCompleted}>
                        <Dropdown
                            title="Choose a team"
                            value={winningSpadeTeam}
                            onChange={setWinningSpadeTeam}
                            options={props.currentGame.teams.map(team => ({
                                id: team.name,
                                value: team.name,
                                text: team.name
                            }))}
                        />

                        <div className={props.styles.confirmButtons}>
                            <StyledButton
                                disabled={!winningSpadeTeam}
                                text="Confirm"
                                onClick={confirmSpadeWinner}
                            />
                        </div>
                    </div>
                </SuccessModal>
                <SuccessModal
                    backdrop
                    closeModal={closeFinalRound}
                    error
                    isOpen={finalRoundCompleted}
                    headerMessage="Select the winner"
                >
                    <div className={props.styles.spadeRoundCompleted}>
                        <Dropdown
                            title="Choose a team"
                            value={winningFinalTeam}
                            onChange={setWinningFinalTeam}
                            options={props.currentGame.teams.map(team => ({
                                id: team.name,
                                value: team.name,
                                text: team.name
                            }))}
                        />

                        <div className={props.styles.confirmButtons}>
                            <StyledButton
                                disabled={!winningFinalTeam}
                                text="Confirm"
                                onClick={confirmFinalWinner}
                            />
                        </div>
                    </div>
                </SuccessModal>
            </>
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
        activeCategory: '',
        activeExplainer: '',
        activeTeam: '',
        currentWordIndex: 0,
        finishTime: null,
        isFinalRound: false,
        isSpadeRound: false,
        words: [],
        host: '',
        isCustomNames: false,
        skippingRule: '',
        skippedWords: [],
        status: '',
        teams: [],
        temporaryTeam: ''
    },
    currentGameId: '',
    confirmScoreRequest: noop,
    confirmWinner: noop,
    gotWordRequest: noop,
    loadSummaryRequest: noop,
    skipWordRequest: noop,
    spadeRoundWinnerRequest: noop,
    trashWordRequest: noop,
    styles: defaultStyles,
    users: {}
};

Guessing.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activeCategory: PropTypes.string,
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        currentWordIndex: PropTypes.number,
        finishTime: PropTypes.string,
        isFinalRound: PropTypes.bool,
        isSpadeRound: PropTypes.bool,
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
        })),
        temporaryTeam: PropTypes.string
    }),
    confirmScoreRequest: PropTypes.func,
    confirmWinner: PropTypes.func,
    currentGameId: PropTypes.string,
    gotWordRequest: PropTypes.func,
    spadeRoundWinnerRequest: PropTypes.func,
    loadSummaryRequest: PropTypes.func,
    skipWordRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    trashWordRequest: PropTypes.func,
    users: PropTypes.shape({})
};

export default Guessing;
