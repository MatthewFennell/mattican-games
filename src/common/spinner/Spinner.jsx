import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    progress: {
        margin: theme.spacing(2)
    }
}));

const Spinner = props => {
    const classes = useStyles();

    return (
        <CircularProgress className={classes.progress} color={props.color} />
    );
};

Spinner.defaultProps = {
    color: 'primary'
};

Spinner.propTypes = {
    color: PropTypes.string
};

export default Spinner;
