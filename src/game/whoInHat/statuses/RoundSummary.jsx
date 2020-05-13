import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './RoundSummary.module.scss';
import StyledButton from '../../../common/StyledButton/StyledButton';
import Switch from '../../../common/Switch/Switch';

const RoundSummary = props => {
    const toggleWord = useCallback(word => {
        props.setWordConfirmedRequest(props.currentGameId, word,
            !props.currentGame.confirmedWords.includes(word));
        // eslint-disable-next-line
    }, [props.currentGameId, props.currentGame, props.setWordConfirmedRequest]);

    return (
        <div className={props.styles.roundSummaryWrapper}>
            <div className={props.styles.headerWrapper}>
                <div className={props.styles.timeUp}>
                    {'Time is up!'}
                </div>
                <div className={props.styles.confirmWords}>
                    {'Confirm the words you got'}
                </div>
            </div>

            <div className={props.styles.wordsGuessed}>
                <div className={props.styles.confirmedWrapper}>
                    <div className={props.styles.confirmedWordsHeader}>
                        {'Confirmed Words'}
                    </div>
                    {props.currentGame.wordsGuessed.map(word => (
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


                {props.currentGame.skippedWords.length > 0
                && (
                    <div className={props.styles.skippedWraper}>
                        <div className={props.styles.skippedWordsHeader}>
                            {'Skipped Words'}
                        </div>
                        {props.currentGame.skippedWords.map(word => (
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


                {props.currentGame.trashedWords.length > 0
                && (
                    <div className={props.styles.trashedWrapper}>
                        <div className={props.styles.trashedWordsHeader}>
                            {'Trashed Words'}
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

                <StyledButton
                    onClick={() => props.confirmScoreRequest(props.currentGameId)}
                    text={`Confirm score of ${props.currentGame.confirmedWords.length}`}
                />

            </div>
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
    setWordConfirmedRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default RoundSummary;
