import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './LoadingDiv.module.scss';

const LoadingDiv = props => (
    <div className={classNames({
        [props.styles.wrapper]: true,
        [props.styles.margin]: props.isMargin,
        [props.styles.borderRadius]: props.isBorderRadius,
        [props.styles.fitContent]: props.isFitContent
    })}
    >
        <span className={classNames({
            [props.styles.firstSpan]: true,
            [props.styles.firstSpanLoading]: props.isLoading
        })}
        />
        <span className={classNames({
            [props.styles.secondSpan]: true,
            [props.styles.secondSpanLoading]: props.isLoading
        })}
        />
        <span className={classNames({
            [props.styles.thirdSpan]: true,
            [props.styles.thirdSpanLoading]: props.isLoading
        })}
        />
        <span className={classNames({
            [props.styles.fourthSpan]: true,
            [props.styles.fourthSpanLoading]: props.isLoading
        })}
        />
        {props.children}
    </div>
);


LoadingDiv.defaultProps = {
    children: null,
    isBorderRadius: false,
    isFitContent: false,
    isLoading: false,
    isMargin: false,
    styles: defaultStyles
};

LoadingDiv.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    isBorderRadius: PropTypes.bool,
    isFitContent: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMargin: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default LoadingDiv;
