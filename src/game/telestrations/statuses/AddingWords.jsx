import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';
import { noop } from 'lodash';
import { mapUserIdToName } from '../../helpers';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import TextInput from '../../../common/TextInput/TextInput';
import StyledButton from '../../../common/StyledButton/StyledButton';
import defaultStyles from './AddingWords.module.scss';

const AddingWords = props => {
    const [wordToAdd, setWordToAdd] = useState('');

    const addWord = useCallback(() => {
        props.addWordRequest(props.currentGameId, wordToAdd);
        setWordToAdd('');
    }, [wordToAdd, props.addWordRequest]);

    const startGame = () => {
        props.startGameRequest(props.currentGameId);
    };

    console.log('isStartingGame', props.isStartingGame);

    return (
        <>
            <div className={props.styles.addCustomWords}>
                Add custom words to draw. You can add more later
            </div>
            <div className={props.styles.addWordsTextInput}>
                <TextInput
                // icon={textInputConstants.textInputIcons.email}
                    label="Word to add"
                    onChange={setWordToAdd}
                    value={wordToAdd}
                    iconColor="secondary"
                />
            </div>
            <div className={props.styles.addWordButton}>
                <StyledButton
                    text="Add Word"
                    onClick={addWord}
                    disabled={!wordToAdd}
                />
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
    isStartingGame: PropTypes.bool,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default AddingWords;
