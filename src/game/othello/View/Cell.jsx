import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './Cell.module.scss';

const Cell = props => (
    <div className={classNames({
        [props.styles.cellWrapper]: true,
        [props.styles.top]: props.isTop,
        [props.styles.bottom]: props.isBottom,
        [props.styles.left]: props.isLeft,
        [props.styles.right]: props.isRight
    })}
    >
        <div className={props.styles.cellIcon} />
    </div>
);

Cell.defaultProps = {
    isBottom: false,
    isLeft: false,
    isRight: false,
    isTop: false,
    styles: defaultStyles
};

Cell.propTypes = {
    isBottom: PropTypes.bool,
    isLeft: PropTypes.bool,
    isRight: PropTypes.bool,
    isTop: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Cell;
