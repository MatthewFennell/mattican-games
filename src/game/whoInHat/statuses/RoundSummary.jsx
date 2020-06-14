/* eslint-disable max-len */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './RoundSummary.module.scss';
import * as helpers from '../../helpers';
import StyledButton from '../../../common/StyledButton/StyledButton';
import Switch from '../../../common/Switch/Switch';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';

const RoundSummary = props => {
    const {
        setWordConfirmedRequest, realignConfirmedWords, currentGameId,
        confirmScoreRequest
    } = props;

    const [localConfirmedWords, setLocalConfiredWords] = useState(props.currentGame.confirmedWords);
    const [isConfirmingScore, setIsConfirmingScore] = useState(false);

    const toggleWord = useCallback(word => {
        setWordConfirmedRequest(props.currentGameId, word,
            !props.currentGame.confirmedWords.includes(word));

        if (localConfirmedWords.includes(word)) {
            setLocalConfiredWords(localConfirmedWords.filter(w => w !== word));
        } else {
            setLocalConfiredWords([...localConfirmedWords, word]);
        }
    }, [props.currentGameId, props.currentGame.confirmedWords, setWordConfirmedRequest, setLocalConfiredWords,
        localConfirmedWords]);

    const arraysAreEqual = (arr1, arr2) => {
        if (arr1.some(x => !arr2.includes(x))) {
            return false;
        }
        if (arr2.some(x => !arr1.includes(x))) {
            return false;
        }
        return true;
    };

    const confirmScore = useCallback(() => {
        setIsConfirmingScore(true);
        confirmScoreRequest(currentGameId, localConfirmedWords);
    }, [confirmScoreRequest, currentGameId, localConfirmedWords, setIsConfirmingScore]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (props.auth.uid === props.currentGame.activeExplainer) {
                if (!arraysAreEqual(localConfirmedWords, props.currentGame.confirmedWords)) {
                    realignConfirmedWords(currentGameId, localConfirmedWords);
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    },
    [props.auth.uid, props.currentGame.activeExplainer, localConfirmedWords, props.currentGame.confirmedWords, currentGameId,
        realignConfirmedWords]);

    return (
        <div className={props.styles.roundSummaryWrapper}>
            <div className={props.styles.headerWrapper}>
                <div className={props.styles.timeUp}>
                    Time is up!
                </div>
                <div className={props.styles.confirmWords}>
                    {props.currentGame.activeExplainer === props.auth.uid ? 'Confirm the words you got'
                        : `${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} is confirming the score`}
                </div>

                {props.auth.uid !== props.currentGame.activeExplainer && (
                    <div className={props.styles.currentScore}>
                        {`Current score: ${props.currentGame.confirmedWords.length}`}
                    </div>
                )}
            </div>

            {props.currentGame.activeExplainer === props.auth.uid && (
                <div className={props.styles.wordsGuessed}>
                    <div className={props.styles.confirmedWrapper}>
                        <div className={props.styles.confirmedWordsHeader}>
                            Confirmed Words
                        </div>
                        {props.currentGame.wordsGuessed.map(word => (
                            <div className={props.styles.wordRowWrapper} key={word}>
                                <div className={classNames({
                                    [props.styles.word]: true,
                                    [props.styles.isConfirmedWord]: localConfirmedWords
                                        .includes(word),
                                    [props.styles.notConfirmed]: !localConfirmedWords.includes(word)
                                })}
                                >
                                    {word}
                                </div>
                                <div>
                                    <Switch
                                        checked={localConfirmedWords.includes(word)}
                                        onChange={() => toggleWord(word)}
                                        color="primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>


                    {props.currentGame.skippedWords.length > 0
                && (
                    <div className={props.styles.skippedWraper}>
                        <div className={props.styles.skippedWordsHeader}>
                            Skipped Words
                        </div>
                        {props.currentGame.skippedWords.map(word => (
                            <div className={props.styles.wordRowWrapper} key={word}>
                                <div className={classNames({
                                    [props.styles.word]: true,
                                    [props.styles.isConfirmedWord]: localConfirmedWords.includes(word),
                                    [props.styles.notConfirmed]: !localConfirmedWords.includes(word)
                                })}
                                >
                                    {word}
                                </div>
                                <div>
                                    <Switch
                                        checked={localConfirmedWords.includes(word)}
                                        onChange={() => toggleWord(word)}
                                        color="primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) }


                    {props.currentGame.trashedWords.length > 0
                && (
                    <div className={props.styles.trashedWrapper}>
                        <div className={props.styles.trashedWordsHeader}>
                            Trashed Words
                        </div>
                        {props.currentGame.trashedWords.map(word => (
                            <div className={props.styles.wordRowWrapper} key={word}>
                                <div className={classNames({
                                    [props.styles.word]: true,
                                    [props.styles.isConfirmedWord]: props.currentGame
                                        .confirmedWords.includes(word),
                                    [props.styles.notConfirmed]: !props.currentGame
                                        .confirmedWords.includes(word)
                                })}
                                >
                                    {word}
                                </div>
                                <div>
                                    <Switch
                                        checked={props.currentGame.confirmedWords.includes(word)}
                                        onChange={() => toggleWord(word)}
                                        color="primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) }
                    <LoadingDiv isFitContent isBlack isBorderRadius isLoading={isConfirmingScore}>
                        <StyledButton
                            onClick={confirmScore}
                            text={`Confirm score of ${localConfirmedWords.length}`}
                        />
                    </LoadingDiv>

                </div>
            )}
        </div>
    );
};

RoundSummary.defaultProps = {
    auth: {
        uid: ''
    },
    confirmScoreRequest: noop,
    currentGame: {
        activeExplainer: '',
        activeTeam: '',
        confirmedWords: [],
        words: [],
        host: '',
        isCustomNames: false,
        skippingRule: '',
        skippedWords: [],
        trashedWords: [],
        teams: [],
        wordsGuessed: []
    },
    currentGameId: '',
    realignConfirmedWords: noop,
    setWordConfirmedRequest: noop,
    styles: defaultStyles,
    users: {}
};

RoundSummary.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    confirmScoreRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        confirmedWords: PropTypes.arrayOf(PropTypes.string),
        words: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        skippingRule: PropTypes.string,
        skippedWords: PropTypes.arrayOf(PropTypes.string),
        trashedWords: PropTypes.arrayOf(PropTypes.string),
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        wordsGuessed: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    realignConfirmedWords: PropTypes.func,
    setWordConfirmedRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default RoundSummary;
