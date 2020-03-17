import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import inputOverrideStyles from './styles/InputOverride.module.scss';
import StyledButton from '../common/StyledButton/StyledButton';
import defaultStyles from './styles/LeagueForm.module.scss';
import TextInput from '../common/TextInput/TextInput';

const CreateLeague = props => (
    <div className={props.styles.createLeagueWrapper}>
        <div className={props.styles.textInputsWrapper}>
            <TextInput
                label="League Name"
                onChange={props.setLeagueName}
                styles={inputOverrideStyles}
                value={props.leagueName}
            />
            <TextInput
                label="Start Week"
                onChange={props.setStartWeek}
                styles={inputOverrideStyles}
                type="number"
                value={props.startWeek.toString()}
            />
        </div>
        <StyledButton
            color="primary"
            onClick={props.onCreate}
            text="Create"
            type="submit"
            disabled={!props.leagueName}
        />
    </div>
);

CreateLeague.defaultProps = {
    leagueName: '',
    onCreate: noop,
    setLeagueName: noop,
    setStartWeek: noop,
    startWeek: 0,
    styles: defaultStyles
};

CreateLeague.propTypes = {
    leagueName: PropTypes.string,
    onCreate: PropTypes.func,
    setLeagueName: PropTypes.func,
    setStartWeek: PropTypes.func,
    startWeek: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default CreateLeague;
