import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import StyledButton from '../../../common/StyledButton/StyledButton';
import TextInput from '../../../common/TextInput/TextInput';
import { mapUserIdToName } from '../../helpers';
import defaultStyles from './AddingWords.module.scss';

const AddingWords = props => {
    const [wordToAdd, setWordToAdd] = useState('');

    const addWord = useCallback(() => {
        props.addWordRequest(props.currentGameId, wordToAdd);
        setWordToAdd('');
        // eslint-disable-next-line
    }, [wordToAdd, props.addWordRequest]);

    const startGame = () => {
        props.startGameRequest(props.currentGameId);
    };

    return (
        <>
            <div className={props.styles.addCustomWords}>
                Add custom words to draw. You can add more later
            </div>
            <div className={props.styles.addWordsTextInput}>
                <TextInput
                    label="Word to add"
                    onChange={setWordToAdd}
                    value={wordToAdd}
                    iconColor="secondary"
                />
            </div>
            <div className={props.styles.addWordButton}>
                <LoadingDiv
                    isMargin
                    isLoading={props.isAddingWord}
                    isBorderRadius
                    isBlack
                    isNoPadding
                    isFitContent
                >
                    <StyledButton
                        text="Add Word"
                        onClick={addWord}
                        disabled={!wordToAdd}
                    />
                </LoadingDiv>
            </div>
            <div className={props.styles.wordsInPool}>
                {`Current number of words in the pool: ${props.currentGame.objectsToDraw.length}`}
            </div>

            {props.currentGame.host === props.auth.uid
            && (
                <div className={props.styles.addWordButton}>
                    <LoadingDiv
                        isMargin
                        isLoading={props.isStartingGame}
                        isBorderRadius
                        isBlack
                        isNoPadding
                        isFitContent
                    >
                        <StyledButton
                            text="Start game"
                            onClick={startGame}
                            disabled={props.isStartingGame}
                            color="secondary"
                        />
                    </LoadingDiv>
                </div>
            )}
            {props.currentGame.host !== props.auth.uid
            && (
                <div className={props.styles.waitingForHost}>
                    {`Waiting for ${mapUserIdToName(props.users, props.currentGame.host)} to start the round`}
                </div>
            )}
        </>
    );
};

AddingWords.defaultProps = {
    auth: {
        uid: ''
    },
    addWordRequest: noop,
    currentGame: {
        host: '',
        objectsToDraw: []
    },
    currentGameId: '',
    isStartingGame: false,
    isAddingWord: false,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

AddingWords.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    addWordRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        host: PropTypes.string,
        status: PropTypes.string,
        objectsToDraw: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    isAddingWord: PropTypes.bool,
    isStartingGame: PropTypes.bool,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default AddingWords;
