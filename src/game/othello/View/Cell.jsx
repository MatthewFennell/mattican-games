import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import defaultStyles from './Cell.module.scss';

const Cell = props => (
    <div
        className={classNames({
            [props.styles.cellWrapper]: true,
            [props.styles.top]: props.y === 0,
            [props.styles.bottom]: props.y === 7,
            [props.styles.left]: props.x === 0,
            [props.styles.right]: props.x === 7
        })}
        tabIndex={0}
        role="button"
        onClick={() => props.onCellClick(props.y, props.x)}
        onMouseEnter={() => props.onMouseEnter(props.y, props.x)}
    >
        <div className={classNames({
            [props.styles.cellIcon]: true,
            [props.styles.isBlack]: props.value === -1,
            [props.styles.isWhite]: props.value === 1
        })}
        >
            {props.isAvailableMove && (
                <div className={props.styles.isAvailableMove}>
                    <div className={props.styles.availableDot} />
                </div>
            )}
        </div>
    </div>
);

Cell.defaultProps = {
    isAvailableMove: false,
    onCellClick: noop,
    onMouseEnter: noop,
    styles: defaultStyles,
    value: 0,
    x: -1,
    y: -1
};

Cell.propTypes = {
    isAvailableMove: PropTypes.bool,
    onCellClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    value: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
};

export default Cell;
