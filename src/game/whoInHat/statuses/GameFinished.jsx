import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameFinished.module.scss';
import TeamsAndScore from '../../common/TeamsAndScore';
import StyledButton from '../../../common/StyledButton/StyledButton';
import * as constants from '../../../constants';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';

const sortingMethod = (a, b) => (b.score - a.score !== 0
    ? b.score - a.score : a.members.length - b.members.length);

const GameFinished = props => {
    const { currentGameId, leaveUnconstrainedGameRequest } = props;

    const [isLeavingGame, setIsLeavingGame] = useState(false);

    const leaveGame = useCallback(() => {
        setIsLeavingGame(true);
        leaveUnconstrainedGameRequest(currentGameId);
    }, [currentGameId, leaveUnconstrainedGameRequest, setIsLeavingGame]);

    return (
        <div className={props.styles.gameFinishedWrapper}>
            <div className={props.styles.infoWrapper}>
                <div className={props.styles.gameFinishedHeader}>
                    {props.currentGame.status === constants.whoInHatGameStatuses.ScoreCapReached ? 'Score cap reached!' : 'No cards remaining!'}
                </div>
                <div className={props.styles.winningTeam}>
                    {`Winning team - ${props.currentGame.winningTeam}`}
                </div>
            </div>

            <TeamsAndScore
                auth={props.auth}
                currentGame={props.currentGame}
                showScore
                sortingMethod={sortingMethod}
                users={props.users}
            />

            <LoadingDiv isFitContent isBorderRadius isRed isLoading={isLeavingGame}>
                <div className={props.styles.leaveGameButton}>
                    <StyledButton
                        onClick={leaveGame}
                        text="Leave Game"
                        disabled={isLeavingGame}
                    />
                </div>
            </LoadingDiv>
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
    leaveUnconstrainedGameRequest: noop,
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
        words: PropTypes.arrayOf(PropTypes.string),
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
    leaveUnconstrainedGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameFinished;
