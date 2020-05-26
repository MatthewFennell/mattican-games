import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameActive.module.scss';
import Board from '../View/Board';
import GameInfo from './GameInfo';
import * as queries from '../queries';

const GameActive = props => {
    const [hoverX, setHoverX] = useState(-1);
    const [hoverY, setHoverY] = useState(-1);

    const onCellClick = useCallback((row, col) => {
        props.placeDiscRequest(props.currentGameId, row, col);

        // eslint-disable-next-line
    }, [props.currentGame.board, props.currentGame.activePlayer, props.currentGameId]);

    const onMouseEnter = useCallback((row, col) => {
        setHoverY(row);
        setHoverX(col);
    }, [setHoverX, setHoverY]);


    const generateVisibleBoard = useCallback(() => {
        if (hoverX >= 0 && hoverX <= 7 && hoverY >= 0 && hoverY <= 7) {
            return queries.placeDisc(props.currentGame.board, hoverY,
                hoverX, props.currentGame.activePlayer);
        }
        return props.currentGame.board;
    }, [hoverX, hoverY, props.currentGame]);

    return (
        <div className={props.styles.gameActiveWrapper}>
            <Board
                availableMoves={queries.getAvailableMoves(props.currentGame.board,
                    props.currentGame.activePlayer)}
                board={generateVisibleBoard()}
                onCellClick={onCellClick}
                onMouseEnter={onMouseEnter}
            />

            <GameInfo
                auth={props.auth}
                currentGame={props.currentGame}
                leaveGameRequest={props.leaveGameRequest}
                rematchRequest={props.rematchRequest}
                users={props.users}
            />
        </div>
    );
};

GameActive.defaultProps = {
    auth: {
        uid: ''
    },
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
        hasFinished: false,
        playerBlack: '',
        playerWhite: ''
    },
    currentGameId: '',
    leaveGameRequest: noop,
    placeDiscRequest: noop,
    rematchRequest: noop,
    styles: defaultStyles,
    users: {}
};

GameActive.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
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
        hasFinished: PropTypes.bool,
        playerBlack: PropTypes.string,
        playerWhite: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    leaveGameRequest: PropTypes.func,
    placeDiscRequest: PropTypes.func,
    rematchRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameActive;
