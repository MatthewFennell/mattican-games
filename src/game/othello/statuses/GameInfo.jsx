import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import Fade from '../../../common/Fade/Fade';
import GameFinished from './GameFinished';
import HeuristicInfo from './HeuristicInfo';
import defaultStyles from './GameInfo.module.scss';
import * as constants from '../../../constants';
import * as helpers from '../../helpers';
import StyledButton from '../../../common/StyledButton/StyledButton';

const calculateScore = (board, player) => Object.values(board).flat()
    .filter(x => x === player).length;

const getActivePlayerName = (game, users) => {
    if (game.activePlayer === -1) {
        return game.playerBlack === constants.othelloPlayerTypes.Computer
            ? 'Computer' : helpers.mapUserIdToName(users, game.playerBlack);
    }
    return game.playerWhite === constants.othelloPlayerTypes.Computer
        ? 'Computer' : helpers.mapUserIdToName(users, game.playerWhite);
};

const getPlayerName = (game, users, player, myId) => {
    const name = player === 1 ? game.playerWhite : game.playerBlack;
    if (name === constants.othelloPlayerTypes.Computer) {
        return 'Computer';
    }
    return (helpers.mapUserIdToName(users, name)) + (name === myId ? ' (you)' : '');
};

const getWinner = (game, users) => {
    const whiteScore = calculateScore(game.board, 1);
    const blackScore = calculateScore(game.board, -1);

    if (whiteScore > blackScore) {
        if (game.playerWhite === constants.othelloPlayerTypes.Computer) {
            return constants.othelloPlayerTypes.Computer;
        }
        return helpers.mapUserIdToName(users, game.playerWhite);
    }
    if (blackScore > whiteScore) {
        if (game.playerBlack === constants.othelloPlayerTypes.Computer) {
            return constants.othelloPlayerTypes.Computer;
        }
        return helpers.mapUserIdToName(users, game.playerBlack);
    }
    return 'No Winners! It was a draw';
};


const GameInfo = props => (
    <div className={props.styles.gameInfoWrapper}>
        <Fade
            checked={props.currentGame.hasFinished}
        >
            <div className={props.styles.gameFinishedWrapper}>
                Game Finished
                <div className={props.styles.textWrapper}>
                    <div>Winner:</div>
                    <div className={props.styles.textValue}>
                        {getWinner(props.currentGame, props.users)}
                    </div>
                </div>
            </div>
        </Fade>
        <div className={props.styles.gameInfo}>
            <div className={props.styles.centerInfo}>
                <div>
                    <div className={props.styles.scoreWrapper}>
                        <div className={props.styles.scoreBlack}>
                            <div className={props.styles.blackScore}>
                                {calculateScore(props.currentGame.board, -1)}
                            </div>
                            <div className={props.styles.blackIcon} />
                        </div>
                        <div className={props.styles.scoreWhite}>
                            <div className={props.styles.whiteIcon} />
                            <div className={props.styles.whiteScore}>
                                {calculateScore(props.currentGame.board, 1)}
                            </div>
                        </div>
                    </div>
                    <div className={props.styles.textWrapper}>
                        <div>Black:</div>
                        <div className={props.styles.textValue}>
                            {getPlayerName(props.currentGame, props.users, -1, props.auth.uid)}
                        </div>
                    </div>
                    <div className={props.styles.textWrapper}>
                        <div>White:</div>
                        <div className={props.styles.textValue}>
                            {getPlayerName(props.currentGame, props.users, 1, props.auth.uid)}
                        </div>
                    </div>
                    {!props.currentGame.hasFinished && (
                        <div className={props.styles.textWrapper}>
                            <div>Active:</div>
                            <div className={props.styles.textValue}>
                                {getActivePlayerName(props.currentGame, props.users)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {props.currentGame.opponentType === constants.othelloPlayerTypes.Computer && (
            <HeuristicInfo
                currentGame={props.currentGame}
            />
        )}

        {props.currentGame.aiError && (
            <div className={props.styles.buttonWrapper}>
                <StyledButton
                    text="Regenerate AI move"
                    onClick={() => props.regenerateComputerMove(props.currentGameId)}
                    disabled={props.currentGame.hasFinished}
                />
            </div>
        )}

        <div>
            {(props.currentGame.hasFinished || props.currentGame.hasResigned) && (
                <GameFinished
                    hasResigned={props.currentGame.hasResigned}
                    leaveGameRequest={props.leaveGameRequest}
                />
            )}
        </div>
    </div>
);

GameInfo.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activePlayer: 1,
        aiError: false,
        board: {
            rowZero: [],
            rowOne: [],
            rowTwo: [],
            rowThree: [],
            rowFour: [],
            rowFive: [],
            rowSix: [],
            rowSeven: []
        },
        hasFinished: false,
        hasResigned: false,
        opponentType: constants.othelloPlayerTypes.Human,
        playerBlack: '',
        playerWhite: ''
    },
    currentGameId: '',
    leaveGameRequest: noop,
    regenerateComputerMove: noop,
    styles: defaultStyles,
    users: {}
};

GameInfo.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activePlayer: PropTypes.number,
        aiError: PropTypes.bool,
        board: PropTypes.shape({
            rowZero: PropTypes.arrayOf(PropTypes.number),
            rowOne: PropTypes.arrayOf(PropTypes.number),
            rowTwo: PropTypes.arrayOf(PropTypes.number),
            rowThree: PropTypes.arrayOf(PropTypes.number),
            rowFour: PropTypes.arrayOf(PropTypes.number),
            rowFive: PropTypes.arrayOf(PropTypes.number),
            rowSix: PropTypes.arrayOf(PropTypes.number),
            rowSeven: PropTypes.arrayOf(PropTypes.number)
        }),
        hasFinished: PropTypes.bool,
        hasResigned: PropTypes.bool,
        opponentType: PropTypes.string,
        playerBlack: PropTypes.string,
        playerWhite: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    leaveGameRequest: PropTypes.func,
    regenerateComputerMove: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameInfo;
