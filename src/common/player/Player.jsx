import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import fp from 'lodash/fp';
import classNames from 'classnames';
import defaultStyles from './Player.module.scss';
import defaultShirtStyles from './ShirtStyles.module.scss';
import playerPositionsObject from './TeamMappings';
import * as constants from '../../constants';

const generateClassName = (inactive, team, position) => {
    if (inactive) {
        return 'inactive';
    }
    if (position === constants.POSITIONS.GOALKEEPER) {
        return fp.flow(fp.get(team), fp.get(constants.POSITIONS.GOALKEEPER))(playerPositionsObject) || 'DEFAULT_GOALKEEPER';
    }
    return fp.flow(fp.get(team), fp.get(constants.POSITIONS.OUTFIELD))(playerPositionsObject) || 'DEFAULT_OUTFIELD';
};

const Player = props => (
    <div className={props.styles.playerWrapper} onClick={props.onClick} role="button" tabIndex={0}>
        <div className={props.styles.hover}>
            <div
                className={classNames({
                    [props.shirtStyles[generateClassName(
                        props.inactive, props.team, props.position
                    )]]: true,
                    [props.shirtStyles.player]: true
                })}
            />
            <div className={props.styles.playerInfoWrapper}>
                <div className={props.styles.nameText}>
                    {props.name}
                </div>
                <div className={props.styles.additionalInfo}>
                    {props.additionalInfo}
                </div>
                {props.isCaptain && props.showCaptain && (
                    <div className={props.styles.captain}>
                            C
                    </div>
                )}
            </div>
        </div>
    </div>
);

Player.defaultProps = {
    additionalInfo: '',
    inactive: false,
    isCaptain: false,
    name: '',
    onClick: noop,
    position: '',
    shirtStyles: defaultShirtStyles,
    showCaptain: false,
    styles: defaultStyles,
    team: ''
};

Player.propTypes = {
    additionalInfo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    inactive: PropTypes.bool,
    isCaptain: PropTypes.bool,
    name: PropTypes.string,
    onClick: PropTypes.func,
    position: PropTypes.string,
    shirtStyles: PropTypes.objectOf(PropTypes.string),
    showCaptain: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string),
    team: PropTypes.string
};

export default Player;

// colors - https://mdbootstrap.com/docs/react/css/colors/#text-colors
