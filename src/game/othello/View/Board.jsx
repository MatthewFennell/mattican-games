import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './Board.module.scss';
import Row from './Row';

const Board = props => (
    <div className={props.styles.boardWrapper}>
        <Row isTop row={props.board.rowOne} />
        <Row isMiddle row={props.board.rowTwo} />
        <Row isMiddle row={props.board.rowThree} />
        <Row isMiddle row={props.board.rowFour} />
        <Row isMiddle row={props.board.rowFive} />
        <Row isMiddle row={props.board.rowSix} />
        <Row isMiddle row={props.board.rowSeven} />
        <Row isBottom row={props.board.rowEight} />
    </div>
);

Board.defaultProps = {
    board: {
        rowOne: [],
        rowTwo: [],
        rowThree: [],
        rowFour: [],
        rowFive: [],
        rowSix: [],
        rowSeven: [],
        rowEight: []
    },
    styles: defaultStyles
};

Board.propTypes = {
    board: PropTypes.shape({
        rowOne: PropTypes.arrayOf(PropTypes.number),
        rowTwo: PropTypes.arrayOf(PropTypes.number),
        rowThree: PropTypes.arrayOf(PropTypes.number),
        rowFour: PropTypes.arrayOf(PropTypes.number),
        rowFive: PropTypes.arrayOf(PropTypes.number),
        rowSix: PropTypes.arrayOf(PropTypes.number),
        rowSeven: PropTypes.arrayOf(PropTypes.number),
        rowEight: PropTypes.arrayOf(PropTypes.number)
    }),
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Board;
