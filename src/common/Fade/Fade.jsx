import React from 'react';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

const Fade = props => (
    <>
        {props.includeCheckbox && (
            <FormControlLabel
                className={props.switchStyles.label}
                control={(
                    <Switch
                        checked={props.checked}
                        onChange={props.onChange}
                        color={props.switchColor}
                    />
                )}
                label={props.label}
            />
        )}
        <Collapse in={props.checked}>
            {props.children}
        </Collapse>
    </>
);

Fade.defaultProps = {
    checked: false,
    children: null,
    includeCheckbox: false,
    label: 'Show',
    onChange: noop,
    switchColor: 'primary',
    switchStyles: {}
};

Fade.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    includeCheckbox: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    switchColor: PropTypes.string,
    switchStyles: PropTypes.objectOf(PropTypes.string)
};

export default Fade;
