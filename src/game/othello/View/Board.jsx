import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './Board.module.scss';
import Row from './Row';

const Board = props => (
    <div className={props.styles.boardWrapper}>
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 0)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowZero}
            y={0}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 1)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowOne}
            y={1}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 2)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowTwo}
            y={2}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 3)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowThree}
            y={3}
        />
        <Row
            isMiddle
            availableMoves={props.availableMoves.filter(move => move[0] === 4)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowFour}
            y={4}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 5)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowFive}
            y={5}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 6)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowSix}
            y={6}
        />
        <Row
            availableMoves={props.availableMoves.filter(move => move[0] === 7)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            row={props.board.rowSeven}
            y={7}
        />
    </div>
);

Board.defaultProps = {
    availableMoves: [],
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
    onCellClick: noop,
    onMouseEnter: noop,
    styles: defaultStyles
};

Board.propTypes = {
    availableMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
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
    onCellClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Board;
