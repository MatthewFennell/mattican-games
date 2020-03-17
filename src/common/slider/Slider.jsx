import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    margin: {
        height: theme.spacing(3)
    }

}));

function valuetext(value) {
    return value;
}


const CustomSlider = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.text}
            <Slider
                onChange={(e, value) => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onChange(value);
                }}
                defaultValue={props.defaultValue}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-always"
                step={props.step}
                marks={props.marks}
                min={props.min}
                max={props.max}
                valueLabelDisplay={props.showMarker ? 'on' : 'off'}
                value={props.value}
            />
        </div>
    );
};

CustomSlider.defaultProps = {
    defaultValue: 0,
    marks: [],
    max: 0,
    min: 0,
    onChange: noop,
    showMarker: true,
    step: 1,
    text: '',
    value: 0
};

CustomSlider.propTypes = {
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    marks: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    })),
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
    showMarker: PropTypes.bool,
    step: PropTypes.number,
    text: PropTypes.string,
    value: PropTypes.number
};

export default CustomSlider;
