import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './Overview.module.scss';

const Overview = props => (
    <div className={props.styles.overviewWrapper}>
        Hello
    </div>
);

Overview.defaultProps = {
    styles: defaultStyles
};

Overview.propTypes = {
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
};

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);

export { Overview as OverviewUnconnected };
