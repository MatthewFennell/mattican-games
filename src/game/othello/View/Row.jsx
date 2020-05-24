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
        <Cell isTop={props.isTop} isBottom={props.isBottom} isLeft />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} />
        <Cell isTop={props.isTop} isBottom={props.isBottom} isRight />
    </div>
);

Row.defaultProps = {
    isBottom: false,
    isMiddle: false,
    isTop: false,
    styles: defaultStyles
};

Row.propTypes = {
    isBottom: PropTypes.bool,
    isMiddle: PropTypes.bool,
    isTop: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Row;
