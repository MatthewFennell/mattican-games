import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import ConfirmModal from '../../../common/modal/ConfirmModal';
import SuccessModal from '../../../common/modal/SuccessModal';
import StyledButton from '../../../common/StyledButton/StyledButton';
import TextInput from '../../../common/TextInput/TextInput';
import defaultStyles from './PlayingGame.module.scss';

const PlayingGame = props => {
    const [isDeleteGame, setIsDeleteGame] = useState(false);
    const [isAddingWords, setIsAddingWords] = useState(false);
    const [isStartNextRound, setIsStartNextRound] = useState(false);
    const [wordToAdd, setWordToAdd] = useState('');
    const [isLeavingGame, setIsLeavingGame] = useState(false);
    const closeLeavingGame = () => setIsLeavingGame(false);
    const openLeavingGame = () => setIsLeavingGame(true);

    const closeStartNextRound = () => setIsStartNextRound(false);
    const openStartNextRound = () => setIsStartNextRound(true);

    const deleteGame = () => props.deleteGameRequest(props.currentGameId);

    const openDeleteGameModal = () => setIsDeleteGame(true);
    const closeDeleteGameModal = () => setIsDeleteGame(false);

    const leaveGame = () => props.leaveGameRequest(props.currentGameId);

    const startNextRound = () => {
        props.startGameRequest(props.currentGameId);
        setIsStartNextRound(false);
    };
    const openAddingWords = () => setIsAddingWords(true);
    const closeAddingWords = () => setIsAddingWords(false);

    const addWord = useCallback(() => {
        props.addWordRequest(props.currentGameId, wordToAdd);
        setWordToAdd('');
        // eslint-disable-next-line
    }, [wordToAdd, props.addWordRequest]);

    const { objectsToDraw, usedWords } = props.currentGame;

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
                <LoadingDiv
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Add Words"
                        onClick={openAddingWords}
                        color="primary"
                        isFullWidth
                    />
                </LoadingDiv>
                {props.currentGame.host === props.auth.uid
            && (
                <LoadingDiv
                    isLoading={props.isStartingGame}
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Start next round"
                        onClick={openStartNextRound}
                        color="secondary"
                        disabled={props.isStartingGame}
                        isFullWidth
                    />
                </LoadingDiv>
            )}

                {props.currentGame.host === props.auth.uid
            && (
                <LoadingDiv
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Delete Game"
                        onClick={openDeleteGameModal}
                        color="primary"
                        isFullWidth
                    />
                </LoadingDiv>
            )}
                <LoadingDiv
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Leave Game"
                        onClick={openLeavingGame}
                        color="secondary"
                        disabled={props.isLeavingGame}
                        isFullWidth
                    />
                </LoadingDiv>
            </div>
            {props.auth.uid !== props.currentGame.host && (
                <div className={props.styles.drawTitle}>
                    The host can start the next round
                </div>
            )}
            <ConfirmModal
                closeModal={closeDeleteGameModal}
                isOpen={isDeleteGame}
                isLoading={props.isDestroyingGame}
                cancel={closeDeleteGameModal}
                submit={deleteGame}
                text="Are you sure you want to destroy the game?"
            />
            <ConfirmModal
                closeModal={closeLeavingGame}
                isOpen={isLeavingGame}
                isLoading={props.isLeavingGame}
                cancel={closeLeavingGame}
                submit={leaveGame}
                text="Are you sure you want to leave the game?"
            />
            <ConfirmModal
                closeModal={closeStartNextRound}
                isOpen={isStartNextRound}
                isLoading={props.isStartingGame}
                cancel={closeStartNextRound}
                submit={startNextRound}
                text="Are you sure you want to start the next round"
            />
            <SuccessModal
                backdrop
                closeModal={closeAddingWords}
                isOpen={isAddingWords}
                headerMessage="Add words"
            >
                <div className={props.styles.addNewTeamWrapper}>

                    <div className={props.styles.drawTitle}>
                        {`Number of words in current pool ${objectsToDraw.filter(word => !usedWords.includes(word)).length}`}
                    </div>

                    <TextInput onChange={setWordToAdd} value={wordToAdd} label="Word" />

                    <div className={props.styles.confirmButtons}>
                        <LoadingDiv
                            isLoading={props.isAddingWord}
                            isBorderRadius
                            isBlack
                            isNoPadding
                            isFitContent
                        >
                            <StyledButton
                                text="Confirm"
                                onClick={addWord}
                                disabled={!wordToAdd}
                            />

                            <StyledButton
                                color="secondary"
                                onClick={closeAddingWords}
                                text="Cancel"
                            />
                        </LoadingDiv>
                    </div>
                </div>
            </SuccessModal>
        </>
    );
};

PlayingGame.defaultProps = {
    addWordRequest: noop,
    auth: {
        uid: ''
    },
    currentGame: {
        blindUser: '',
        host: '',
        objectsToDraw: [],
        usedWords: [],
        wordToDraw: '',
        round: 0
    },
    deleteGameRequest: noop,
    currentGameId: '',
    isAddingWord: false,
    isDestroyingGame: false,
    isStartingGame: false,
    isLeavingGame: false,
    leaveGameRequest: noop,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

PlayingGame.propTypes = {
    addWordRequest: PropTypes.func,
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        blindUser: PropTypes.string,
        host: PropTypes.string,
        objectsToDraw: PropTypes.arrayOf(PropTypes.string),
        usedWords: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
        wordToDraw: PropTypes.string,
        round: PropTypes.number
    }),
    currentGameId: PropTypes.string,
    isAddingWord: PropTypes.bool,
    isDestroyingGame: PropTypes.bool,
    deleteGameRequest: PropTypes.func,
    isStartingGame: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    leaveGameRequest: PropTypes.func,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PlayingGame;
