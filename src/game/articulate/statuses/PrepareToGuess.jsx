import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './PrepareToGuess.module.scss';
import * as helpers from '../../helpers';
import TeamsAndScore from '../../common/TeamsAndScore';
import Fade from '../../../common/Fade/Fade';
import StyledButton from '../../../common/StyledButton/StyledButton';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';

const PrepareToGuess = props => {
    const { currentGameId, startRoundRequest } = props;

    const [viewingTeams, setViewingTeams] = useState(false);
    const toggleViewingTeams = useCallback(() => {
        setViewingTeams(!viewingTeams);
    }, [viewingTeams, setViewingTeams]);

    const [isStartingRound, setIsStartingRound] = useState(false);

    const startRound = useCallback(() => {
        setIsStartingRound(true);
        startRoundRequest(currentGameId);
    }, [startRoundRequest, currentGameId, setIsStartingRound]);

    return (
        <>
            <div className={props.styles.roundInfoWrapper}>
                {props.currentGame.isSpadeRound || props.currentGame.isFinalRound ? (
                    <div className={props.styles.teamText}>
                        All teams play this round!
                    </div>
                )
                    : (
                        <div className={props.styles.teamText}>
                            <div>Team:</div>
                            <div className={props.styles.teamValue}>
                                {props.currentGame.temporaryTeam || props.currentGame.activeTeam}
                            </div>
                        </div>
                    )}
                <div className={props.styles.teamText}>
                    <div>Category:</div>
                    <div className={props.styles.teamValue}>
                        {props.currentGame.activeCategory}
                    </div>
                </div>
                {props.currentGame.temporaryTeam && (
                    <div className={props.styles.bonusRound}>
                        Bonus round
                    </div>
                )}
                {props.auth.uid !== props.currentGame.activeExplainer
        && (
            <div className={props.styles.waitingToStart}>
                {`Waiting for ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} to start`}
            </div>
        )}
                {props.currentGame.isFinalRound && (
                    <div className={props.styles.winningMessage}>
                        {`${props.currentGame.activeTeam} will win the game if they win this round!`}
                    </div>
                )}

                <div className={props.styles.buttonsWrapper}>
                    {props.auth.uid === props.currentGame.activeExplainer && (
                        <LoadingDiv isLoading={isStartingRound} isFitContent isBorderRadius isBlack>
                            <div className={props.styles.startRoundButton}>
                                <StyledButton
                                    onClick={startRound}
                                    text="Start round"
                                    disabled={isStartingRound}
                                />
                            </div>
                        </LoadingDiv>
                    )}
                </div>
            </div>

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
        </>
    );
};

PrepareToGuess.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activeCategory: '',
        activeExplainer: '',
        activeTeam: '',
        finishTime: '',
        isFinalRound: false,
        isSpadeRound: false,
        words: {},
        host: '',
        isCustomNames: false,
        teams: [],
        temporaryTeam: ''
    },
    currentGameId: '',
    startRoundRequest: noop,
    styles: defaultStyles,
    users: {}
};

PrepareToGuess.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activeCategory: PropTypes.string,
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        finishTime: PropTypes.string,
        isFinalRound: PropTypes.bool,
        isSpadeRound: PropTypes.bool,
        words: PropTypes.shape({}),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        temporaryTeam: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    startRoundRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PrepareToGuess;
