import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './SetTeam.module.scss';
import Dropdown from '../../common/dropdown/Dropdown';
import StyledButton from '../../common/StyledButton/StyledButton';
import Spinner from '../../common/spinner/Spinner';

const Button = props => (
    <div className={props.styles.selectTeamWrapper}>
        <div>
            {props.loadingMyTeam ? <Spinner color="secondary" /> : props.myTeam}
        </div>
        <div>
            <Dropdown
                value={props.activeTeam}
                onChange={props.setActiveTeam}
                options={props.teamOptions}
                title="Set Team"
                key="Set Team"
            />
        </div>

        <div>
            <StyledButton
                onClick={props.updateMyTeam}
                color="primary"
                text="Update my team"
                disabled={Boolean(!props.activeTeam) || props.activeTeam === props.myTeam}
            />
        </div>
    </div>
);

Button.defaultProps = {
    activeTeam: '',
    loadingMyTeam: false,
    myTeam: '',
    setActiveTeam: noop,
    styles: defaultStyles,
    teamOptions: [],
    updateMyTeam: noop
};

Button.propTypes = {
    activeTeam: PropTypes.string,
    loadingMyTeam: PropTypes.bool,
    myTeam: PropTypes.string,
    setActiveTeam: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    teamOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        value: PropTypes.string,
        text: PropTypes.string
    })),
    updateMyTeam: PropTypes.func
};

export default Button;
