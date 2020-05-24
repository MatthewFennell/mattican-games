import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './GameInfo.module.scss';
import * as constants from '../../../constants';
import * as helpers from '../../helpers';

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

const GameInfo = props => (
    <div className={props.styles.gameInfo}>

        <div className={props.styles.scoreBlack}>
            <div className={props.styles.blackScore}>
                {calculateScore(props.currentGame.board, -1)}
            </div>
            <div className={props.styles.blackIcon} />
        </div>

        <div className={props.styles.centerInfo}>
            <div>
                <div className={props.styles.textWrapper}>
                    <div>Black player:</div>
                    <div className={props.styles.textValue}>
                        {props.currentGame.playerBlack === constants.othelloPlayerTypes.Computer
                            ? 'Computer' : helpers.mapUserIdToName(props.users, props.currentGame.playerBlack)}
                    </div>
                </div>
                <div className={props.styles.textWrapper}>
                    <div>White player:</div>
                    <div className={props.styles.textValue}>
                        {props.currentGame.playerWhite === constants.othelloPlayerTypes.Computer
                            ? 'Computer' : helpers.mapUserIdToName(props.users, props.currentGame.playerWhite)}
                    </div>
                </div>
                <div className={props.styles.textWrapper}>
                    <div>Active player:</div>
                    <div className={props.styles.textValue}>
                        {getActivePlayerName(props.currentGame, props.users)}
                    </div>
                </div>
            </div>
        </div>

        <div className={props.styles.scoreWhite}>
            <div className={props.styles.whiteIcon} />
            <div className={props.styles.whiteScore}>
                {calculateScore(props.currentGame.board, 1)}
            </div>
        </div>
    </div>
);

GameInfo.defaultProps = {
    currentGame: {
        activePlayer: 1,
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
        playerBlack: '',
        playerWhite: ''
    },
    styles: defaultStyles,
    users: {}
};

GameInfo.propTypes = {
    currentGame: PropTypes.shape({
        activePlayer: PropTypes.number,
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
        playerBlack: PropTypes.string,
        playerWhite: PropTypes.string
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameInfo;
