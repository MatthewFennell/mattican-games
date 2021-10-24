import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import TextInput from '../../../common/TextInput/TextInput';
import defaultStyles from './JoinNextRound.module.scss';
import SuccessModal from '../../../common/modal/SuccessModal';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import StyledButton from '../../../common/StyledButton/StyledButton';

const JoinNextRound = props => {
    const [isAddingWords, setIsAddingWords] = useState(false);
    const [wordToAdd, setWordToAdd] = useState('');

    const leaveGame = () => props.leaveGameRequest(props.currentGameId);
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
            <div className={props.styles.joinNextRound}>
                {`You will join the next round. They are drawing: ${props.currentGame.wordToDraw}`}
            </div>
            <div className={props.styles.leaveGame}>
                <LoadingDiv
                    isLoading={props.isLeavingGame}
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Add Words"
                        onClick={openAddingWords}
                        color="primary"
                    />
                    <StyledButton
                        text="Leave Game"
                        onClick={leaveGame}
                        color="secondary"
                        disabled={props.isLeavingGame}
                    />
                </LoadingDiv>
            </div>
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

JoinNextRound.defaultProps = {
    auth: {
        uid: ''
    },
    addWordRequest: noop,
    currentGame: {
        host: '',
        objectsToDraw: [],
        wordToDraw: '',
        usedWords: []
    },
    currentGameId: '',
    isAddingWord: false,
    isLeavingGame: false,
    leaveGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

JoinNextRound.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    addWordRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        host: PropTypes.string,
        status: PropTypes.string,
        objectsToDraw: PropTypes.arrayOf(PropTypes.string),
        usedWords: PropTypes.arrayOf(PropTypes.string),
        wordToDraw: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    isAddingWord: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    leaveGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default JoinNextRound;
