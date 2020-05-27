import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameFinished.module.scss';
import StyledButton from '../../../common/StyledButton/StyledButton';

const GameFinished = props => (
    <div className={props.styles.gameFinishedWrapper}>
        {props.hasResigned && (
            <div className={props.styles.opponentResigned}>
                Opponent resigned
            </div>
        )}
        <div className={props.styles.leaveButton}>
            <StyledButton
                text="Leave"
                onClick={props.leaveGameRequest}
            />
        </div>
    </div>
);

GameFinished.defaultProps = {
    leaveGameRequest: noop,
    hasResigned: false,
    styles: defaultStyles
};

GameFinished.propTypes = {
    leaveGameRequest: PropTypes.func,
    hasResigned: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default GameFinished;
