import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './LoadingDiv.module.scss';

const LoadingDiv = props => (
    <div>
        <div className={props.styles.wrapper}>
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
    </div>
);


LoadingDiv.defaultProps = {
    children: null,
    isLoading: false,
    styles: defaultStyles
};

LoadingDiv.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    isLoading: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default LoadingDiv;
