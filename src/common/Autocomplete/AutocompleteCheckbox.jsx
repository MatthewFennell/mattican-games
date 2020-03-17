/* eslint-disable no-use-before-define */

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { noop } from 'lodash';
import defaultStyles from './Autocomplete.module.scss';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AutocompleteCheckbox = props => (
    <div className={classNames({
        [props.styles.autocompletePadding]: props.withPadding
    })}
    >
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={props.options}
            disableCloseOnSelect
            getOptionLabel={option => option.text}
            onChange={(e, v) => props.onChange(v)}
            value={props.value}
            loading={props.loading}
            renderOption={option => (
                <>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={props.value.some(x => x.text === option.text)}
                    />
                    {option.text}
                </>
            )}
            renderInput={params => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={props.label}
                    placeholder={props.placeholder}

                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {props.loading ? (
                                    <CircularProgress
                                        color={props.loadingColor}
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    </div>
);

AutocompleteCheckbox.propTypes = {
    label: PropTypes.string,
    loading: PropTypes.bool,
    loadingColor: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        checked: PropTypes.bool,
        text: PropTypes.string
    })),
    placeholder: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    value: PropTypes.arrayOf(PropTypes.shape({
        checked: PropTypes.bool,
        text: PropTypes.string
    })),
    withPadding: PropTypes.bool
};

AutocompleteCheckbox.defaultProps = {
    label: '',
    loading: false,
    loadingColor: 'primary',
    onChange: noop,
    options: [],
    placeholder: '',
    styles: defaultStyles,
    value: [],
    withPadding: false
};


export default AutocompleteCheckbox;
