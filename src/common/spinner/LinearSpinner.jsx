import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

const LinearSpinner = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <LinearProgress color={props.color} />
        </div>
    );
};

LinearSpinner.defaultProps = {
    color: 'primary'
};

LinearSpinner.propTypes = {
    color: PropTypes.string
};

export default LinearSpinner;
