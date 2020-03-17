import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    }
}));

const TimedLoader = props => {
    const classes = useStyles();
    const [completed, setCompleted] = React.useState(100);

    useEffect(() => {
        const progress = () => {
            setCompleted(oldCompleted => Math.max(oldCompleted - (10 / props.numberOfSeconds), 0));
        };

        const timer = setInterval(progress, 100);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={classes.root}>
            <LinearProgress variant="determinate" value={completed} color="secondary" />
        </div>
    );
};

TimedLoader.defaultProps = {
    numberOfSeconds: 2
};

TimedLoader.propTypes = {
    numberOfSeconds: PropTypes.number
};


export default TimedLoader;
