import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './Row.module.scss';
import Cell from './Cell';

const Row = props => (
    <div className={classNames({
        [props.styles.rowWrapper]: true,
        [props.styles.top]: props.isTop,
        [props.styles.middle]: props.isMiddle,
        [props.styles.bottom]: props.isBottom
    })}
    >
        <Cell value={props.row[0]} isTop={props.isTop} isBottom={props.isBottom} isLeft />
        <Cell value={props.row[1]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[2]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[3]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[4]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[5]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[6]} isTop={props.isTop} isBottom={props.isBottom} />
        <Cell value={props.row[7]} isTop={props.isTop} isBottom={props.isBottom} isRight />
    </div>
);

Row.defaultProps = {
    isBottom: false,
    isMiddle: false,
    isTop: false,
    row: [0, 0, 0, 0, 0, 0, 0],
    styles: defaultStyles
};

Row.propTypes = {
    isBottom: PropTypes.bool,
    isMiddle: PropTypes.bool,
    isTop: PropTypes.bool,
    row: PropTypes.arrayOf(PropTypes.number),
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Row;
