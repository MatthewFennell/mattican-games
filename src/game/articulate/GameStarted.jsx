/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import {
    addTeamRequest, joinTeamRequest,
    trashWordRequest, randomiseTeamsRequest, gotWordRequest,
    leaveUnconstrainedGameRequest, joinTeamMidgameRequest, setWordConfirmedRequest,
    skipWordRequest, realignConfirmedWords, deleteGameRequest
} from '../actions';
import MakingTeams from '../common/MakingTeams';
import PrepareToGuess from './statuses/PrepareToGuess';
import RoundSummary from './statuses/RoundSummary';
import Guessing from './statuses/Guessing';
import GameFinished from './statuses/GameFinished';
import JoinTeamModal from '../common/JoinTeamModal';
import defaultStyles from './GameStarted.module.scss';

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
                    isAddingTeam={props.isAddingTeam}
                    isRandomisingTeams={props.isRandomisingTeams}
                    isStartingGame={props.isStartingGame}
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
                    deleteGameRequest={props.deleteGameRequest}
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
                    realignConfirmedWords={props.realignConfirmedWords}
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
            <div className={props.styles.gameTitle}>
                {constants.gameModes.Articulate}
            </div>
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
    isAddingTeam: false,
    isRandomisingTeams: false,
    isStartingGame: false,
    users: {},
    styles: defaultStyles
};

GameStarted.propTypes = {
    addTeamRequest: PropTypes.func.isRequired,
    confirmScoreRequest: PropTypes.func.isRequired,
    confirmWinner: PropTypes.func.isRequired,
    deleteGameRequest: PropTypes.func.isRequired,
    gotWordRequest: PropTypes.func.isRequired,
    leaveUnconstrainedGameRequest: PropTypes.func.isRequired,
    joinTeamRequest: PropTypes.func.isRequired,
    joinTeamMidgameRequest: PropTypes.func.isRequired,
    loadSummaryRequest: PropTypes.func.isRequired,
    randomiseTeamsRequest: PropTypes.func.isRequired,
    realignConfirmedWords: PropTypes.func.isRequired,
    setWordConfirmedRequest: PropTypes.func.isRequired,
    startGameRequest: PropTypes.func.isRequired,
    startRoundRequest: PropTypes.func.isRequired,
    skipWordRequest: PropTypes.func.isRequired,
    trashWordRequest: PropTypes.func.isRequired,
    spadeRoundWinnerRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),

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
    isAddingTeam: PropTypes.bool,
    isRandomisingTeams: PropTypes.bool,
    isStartingGame: PropTypes.bool,
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    confirmScoreRequest,
    confirmWinner,
    deleteGameRequest,
    gotWordRequest,
    leaveUnconstrainedGameRequest,
    loadSummaryRequest,
    joinTeamRequest,
    joinTeamMidgameRequest,
    randomiseTeamsRequest,
    realignConfirmedWords,
    setWordConfirmedRequest,
    skipWordRequest,
    spadeRoundWinnerRequest,
    startGameRequest,
    startRoundRequest,
    trashWordRequest
};

const mapStateToProps = state => ({
    isStartingGame: state.game.isStartingGame
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
