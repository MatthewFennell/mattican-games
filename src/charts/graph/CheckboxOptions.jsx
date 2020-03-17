import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './CheckboxOptions.module.scss';
import Checkbox from '../../common/Checkbox/Checkbox';

const CheckboxOptions = props => (
    <div className={props.styles.checkboxesWrapper}>
        {props.allCollingwoodTeams.map(x => (
            <div className={props.styles.checkboxWrapper}>
                <div className={props.styles.teamName}>{x.text[x.text.length - 1]}</div>
                <div>
                    <Checkbox
                        checked={props.activeTeams.includes(x.text)}
                        onClick={() => props.updateActiveTeams(x.text)}
                    />
                </div>
            </div>
        ))}
    </div>
);

CheckboxOptions.defaultProps = {
    activeTeams: [],
    allCollingwoodTeams: [],
    styles: defaultStyles,
    updateActiveTeams: noop
};

CheckboxOptions.propTypes = {
    activeTeams: PropTypes.arrayOf(PropTypes.string),
    allCollingwoodTeams: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string
    })),
    styles: PropTypes.objectOf(PropTypes.string),
    updateActiveTeams: PropTypes.func
};

export default CheckboxOptions;
