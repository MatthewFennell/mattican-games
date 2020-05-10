/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import MakingTeams from '../common/MakingTeams';
import PrepareToGuess from './PrepareToGuess';
import Guessing from './Guessing';
import RoundSummary from './RoundSummary';
import GameFinished from './GameFinished';
import {
    addTeamRequest, joinTeamRequest, addWordRequest, startWhoInHatGameRequest,
    startWhoInHatRoundRequest, gotWhoInHatWordRequest, skipWordRequest,
    trashWordRequest, loadScoreSummaryRequest, setWordConfirmedRequest,
    confirmScoreRequest, leaveWhoInHatGameRequest, joinWhoInHatTeamMidgameRequest,
    randomiseTeamsRequest
} from '../actions';
import defaultStyles from './GameStarted.module.scss';
import JoinTeamModal from '../common/JoinTeamModal';

const GameStarted = props => {
    const [teamToJoin, setTeamToJoin] = useState('');

    const joinTeam = useCallback(() => {
        props.joinWhoInHatTeamMidgameRequest(props.currentGameId, teamToJoin);
        // eslint-disable-next-line
    }, [teamToJoin, props.joinWhoInHatTeamMidgameRequest, props.currentGameId])

    const generateComponent = () => {
        if (props.currentGame.status === constants.whoInHatGameStatuses.MakingTeams) {
            return (
                <MakingTeams
                    addTeamRequest={props.addTeamRequest}
                    addWordRequest={props.addWordRequest}
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    joinTeamRequest={props.joinTeamRequest}
                    randomiseTeamsRequest={props.randomiseTeamsRequest}
                    startGameRequest={props.startWhoInHatGameRequest}
                    users={props.users}
                />
            );
        }


        if (props.currentGame.status === constants.whoInHatGameStatuses.PrepareToGuess) {
            return (
                <PrepareToGuess
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    joinWhoInHatTeamMidgameRequest={props.joinWhoInHatTeamMidgameRequest}
                    startWhoInHatRoundRequest={props.startWhoInHatRoundRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.whoInHatGameStatuses.Guessing) {
            return (
                <Guessing
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    gotWhoInHatWordRequest={props.gotWhoInHatWordRequest}
                    loadScoreSummaryRequest={props.loadScoreSummaryRequest}
                    skipWordRequest={props.skipWordRequest}
                    trashWordRequest={props.trashWordRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.whoInHatGameStatuses.RoundSummary) {
            return (
                <RoundSummary
                    auth={props.auth}
                    confirmScoreRequest={props.confirmScoreRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    setWordConfirmedRequest={props.setWordConfirmedRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.whoInHatGameStatuses.ScoreCapReached
        || props.currentGame.status === constants.whoInHatGameStatuses.NoCardsLeft) {
            return (
                <GameFinished
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    leaveWhoInHatGameRequest={props.leaveWhoInHatGameRequest}
                    users={props.users}
                />
            );
        }

        return <div>hey</div>;
    };

    return (
        <>
            {generateComponent()}
            <JoinTeamModal
                isOpen={props.currentGame.waitingToJoinTeam.includes(props.auth.uid)
                && props.currentGame.status !== constants.whoInHatGameStatuses.MakingTeams}
                onChange={setTeamToJoin}
                value={teamToJoin}
                teams={props.currentGame.teams}
                onConfirm={joinTeam}
            />
        </>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        status: '',
        teams: [],
        waitingToJoinTeam: []
    },
    currentGameId: '',
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {
    addTeamRequest: PropTypes.func.isRequired,
    addWordRequest: PropTypes.func.isRequired,
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    confirmScoreRequest: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        status: PropTypes.string,
        teams: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        })),
        waitingToJoinTeam: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    gotWhoInHatWordRequest: PropTypes.func.isRequired,
    joinTeamRequest: PropTypes.func.isRequired,
    joinWhoInHatTeamMidgameRequest: PropTypes.func.isRequired,
    leaveWhoInHatGameRequest: PropTypes.func.isRequired,
    loadScoreSummaryRequest: PropTypes.func.isRequired,
    randomiseTeamsRequest: PropTypes.func.isRequired,
    setWordConfirmedRequest: PropTypes.func.isRequired,
    skipWordRequest: PropTypes.func.isRequired,
    startWhoInHatGameRequest: PropTypes.func.isRequired,
    startWhoInHatRoundRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    trashWordRequest: PropTypes.func.isRequired,
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    addWordRequest,
    confirmScoreRequest,
    gotWhoInHatWordRequest,
    joinTeamRequest,
    joinWhoInHatTeamMidgameRequest,
    leaveWhoInHatGameRequest,
    loadScoreSummaryRequest,
    randomiseTeamsRequest,
    setWordConfirmedRequest,
    skipWordRequest,
    startWhoInHatGameRequest,
    startWhoInHatRoundRequest,
    trashWordRequest
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
