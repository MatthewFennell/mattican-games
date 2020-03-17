import React from 'react';
import PropTypes from 'prop-types';
// import { noop } from 'lodash';
import defaultStyles from './AddExtraTeams.module.scss';

const AddExtraTeams = props => (
    <div className={props.styles.checkboxesWrapper} />
);

AddExtraTeams.defaultProps = {
    // activeTeams: [],
    styles: defaultStyles
    // updateActiveTeams: noop
};

AddExtraTeams.propTypes = {
    // activeTeams: PropTypes.arrayOf(PropTypes.string),
    styles: PropTypes.objectOf(PropTypes.string)
    // updateActiveTeams: PropTypes.func
};

export default AddExtraTeams;
