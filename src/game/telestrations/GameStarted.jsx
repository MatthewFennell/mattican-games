/* eslint-disable react/no-unused-prop-types */
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import { destroyGameRequest, leaveGameRequest } from '../actions';
import SuccessModal from '../../common/modal/SuccessModal';
import { addWordRequest, startGameRequest, editNumberOfSpies } from './actions';
import { mapUserIdToName } from '../helpers';
import defaultStyles from './GameStarted.module.scss';
import AddingWords from './statuses/AddingWords';
import JoinNextRound from './statuses/JoinNextRound';
import PlayingGame from './statuses/PlayingGame';
import StyledButton from '../../common/StyledButton/StyledButton';
import TextInput from '../../common/TextInput/TextInput';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';

const convertToString = items => {
    let string = '';
    items.forEach((item, index) => {
        if (index === items.length - 1) {
            string += item;
        } else {
            string = `${string + item}, `;
        }
    });
    return string;
};

const GameStarted = props => {
    const [isNumSpiesOpen, setIsNumSpiesOpen] = React.useState(false);
    const openNumSpies = () => setIsNumSpiesOpen(true);
    const closeNumSpies = () => {
        setIsNumSpiesOpen(false)
        setNumSpies(props.currentGame.numberOfSpies)
    };
    const [numSpies, setNumSpies] = React.useState(props.currentGame.numberOfSpies)
    const editSpies = React.useCallback(() => {
        props.editNumberOfSpies(props.currentGameId, numSpies)
        setIsNumSpiesOpen(false)
        // eslint-disable-next-line
    }, [props.currentGameId, numSpies])
    const generateComponent = () => {
        if (props.currentGame.usersToJoinNextRound.includes(props.auth.uid)) {
            return (
                <JoinNextRound
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingWord={props.isAddingWord}
                    leaveGameRequest={props.leaveGameRequest}
                    isLeavingGame={props.isLeavingGame}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.telestrationGameStatuses.AddingWords) {
            return (
                <AddingWords
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingWord={props.isAddingWord}
                    isStartingGame={props.isStartingGame}
                    startGameRequest={props.startGameRequest}
                    users={props.users}
                />
            );
        }
        if (props.currentGame.status === constants.telestrationGameStatuses.Drawing) {
            return (
                <PlayingGame
                    auth={props.auth}
                    addWordRequest={props.addWordRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    deleteGameRequest={props.destroyGameRequest}
                    isAddingWord={props.isAddingWord}
                    leaveGameRequest={props.leaveGameRequest}
                    isLeavingGame={props.isLeavingGame}
                    isStartingGame={props.isStartingGame}
                    isDestroyingGame={props.isDestroyingGame}
                    startGameRequest={props.startGameRequest}
                    users={props.users}
                />
            );
        }
        return <div>Error. Contact Matt</div>;
    };

    return (
        <>
            <div className={props.styles.gameTitle}>
                {constants.gameModes.Telestrations}
            </div>
            {generateComponent()}
            <div className={props.styles.textWrapper}>
                <div>Current players:</div>
                <div className={props.styles.textValue}>
                    {convertToString(props.currentGame.currentPlayers
                        .filter(x => !props.currentGame.usersToJoinNextRound.includes(x))
                        .map(x => mapUserIdToName(props.currentGame.usernameMappings, x)))}
                </div>
            </div>
            {props.currentGame.host === props.auth.uid && (
                <div className={props.styles.textWrapperTwo}>
                    <div>Current number of spies:</div>
                    <div className={props.styles.textValue}>
                        {props.currentGame.numberOfSpies} 
                    </div>
                </div>
            )}
            {props.currentGame.usersToJoinNextRound.length > 0
            && (
                <div className={props.styles.textWrapperTwo}>
                    <div>Players waiting to join:</div>
                    <div className={props.styles.textValue}>
                        {convertToString(props.currentGame.usersToJoinNextRound
                            .map(x => mapUserIdToName(props.currentGame.usernameMappings, x)))}
                    </div>
                </div>
            )}
            {props.currentGame.host === props.auth.uid && (
                <div className={props.styles.setNumSpies}>
                <StyledButton 
                    text='Set number of spies'
                    onClick={openNumSpies}
                />
                </div>
            )}
                <SuccessModal
                    backdrop
                    closeModal={closeNumSpies}
                    isOpen={isNumSpiesOpen || props.isEditingSpies}
                    headerMessage="Set spies"
            >
                    <div>
                        <TextInput value={numSpies} onChange={setNumSpies}/>
                        
                    <LoadingDiv isLoading={props.isEditingSpies} isBorderRadius isBlack>
                        <div className={props.styles.editSpiesButtons}>
                            <StyledButton
                                onClick={editSpies}
                                isFullWidth
                                text="Edit"
                                disabled={props.isEditingSpies}
                            />
                            <StyledButton
                                isFullWidth
                                text="Cancel"
                                color="secondary"
                                onClick={closeNumSpies}
                                disabled={props.isEditingSpies}
                            />
                        </div>
                    </LoadingDiv>
                    </div>
            </SuccessModal>
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    addWordRequest: noop,
    currentGame: {
        currentPlayers: [],
        status: '',
        usersToJoinNextRound: [],
        usernameMappings: {}
    },
    destroyGameRequest: noop,
    currentGameId: '',
    isAddingWord: false,
    isDestroyingGame: false,
    isLeavingGame: false,
    isRandomisingTeams: false,
    isStartingGame: false,
    leaveGameRequest: noop,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    addWordRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        currentPlayers: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
        usersToJoinNextRound: PropTypes.arrayOf(PropTypes.string),
        usernameMappings: PropTypes.shape({})
    }),
    currentGameId: PropTypes.string,
    destroyGameRequest: PropTypes.func,
    isAddingWord: PropTypes.bool,
    isDestroyingGame: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    isRandomisingTeams: PropTypes.bool,
    isStartingGame: PropTypes.bool,
    leaveGameRequest: PropTypes.func,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addWordRequest,
    destroyGameRequest,
    leaveGameRequest,
    startGameRequest,
    editNumberOfSpies
};

const mapStateToProps = state => ({
    isAddingWord: state.telestrations.isAddingWord,
    isDestroyingGame: state.game.isDestroyingGame,
    isLeavingGame: state.game.isLeavingGame,
    isStartingGame: state.game.isStartingGame,
    isEditingSpies: state.telestrations.isEditingSpies
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
