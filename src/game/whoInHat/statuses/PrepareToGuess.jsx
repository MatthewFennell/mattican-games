import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import DeleteGame from '../../../common/DeleteGame/DeleteGame';
import defaultStyles from './PrepareToGuess.module.scss';
import * as helpers from '../../helpers';
import TeamsAndScore from '../../common/TeamsAndScore';
import Fade from '../../../common/Fade/Fade';
import StyledButton from '../../../common/StyledButton/StyledButton';
import { remainingCards } from './Guessing';
import JoinTeamModal from '../../common/JoinTeamModal';
import LoadingDiv from '../../../common/loadingDiv/LoadingDiv';
import * as constants from '../../../constants';

const teamHasOnlyMe = (game, myId) => {
    if (!game || !game.teams) {
        return false;
    }
    const myTeam = game.teams.find(team => team.members && team.members.includes(myId));
    if (!myTeam) {
        return false;
    }
    return myTeam.members && myTeam.members.length === 1;
};

const PrepareToGuess = props => {
    const { currentGameId, joinTeamMidgameRequest, startWhoInHatRoundRequest } = props;

    const [viewingTeams, setViewingTeams] = useState(false);
    const toggleViewingTeams = useCallback(() => {
        setViewingTeams(!viewingTeams);
    }, [viewingTeams, setViewingTeams]);

    const [joiningNewTeam, setJoiningNewTeam] = useState(false);
    const [teamToJoin, setTeamToJoin] = useState('');

    const joinTeam = useCallback(() => {
        joinTeamMidgameRequest(props.currentGameId, teamToJoin);
        setJoiningNewTeam(false);
        setTeamToJoin('');
    }, [teamToJoin, joinTeamMidgameRequest, props.currentGameId]);

    const [isStartingRound, setStartingRound] = useState(false);

    const startRound = useCallback(() => {
        startWhoInHatRoundRequest(currentGameId);
        setStartingRound(true);
    }, [currentGameId, startWhoInHatRoundRequest, setStartingRound]);

    return (
        <div className={props.styles.prepareToGuessWrapper}>
            <div className={props.styles.infoWrapper}>
                <div className={props.styles.teamText}>
                    <div>Team:</div>
                    <div className={props.styles.teamValue}>
                        {props.currentGame.activeTeam}
                    </div>
                </div>
                <div className={props.styles.teamText}>
                    <div>Remaining cards::</div>
                    <div className={props.styles.teamValue}>
                        {remainingCards(props.currentGame)}
                    </div>
                </div>
                {props.auth.uid !== props.currentGame.activeExplainer
        && (
            <div className={props.styles.waitingToStart}>
                {`Waiting for ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} to start`}
            </div>
        )}

                <div className={props.styles.buttonsWrapper}>
                    {props.auth.uid === props.currentGame.activeExplainer && (
                        <LoadingDiv isLoading={isStartingRound} isBlack isBorderRadius>
                            <div className={props.styles.startRoundButton}>
                                <StyledButton
                                    onClick={startRound}
                                    text="Start round"
                                    disabled={isStartingRound}
                                />
                            </div>
                        </LoadingDiv>
                    )}

                    {teamHasOnlyMe(props.currentGame, props.auth.uid) && (
                        <>
                            <div className={props.styles.joinTeamNewTeamButton}>
                                <StyledButton
                                    onClick={() => setJoiningNewTeam(true)}
                                    text="Join New Team"
                                />
                            </div>
                            <JoinTeamModal
                                closeModal={() => setJoiningNewTeam(false)}
                                isOpen={joiningNewTeam}
                                onChange={setTeamToJoin}
                                value={teamToJoin}
                                teams={props.currentGame.teams.filter(team => !team.members
                                    .includes(props.auth.uid))}
                                onConfirm={joinTeam}
                            />
                        </>
                    )}
                    {props.auth.uid === props.currentGame.host && (
                        <DeleteGame
                            gameId={props.currentGameId}
                            gameMode={constants.whoInHatGameMode}
                        />
                    )}
                </div>
            </div>

            <div className={props.styles.viewTeamsWrapper}>
                <Fade
                    checked={viewingTeams}
                    onChange={toggleViewingTeams}
                    includeCheckbox
                    label="View teams"
                >
                    <TeamsAndScore
                        auth={props.auth}
                        currentGame={props.currentGame}
                        showScore
                        users={props.users}
                    />
                </Fade>
            </div>
        </div>
    );
};

PrepareToGuess.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activeExplainer: '',
        activeTeam: '',
        finishTime: '',
        words: [],
        host: '',
        isCustomNames: false,
        teams: []
    },
    currentGameId: '',
    joinTeamMidgameRequest: noop,
    startWhoInHatRoundRequest: noop,
    styles: defaultStyles,
    users: {}
};

PrepareToGuess.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activeExplainer: PropTypes.string,
        activeTeam: PropTypes.string,
        finishTime: PropTypes.string,
        words: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        }))
    }),
    currentGameId: PropTypes.string,
    joinTeamMidgameRequest: PropTypes.func,
    startWhoInHatRoundRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PrepareToGuess;
