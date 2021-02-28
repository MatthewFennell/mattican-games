import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './MakingTeams.module.scss';
import * as helpers from '../helpers';
import StyledButton from '../../common/StyledButton/StyledButton';
import TextInput from '../../common/TextInput/TextInput';
import SuccessModal from '../../common/modal/SuccessModal';
import TeamsAndScore from './TeamsAndScore';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';
import Dropdown from '../../common/dropdown/Dropdown';
import * as constants from '../../constants';

const playerExistsInTeam = (game, playerId) => game.teams
    .some(team => team.members.includes(playerId));

const findPlayersNotInTeam = game => game.currentPlayers
    .filter(playerId => !playerExistsInTeam(game, playerId));

const MakingTeams = props => {
    const [isKicking, setIsKicking] = useState(false);
    const [userBeingKicked, setUserBeingKicked] = useState('');

    const closeKickingModal = () => {
        setIsKicking(false);
    };

    const confirmKickUser = () => {
        setIsKicking(false);
        props.kickUserRequest(props.currentGameId, userBeingKicked);
        setUserBeingKicked('');
    };

    const [addingTeam, setAddingTeam] = useState(false);
    const [teamName, setTeamName] = useState('');

    const [addingWord, setAddingWord] = useState(false);
    const [word, setWord] = useState('');

    const closeAddingWord = useCallback(() => {
        setAddingWord(false);
        setWord('');
    }, [setAddingWord, setWord]);

    const closeAddingTeams = useCallback(() => {
        setAddingTeam(false);
        setTeamName('');
    }, [setAddingTeam, setTeamName]);

    const confirmAddNewTeam = useCallback(() => {
        props.addTeamRequest(props.currentGameId, teamName);
        setAddingTeam(false);
        setTeamName('');
        // eslint-disable-next-line
    }, [teamName, props.currentGameId, setAddingTeam, setTeamName, props.addTeamRequest]);

    const confirmAddWord = useCallback(() => {
        props.addWordRequest(props.currentGameId, word);
        setWord('');
        // eslint-disable-next-line
    }, [word, props.currentGameId, setAddingWord, setWord, props.addWordRequest]);

    const joinTeam = useCallback(teamNameToJoin => {
        props.joinTeamRequest(props.currentGameId, teamNameToJoin);
        // eslint-disable-next-line
    }, [props.joinTeamRequest])

    const [randomisingTeams, setRandomisingTeams] = useState(false);
    const [numberOfRandomTeams, setNumberOfRandomTeams] = useState(2);

    const closeRandomisingTeams = useCallback(() => {
        setRandomisingTeams(false);
        setNumberOfRandomTeams(2);
    }, [setRandomisingTeams, setNumberOfRandomTeams]);

    const randomiseTeams = useCallback(() => {
        props.randomiseTeamsRequest(props.currentGameId, parseInt(numberOfRandomTeams, 10));
        setRandomisingTeams(false);
        // eslint-disable-next-line
    }, [numberOfRandomTeams, setRandomisingTeams, props.currentGameId])

    const shouldDisableButtons = useCallback(() => (props.isRandomisingTeams
        || props.isStartingGame || props.isAddingTeam
        || props.isLeavingGame || props.isKickingUser),
    [props.isRandomisingTeams, props.isStartingGame, props.isAddingTeam,
        props.isLeavingGame, props.isKickingUser]);

    const startGame = useCallback(() => {
        props.startGameRequest(props.currentGameId);
        // eslint-disable-next-line
    }, [props.currentGameId])

    return (
        <div className={props.styles.makingTeamsWrapper}>
            <div className={props.styles.makingTeamsHeader}>
                {findPlayersNotInTeam(props.currentGame).length > 0 ? 'Teams are currently being selected'
                    : `Waiting for ${helpers.mapUserIdToName(props.users, props.currentGame.host)} to start the game`}
            </div>
            <div className={props.styles.clickTeamToJoin}>
                Click on a team to join it
            </div>
            <div className={props.styles.createTeamWrapper}>
                {props.currentGame.host === props.auth.uid && (
                    <LoadingDiv
                        isLoading={props.isStartingGame}
                        isNoPadding
                        isRed
                        isBorderRadius
                    >
                        <div className={props.styles.startGame}>
                            <StyledButton
                                onClick={startGame}
                                text="Start Game"
                                disabled={shouldDisableButtons()}
                            />
                        </div>
                    </LoadingDiv>
                )}
                <LoadingDiv
                    isLoading={props.isAddingTeam}
                    isNoPadding
                    isRed
                    isBorderRadius
                >
                    <div>
                        <StyledButton
                            onClick={() => setAddingTeam(true)}
                            text="Add team"
                            disabled={shouldDisableButtons()}
                        />
                    </div>
                </LoadingDiv>
                {props.currentGame.host === props.auth.uid && (
                    <LoadingDiv
                        isLoading={props.isRandomisingTeams}
                        isNoPadding
                        isRed
                        isBorderRadius
                    >
                        <div className={props.styles.startGame}>
                            <StyledButton
                                onClick={() => setRandomisingTeams(true)}
                                text="Randomise Teams"
                                disabled={shouldDisableButtons()}
                            />
                        </div>
                    </LoadingDiv>
                )}
                {props.currentGame.isCustomNames && (
                    <div>
                        <StyledButton
                            onClick={() => setAddingWord(true)}
                            text="Add word"
                            disabled={shouldDisableButtons()}
                        />
                    </div>
                ) }
                <LoadingDiv
                    isLoading={props.isLeavingGame}
                    isNoPadding
                    isRed
                    isBorderRadius
                >
                    <div className={props.styles.startGame}>
                        <StyledButton
                            onClick={() => props.leaveUnconstrainedGameRequest(
                                props.currentGameId
                            )}
                            text="Leave Game"
                            disabled={shouldDisableButtons()}
                        />
                    </div>
                </LoadingDiv>
                {props.currentGame.host === props.auth.uid
                && props.currentGame.mode === constants.gameModes.Articulate && (
                    <LoadingDiv
                        isLoading={props.isKickingUser}
                        isNoPadding
                        isRed
                        isBorderRadius
                    >
                        <div className={props.styles.startGame}>
                            <StyledButton
                                onClick={() => setIsKicking(true)}
                                text="Kick User"
                                disabled={shouldDisableButtons()}
                            />
                        </div>
                    </LoadingDiv>
                )}
            </div>
            {props.currentGame.isCustomNames && (
                <div className={props.styles.numberOfWordsAdded}>
                    {`Number of words added: ${props.currentGame.words.length}`}
                </div>
            )}
            <div className={props.styles.playersNotInTeams}>
                <div className={props.styles.playersNotInTeamsHeader}>
                    Players not in teams
                </div>
                {findPlayersNotInTeam(props.currentGame).map(player => (
                    <div key={player}>
                        {helpers.mapUserIdToName(props.users, player) + (player === props.auth.uid ? ' (you)' : '')}
                    </div>
                ))}

            </div>

            <TeamsAndScore
                auth={props.auth}
                currentGame={props.currentGame}
                onTeamClick={joinTeam}
                users={props.users}
            />

            <SuccessModal
                backdrop
                closeModal={closeRandomisingTeams}
                error
                isOpen={randomisingTeams}
                headerMessage="Confirm Randomising Teams"
            >
                <div className={props.styles.randomiseTeamsWrapper}>

                    <div className={props.styles.numberOfRandomTeams}>
                        Maximum of 5 random teams
                    </div>

                    <TextInput onChange={setNumberOfRandomTeams} value={numberOfRandomTeams} label="Number of teams" />

                    <div className={props.styles.confirmButtons}>
                        <StyledButton
                            text="Confirm"
                            onClick={randomiseTeams}
                        />

                        <StyledButton
                            color="secondary"
                            onClick={() => setRandomisingTeams(false)}
                            text="Close"
                        />
                    </div>
                </div>
            </SuccessModal>

            <SuccessModal
                backdrop
                closeModal={closeAddingWord}
                error
                isOpen={addingWord}
                headerMessage="Enter a word to guess"
            >
                <div className={props.styles.addNewWordWrapper}>
                    <TextInput onChange={setWord} value={word} label="Choose word" />
                    <LoadingDiv
                        isLoading={props.isAddingWord}
                        isFitContent
                        isNoPadding
                        isRed
                        isBorderRadius
                    >

                        <div className={props.styles.confirmButtons}>
                            <StyledButton
                                text="Confirm"
                                onClick={confirmAddWord}
                                disabled={props.isAddingWord}
                            />

                            <StyledButton
                                color="secondary"
                                onClick={closeAddingWord}
                                text="Close"
                                disabled={props.isAddingWord}
                            />
                        </div>
                    </LoadingDiv>
                </div>
            </SuccessModal>

            <SuccessModal
                backdrop
                closeModal={closeAddingTeams}
                error
                isOpen={addingTeam}
                headerMessage="Enter a team name"
            >
                <div className={props.styles.addNewTeamWrapper}>
                    <TextInput onChange={setTeamName} value={teamName} label="Choose team name" />

                    <div className={props.styles.confirmButtons}>
                        <StyledButton
                            text="Confirm"
                            onClick={confirmAddNewTeam}
                        />

                        <StyledButton
                            color="secondary"
                            onClick={closeAddingTeams}
                            text="Cancel"
                        />
                    </div>
                </div>
            </SuccessModal>

            <SuccessModal
                backdrop
                closeModal={closeKickingModal}
                isOpen={isKicking}
                headerMessage="Kick"
            >
                <div className={props.styles.kickUser}>
                    <Dropdown
                        options={Object.keys(props.currentGame.usernameMappings)
                            .filter(x => x !== props.auth.uid).map(username => ({
                                id: username,
                                value: username,
                                text: props.currentGame.usernameMappings[username]
                            }))}
                        value={userBeingKicked}
                        onChange={val => setUserBeingKicked(val)}
                        title="Kick somebody"
                    />

                    <div className={props.styles.confirmButtons}>
                        <StyledButton
                            text="Confirm"
                            onClick={confirmKickUser}
                            disabled={!userBeingKicked}
                        />

                        <StyledButton
                            color="secondary"
                            onClick={closeKickingModal}
                            text="Cancel"
                        />
                    </div>
                </div>
            </SuccessModal>
        </div>
    );
};

