import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './FixtureFilters.module.scss';
import TextInput from '../../common/TextInput/TextInput';
import Switch from '../../common/Switch/Switch';
import Dropdown from '../../common/dropdown/Dropdown';
import * as textInputConstants from '../../common/TextInput/constants';

const FixtureFilters = props => (
    <>
        <div className={props.styles.extraFilters}>
            <div>
                <Dropdown
                    text=""
                    onChange={props.setRadioValue}
                    options={props.radioOptions}
                    value={props.radioValue}
                    label="Filter Fixtures"
                    key="Filter Fixtures"
                    title="Filter by team"
                />
            </div>
            <div>
                <TextInput
                    label="Team Name"
                    onChange={props.searchByTeamName}
                    value={props.teamNameFilter}
                    icom={textInputConstants.textInputIcons.search}
                    iconColor="primary"
                />
            </div>
            <div className={props.styles.collingwoodOnly}>
                <div>
                    Collingwood Only
                </div>
                <div>
                    <Switch
                        color="primary"
                        checked={props.collingwoodOnly}
                        onChange={props.toggleCollingwoodOnly}
                    />
                </div>
            </div>
            <div className={props.styles.collingwoodOnly}>
                <div>
                    Upcoming Matches Only
                </div>
                <div>
                    <Switch
                        color="primary"
                        checked={props.upcomingMatchesOnly}
                        onChange={props.toggleUpcomingOnly}
                    />
                </div>
            </div>

        </div>
    </>
);

FixtureFilters.defaultProps = {
    collingwoodOnly: false,
    radioOptions: [],
    radioValue: '',
    searchByTeamName: noop,
    setRadioValue: noop,
    styles: defaultStyles,
    teamNameFilter: '',
    toggleCollingwoodOnly: noop,
    toggleUpcomingOnly: noop,
    upcomingMatchesOnly: false
};

FixtureFilters.propTypes = {
    collingwoodOnly: PropTypes.bool,
    radioOptions: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string
    })),
    radioValue: PropTypes.string,
    searchByTeamName: PropTypes.func,
    setRadioValue: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    teamNameFilter: PropTypes.string,
    toggleCollingwoodOnly: PropTypes.func,
    toggleUpcomingOnly: PropTypes.func,
    upcomingMatchesOnly: PropTypes.bool
};

export default FixtureFilters;
