import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameFinished.module.scss';
import StyledButton from '../../../common/StyledButton/StyledButton';

const GameFinished = props => (
    <div className={props.styles.gameFinishedWrapper}>
        <div className={props.styles.rematchButton}>
            <StyledButton
                text="Rematch"
                onClick={props.rematchRequest}
            />
        </div>

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
    rematchRequest: noop,
    styles: defaultStyles
};

GameFinished.propTypes = {
    leaveGameRequest: PropTypes.func,
    rematchRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default GameFinished;