MakingTeams.defaultProps = {
    auth: {
        uid: ''
    },
    addTeamRequest: noop,
    addWordRequest: noop,
    currentGame: {
        words: [],
        host: '',
        mode: '',
        isCustomNames: false,
        teams: [],
        usernameMappings: {}
    },
    currentGameId: '',
    leaveUnconstrainedGameRequest: noop,
    isAddingTeam: false,
    isAddingWord: false,
    isKickingUser: false,
    isLeavingGame: false,
    isRandomisingTeams: false,
    isStartingGame: false,
    kickUserRequest: noop,
    joinTeamRequest: noop,
    randomiseTeamsRequest: noop,
    startGameRequest: noop,
    styles: defaultStyles,
    users: {}
};

MakingTeams.propTypes = {
    addTeamRequest: PropTypes.func,
    addWordRequest: PropTypes.func,
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        words: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.shape({})
        ]),
        host: PropTypes.string,
        mode: PropTypes.string,
        isCustomNames: PropTypes.bool,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        usernameMappings: PropTypes.objectOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    leaveUnconstrainedGameRequest: PropTypes.func,
    isAddingTeam: PropTypes.bool,
    isAddingWord: PropTypes.bool,
    isKickingUser: PropTypes.bool,
    isLeavingGame: PropTypes.bool,
    isRandomisingTeams: PropTypes.bool,
    isStartingGame: PropTypes.bool,
    kickUserRequest: PropTypes.func,
    joinTeamRequest: PropTypes.func,
    randomiseTeamsRequest: PropTypes.func,
    startGameRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default MakingTeams;
