import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './ScoreCapReached.module.scss';
import TeamsAndScore from './TeamsAndScore';
import StyledButton from '../../common/StyledButton/StyledButton';

const ScoreCapReached = props => (
    <div className={props.styles.ScoreCapReachedWrapper}>
        <div className={props.styles.scoreCapReachedHeader}>
            {'Score cap reached!'}
        </div>
        <div className={props.styles.winningTeam}>
            {`Winning team - ${props.currentGame.winningTeam}`}
        </div>

        <TeamsAndScore
            auth={props.auth}
            currentGame={props.currentGame}
            showScore
            users={props.users}
        />

        <div className={props.styles.leaveGameButton}>
            <StyledButton
                onClick={() => props.leaveWhoInHatGameRequest(props.currentGameId)}
                text="Leave Game"
            />
        </div>
    </div>
);

ScoreCapReached.defaultProps = {
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
        teams: [],
        winningTeam: ''
    },
    currentGameId: '',
    leaveWhoInHatGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

ScoreCapReached.propTypes = {
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
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        winningTeam: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    leaveWhoInHatGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default ScoreCapReached;
