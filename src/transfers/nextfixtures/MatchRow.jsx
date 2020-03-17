import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { MDBIcon } from 'mdbreact';
import defaultStyles from './MatchRow.module.scss';
import { renderCollegeIcon } from './helpers';

const covertToTime = d => moment(d, 'DD-MM-YYYY hh:mm').format('HH:mm');

const isLive = date => moment()
    .isAfter(moment(date, 'DD-MM-YYYY hh:mm'))
    && moment().isBefore(moment(date, 'DD-MM-YYYY hh:mm').add(100, 'minutes'));

const renderTeamName = name => {
    if (!name) {
        return '';
    }
    if (name.includes('St. Hild & St. Bede')) {
        return name.replace('St. Hild & St. Bede', 'Hild Bede');
    }
    if (name.includes('Josephine Butler')) {
        return name.replace('Josephine Butler', 'Butler');
    }
    if (name.includes('St. Cuthbert\'s')) {
        return name.replace('St. Cuthbert\'s', 'Cuths');
    }
    return name;
};


const MatchRow = props => (
    <div className={props.styles.matchWrapper} key={`${props.match.teamOne}-${props.match.teamTwo}`}>
        <div className={props.styles.leftHand}>
            {isLive(props.match.time) && (
                <div className={props.styles.matchLive}>
                    <div className={props.styles.greenIcon}>
                        <FiberManualRecordIcon fontSize="small" />
                    </div>
                    <div className={props.styles.liveText}>
                        Live
                    </div>
                </div>
            )}
            <div className={props.styles.teamOne}>
                {props.match.isCup
                && (
                    <div className={props.styles.trophyIcon}>
                        <MDBIcon icon="trophy" />
                    </div>
                ) }
                {renderTeamName(props.match.teamOne)}
                {props.showCollegeCrest
                && renderCollegeIcon(props.match.teamOne, props.styles)}
            </div>
        </div>
        <div className={props.styles.versus}>
            VS
        </div>
        <div className={props.styles.rightHand}>

            <div className={props.styles.teamTwo}>
                {props.showCollegeCrest
                && renderCollegeIcon(props.match.teamTwo, props.styles)}
                {renderTeamName(props.match.teamTwo)}
            </div>
            <div className={props.styles.info}>
                {covertToTime(props.match.time)}
            </div>
        </div>
    </div>
);

MatchRow.defaultProps = {
    match: {},
    showCollegeCrest: false,
    styles: defaultStyles
};

MatchRow.propTypes = {
    match: PropTypes.shape({
        isCup: PropTypes.bool,
        teamOne: PropTypes.string,
        result: PropTypes.string,
        teamTwo: PropTypes.string,
        location: PropTypes.string,
        time: PropTypes.string,
        completed: PropTypes.bool,
        league: PropTypes.string
    }),
    showCollegeCrest: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default MatchRow;
