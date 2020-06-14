import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameFinished.module.scss';
import StyledButton from '../../../common/StyledButton/StyledButton';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';

const GameFinished = props => {
    const { leaveGameRequest } = props;

    const [hasLeft, setHasLeft] = useState(false);

    const leaveGame = useCallback(() => {
        setHasLeft(true);
        leaveGameRequest();
    }, [setHasLeft, leaveGameRequest]);

    return (
        <div className={props.styles.gameFinishedWrapper}>
            {props.hasResigned && (
                <div className={props.styles.opponentResigned}>
                    Opponent resigned
                </div>
            )}
            <LoadingDiv isLoading={hasLeft} isBlack isBorderRadius isFitContent>
                <div className={props.styles.leaveButton}>
                    <StyledButton
                        text="Leave"
                        onClick={leaveGame}
                        diabled={hasLeft}
                    />
                </div>
            </LoadingDiv>
        </div>
    );
};

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
