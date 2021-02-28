import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameFinished.module.scss';
import TeamsAndScore from '../../common/TeamsAndScore';
import StyledButton from '../../../common/StyledButton/StyledButton';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import * as constants from '../../../constants';

const sortingMethod = (a, b) => (b.score - a.score !== 0
    ? b.score - a.score : a.members.length - b.members.length);

const GameFinished = props => {
    const { currentGameId, leaveUnconstrainedGameRequest, isPlayingAgain } = props;

    const [isLeavingGame, setIsLeavingGame] = useState(false);

    const leaveGame = useCallback(() => {
        leaveUnconstrainedGameRequest(currentGameId);
        setIsLeavingGame(true);
    }, [leaveUnconstrainedGameRequest, currentGameId, setIsLeavingGame]);

    return (
        <div className={props.styles.gameFinishedWrapper}>
            <div className={props.styles.gameFinishedInfoWrapper}>
                <div className={props.styles.gameFinishedValue}>
                    <div>Game Finished</div>
                </div>

                <div className={props.styles.teamText}>
                    <div>Winners:</div>
                    <div className={props.styles.teamValue}>
                        {props.currentGame.winningTeam}
                    </div>
                </div>
            </div>

            <TeamsAndScore
                auth={props.auth}
                currentGame={props.currentGame}
                showScore
                sortingMethod={sortingMethod}
                users={props.users}
            />

            <div className={props.styles.gameFinishedButtons}>

                <LoadingDiv isLoading={isPlayingAgain} isFitContent isBorderRadius>
                    <div className={props.styles.leaveGameButton}>
                        <StyledButton
                            onClick={() => props.playAgainRequest(props.currentGameId,
                                constants.gameModes.Articulate)}
                            text="Play again"
                            disabled={isLeavingGame}
                        />
                    </div>
                </LoadingDiv>

                <LoadingDiv isLoading={isLeavingGame} isFitContent isBorderRadius>
                    <div className={props.styles.leaveGameButton}>
                        <StyledButton
                            onClick={leaveGame}
                            text="Leave Game"
                            disabled={isLeavingGame}
                        />
                    </div>
                </LoadingDiv>
            </div>
        </div>
    );
};

GameFinished.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activeExplainer: '',
        activeTeam: '',
        finishTime: '',
        words: [],
        host: '',
        isCustomNames: false,
        status: '',
        teams: [],
        winningTeam: ''
    },
    currentGameId: '',
    isPlayingAgain: false,
    leaveUnconstrainedGameRequest: noop,
    playAgainRequest: noop,
    styles: defaultStyles,
    users: {}
};

GameFinished.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        finishTime: PropTypes.string,
        words: PropTypes.shape({}),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        status: PropTypes.string,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        winningTeam: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    isPlayingAgain: PropTypes.bool,
    leaveUnconstrainedGameRequest: PropTypes.func,
    playAgainRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameFinished;
