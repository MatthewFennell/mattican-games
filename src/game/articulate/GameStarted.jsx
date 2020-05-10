/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import {
    addTeamRequest, joinTeamRequest,
    trashWordRequest, randomiseTeamsRequest, gotWordRequest,
    leaveUnconstrainedGameRequest, joinTeamMidgameRequest, setWordConfirmedRequest,
    skipWordRequest
} from '../actions';
import MakingTeams from '../common/MakingTeams';
import PrepareToGuess from './statuses/PrepareToGuess';
import RoundSummary from './statuses/RoundSummary';
import Guessing from './statuses/Guessing';
import GameFinished from './statuses/GameFinished';
import JoinTeamModal from '../common/JoinTeamModal';

import {
    confirmScoreRequest, startGameRequest,
    startRoundRequest,
    loadSummaryRequest,
    spadeRoundWinnerRequest, confirmWinner
} from './actions';

const GameStarted = props => {
    const [teamToJoin, setTeamToJoin] = useState('');

    const joinTeam = useCallback(() => {
        props.joinTeamMidgameRequest(props.currentGameId, teamToJoin);
        // eslint-disable-next-line
    }, [teamToJoin, props.joinTeamMidgameRequest, props.currentGameId])


    const generateComponent = () => {
        if (props.currentGame.status === constants.whoInHatGameStatuses.MakingTeams) {
            return (
                <MakingTeams
                    addTeamRequest={props.addTeamRequest}
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    joinTeamRequest={props.joinTeamRequest}
                    randomiseTeamsRequest={props.randomiseTeamsRequest}
                    startGameRequest={props.startGameRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.articulateGameStatuses.PrepareToGuess) {
            return (
                <PrepareToGuess
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    startRoundRequest={props.startRoundRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.articulateGameStatuses.Guessing) {
            return (
                <Guessing
                    auth={props.auth}
                    confirmScoreRequest={props.confirmScoreRequest}
                    confirmWinner={props.confirmWinner}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    gotWordRequest={props.gotWordRequest}
                    loadSummaryRequest={props.loadSummaryRequest}
                    skipWordRequest={props.skipWordRequest}
                    spadeRoundWinnerRequest={props.spadeRoundWinnerRequest}
                    trashWordRequest={props.trashWordRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.articulateGameStatuses.RoundSummary) {
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
        if (props.currentGame.status === constants.articulateGameStatuses.GameFinished) {
            return (
                <GameFinished
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    leaveUnconstrainedGameRequest={props.leaveUnconstrainedGameRequest}
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
    users: {}
};

GameStarted.propTypes = {
    addTeamRequest: PropTypes.func.isRequired,
    confirmScoreRequest: PropTypes.func.isRequired,
    confirmWinner: PropTypes.func.isRequired,
    gotWordRequest: PropTypes.func.isRequired,
    leaveUnconstrainedGameRequest: PropTypes.func.isRequired,
    joinTeamRequest: PropTypes.func.isRequired,
    joinTeamMidgameRequest: PropTypes.func.isRequired,
    loadSummaryRequest: PropTypes.func.isRequired,
    randomiseTeamsRequest: PropTypes.func.isRequired,
    setWordConfirmedRequest: PropTypes.func.isRequired,
    startGameRequest: PropTypes.func.isRequired,
    startRoundRequest: PropTypes.func.isRequired,
    skipWordRequest: PropTypes.func.isRequired,
    trashWordRequest: PropTypes.func.isRequired,
    spadeRoundWinnerRequest: PropTypes.func.isRequired,

    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        status: PropTypes.string,
        teams: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        })),
        waitingToJoinTeam: PropTypes.arrayOf(PropTypes.string)
    }),
    currentGameId: PropTypes.string,
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    confirmScoreRequest,
    confirmWinner,
    gotWordRequest,
    leaveUnconstrainedGameRequest,
    loadSummaryRequest,
    joinTeamRequest,
    joinTeamMidgameRequest,
    randomiseTeamsRequest,
    setWordConfirmedRequest,
    skipWordRequest,
    spadeRoundWinnerRequest,
    startGameRequest,
    startRoundRequest,
    trashWordRequest
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
