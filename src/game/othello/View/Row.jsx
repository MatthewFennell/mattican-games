import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import defaultStyles from './Row.module.scss';
import Cell from './Cell';

const Row = props => (
    <div className={classNames({
        [props.styles.rowWrapper]: true,
        [props.styles.top]: props.y === 0
        // [props.styles.middle]: props.y > 0 && props.y < 7,
        // [props.styles.bottom]: props.y === 7
    })}
    >
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 0)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[0]}
            x={0}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 1)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[1]}
            x={1}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 2)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[2]}
            x={2}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 3)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[3]}
            x={3}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 4)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[4]}
            x={4}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 5)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[5]}
            x={5}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 6)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[6]}
            x={6}
            y={props.y}
        />
        <Cell
            isAvailableMove={props.availableMoves.some(move => move[1] === 7)}
            onCellClick={props.onCellClick}
            onMouseEnter={props.onMouseEnter}
            value={props.row[7]}
            x={7}
            y={props.y}
        />
    </div>
);

Row.defaultProps = {
    availableMoves: [],
    onCellClick: noop,
    onMouseEnter: noop,
    row: [0, 0, 0, 0, 0, 0, 0],
    styles: defaultStyles,
    y: -1
};

Row.propTypes = {
    availableMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onCellClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    row: PropTypes.arrayOf(PropTypes.number),
    styles: PropTypes.objectOf(PropTypes.string),
    y: PropTypes.number
};

export default Row;
