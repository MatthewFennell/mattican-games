import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './RadioButton.module.scss';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1)
    },
    title: {
        color: '#3f51b5' // Blue
    }
}));

const RadioButton = props => {
    const classes = useStyles();

    const onChange = event => {
        props.onChange(event.target.value);
    };

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" className={classes.title}>{props.text}</FormLabel>
            <RadioGroup
                row
                aria-label={props.text}
                name={props.text}
                value={props.value}
                onChange={onChange}
                className={props.styles.justifyCenter}
            >
                {props.options.map(option => (
                    <FormControlLabel
                        value={option.value}
                        control={<Radio color="primary" />}
                        label={option.text}
                        labelPlacement="top"
                        key={option.value}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

RadioButton.defaultProps = {
    onChange: noop,
    text: '',
    options: [],
    styles: defaultStyles,
    value: ''
};

RadioButton.propTypes = {
    onChange: PropTypes.func,
    text: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string
    })),
    styles: PropTypes.objectOf(PropTypes.string),
    value: PropTypes.string
};


export default RadioButton;
