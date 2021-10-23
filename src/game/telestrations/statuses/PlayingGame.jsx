import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import ConfirmModal from '../../../common/modal/ConfirmModal';
import StyledButton from '../../../common/StyledButton/StyledButton';
import defaultStyles from './PlayingGame.module.scss';

const PlayingGame = props => {
    const [isDeleteGame, setIsDeleteGame] = useState(false);

    const deleteGame = () => props.deleteGameRequest(props.currentGameId);

    const openDeleteGameModal = () => setIsDeleteGame(true);
    const closeDeleteGameModal = () => setIsDeleteGame(false);

    const leaveGame = () => props.leaveGameRequest(props.currentGameId);

    const startNextRound = () => props.startGameRequest(props.currentGameId);

    return (
        <>
            <div className={props.styles.drawTitle}>
                {`Draw the object! - Round ${props.currentGame.round}`}
            </div>
            {props.auth.uid !== props.currentGame.blindUser ? (
                <div className={props.styles.itemToDraw}>
                    {`Item to draw: ${props.currentGame.wordToDraw}`}
                </div>
            ) : (
                <div className={props.styles.itemToDraw}>
                    You do not know what the item is. Blend in!
                </div>
            )}

            <div className={props.styles.playingButtons}>
                {props.currentGame.host === props.auth.uid
            && (
                <LoadingDiv
                    isLoading={props.isStartingGame}
                    isBorderRadius
                    isBlack
                    isNoPadding
                >
                    <StyledButton
                        text="Start next round"
                        onClick={startNextRound}
                        color="primary"
                        disabled={props.isStartingGame}
                    />
                </LoadingDiv>
            )}
                <LoadingDiv
                    isLoading={props.isLeavingGame}
                    isBorderRadius
                    isBlack
                    isNoPadding
                >
                    <StyledButton
                        text="Leave Game"
                        onClick={leaveGame}
                        color="secondary"
                        disabled={props.isLeavingGame}
                    />
                </LoadingDiv>
                {props.currentGame.host === props.auth.uid
            && (
                <StyledButton
                    text="Delete Game"
                    onClick={openDeleteGameModal}
                    color="primary"
                />
            )}
            </div>
            <ConfirmModal
                closeModal={closeDeleteGameModal}
                isOpen={isDeleteGame}
                isLoading={props.isDestroyingGame}
                cancel={closeDeleteGameModal}
                submit={deleteGame}
                text="Are you sure you want to destroy the game?"
            />
        </>
    );
};

PlayingGame.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        blindUser: '',
        host: '',
        wordToDraw: '',
        round: 0
    },
    deleteGameRequest: noop,
    currentGameId: '',
    isDestroyingGame: false,
    isLeavingGame: false,
    leaveGameRequest: noop,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

PlayingGame.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        blindUser: PropTypes.string,
        host: PropTypes.string,
        status: PropTypes.string,
        wordToDraw: PropTypes.string,
        round: PropTypes.number
    }),
    currentGameId: PropTypes.string,
    deleteGameRequest: PropTypes.func,
    isDestroyingGame: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    leaveGameRequest: PropTypes.func,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PlayingGame;
