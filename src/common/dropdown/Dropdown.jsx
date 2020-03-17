import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    }
}));

const Dropdown = props => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleChange = event => {
        props.onChange(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <InputLabel
                    htmlFor="demo-controlled-open-select"
                >
                    {props.title}
                </InputLabel>
                <Select
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={props.value}
                    onChange={handleChange}
                    inputProps={{
                        id: 'demo-controlled-open-select'
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {props.options.map(entry => (
                        <MenuItem
                            key={entry.id}
                            value={entry.value}
                        >
                            {entry.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </form>
    );
};

Dropdown.defaultProps = {
    value: '',
    onChange: noop,
    options: [],
    title: ''
};

Dropdown.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        text: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    })),
    title: PropTypes.string
};

export default Dropdown;
