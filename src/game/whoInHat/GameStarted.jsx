/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import MakingTeams from '../common/MakingTeams';
import PrepareToGuess from './statuses/PrepareToGuess';
import Guessing from './statuses/Guessing';
import RoundSummary from './statuses/RoundSummary';
import GameFinished from './statuses/GameFinished';
import {
    addTeamRequest, joinTeamRequest, gotWordRequest, skipWordRequest,
    trashWordRequest, setWordConfirmedRequest,
    leaveUnconstrainedGameRequest, joinTeamMidgameRequest,
    randomiseTeamsRequest, realignConfirmedWords
} from '../actions';
import defaultStyles from './GameStarted.module.scss';
import JoinTeamModal from '../common/JoinTeamModal';

import {
    addWordRequest, startWhoInHatGameRequest, confirmScoreRequest,
    startWhoInHatRoundRequest, loadScoreSummaryRequest
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
                    addWordRequest={props.addWordRequest}
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    isAddingTeam={props.isAddingTeam}
                    isRandomisingTeams={props.isRandomisingTeams}
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
                    joinTeamMidgameRequest={props.joinTeamMidgameRequest}
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
                    gotWordRequest={props.gotWordRequest}
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
                    realignConfirmedWords={props.realignConfirmedWords}
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
                    leaveUnconstrainedGameRequest={props.leaveUnconstrainedGameRequest}
                    users={props.users}
                />
            );
        }

        return <div>Error. Contact Matt</div>;
    };

    return (
        <>
            <div className={props.styles.gameTitle}>
                {constants.gameModes.WhosInTheHat}
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
    gotWordRequest: PropTypes.func.isRequired,
    isAddingTeam: PropTypes.bool,
    isRandomisingTeams: PropTypes.bool,
    joinTeamRequest: PropTypes.func.isRequired,
    joinTeamMidgameRequest: PropTypes.func.isRequired,
    leaveUnconstrainedGameRequest: PropTypes.func.isRequired,
    loadScoreSummaryRequest: PropTypes.func.isRequired,
    randomiseTeamsRequest: PropTypes.func.isRequired,
    realignConfirmedWords: PropTypes.func.isRequired,
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
    gotWordRequest,
    joinTeamRequest,
    joinTeamMidgameRequest,
    leaveUnconstrainedGameRequest,
    loadScoreSummaryRequest,
    randomiseTeamsRequest,
    realignConfirmedWords,
    setWordConfirmedRequest,
    skipWordRequest,
    startWhoInHatGameRequest,
    startWhoInHatRoundRequest,
    trashWordRequest
};

const mapStateToProps = state => ({
    isAddingTeam: state.whoInHat.isAddingTeam,
    isRandomisingTeams: state.whoInHat.isRandomisingTeams
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
