import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './Board.module.scss';
import Row from './Row';

const Board = props => (
    <div className={props.styles.boardWrapper}>
        <Row isTop />
        <Row isMiddle />
        <Row isMiddle />
        <Row isMiddle />
        <Row isMiddle />
        <Row isMiddle />
        <Row isMiddle />
        <Row isBottom />
    </div>
);

Board.defaultProps = {
    styles: defaultStyles
};

Board.propTypes = {
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Board;
