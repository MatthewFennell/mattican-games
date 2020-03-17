import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './LoadingText.module.scss';

const LoadingText = props => (
    <div className={props.styles.loadingText}>
        {props.loadingText}
    </div>
);

LoadingText.defaultProps = {
    loadingText: '',
    styles: defaultStyles
};

LoadingText.propTypes = {
    loadingText: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default LoadingText;
