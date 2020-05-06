/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import {
    addTeamRequest, joinTeamRequest, addWordRequest, startWhoInHatGameRequest,
    trashWordRequest, randomiseTeamsRequest, startArticulateGameRequest,
    startArticulateRoundRequest, skipWordArticulateRequest, gotArticulateWordRequest,
    trashArticulateWordRequest, loadArticulateSummaryRequest, setArticulateWordConfirmedRequest,
    confirmArticulateScoreRequest, spadeRoundWinnerRequest
} from '../actions';
import defaultStyles from './GameStarted.module.scss';
import MakingTeams from '../whoInHat/MakingTeams';
import PrepareToGuess from './PrepareToGuess';
import Guessing from './Guessing';
import RoundSummary from './RoundSummary';

const GameStarted = props => {
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
                    startGameRequest={props.startArticulateGameRequest}
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
                    startArticulateRoundRequest={props.startArticulateRoundRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.articulateGameStatuses.Guessing) {
            return (
                <Guessing
                    auth={props.auth}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    gotArticulateWordRequest={props.gotArticulateWordRequest}
                    loadArticulateSummaryRequest={props.loadArticulateSummaryRequest}
                    skipWordArticulateRequest={props.skipWordArticulateRequest}
                    spadeRoundWinnerRequest={props.spadeRoundWinnerRequest}
                    trashArticulateWordRequest={props.trashArticulateWordRequest}
                    users={props.users}
                />
            );
        }

        if (props.currentGame.status === constants.articulateGameStatuses.RoundSummary) {
            return (
                <RoundSummary
                    auth={props.auth}
                    confirmArticulateScoreRequest={props.confirmArticulateScoreRequest}
                    currentGame={props.currentGame}
                    currentGameId={props.currentGameId}
                    setArticulateWordConfirmedRequest={props.setArticulateWordConfirmedRequest}
                    users={props.users}
                />
            );
        }

        return <div>hey</div>;
    };

    return (
        <>
            {generateComponent()}
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
    confirmArticulateScoreRequest: PropTypes.func.isRequired,
    gotArticulateWordRequest: PropTypes.func.isRequired,
    joinTeamRequest: PropTypes.func.isRequired,
    loadArticulateSummaryRequest: PropTypes.func.isRequired,
    randomiseTeamsRequest: PropTypes.func.isRequired,
    setArticulateWordConfirmedRequest: PropTypes.func.isRequired,
    startArticulateGameRequest: PropTypes.func.isRequired,
    startArticulateRoundRequest: PropTypes.func.isRequired,
    startWhoInHatGameRequest: PropTypes.func.isRequired,
    skipWordArticulateRequest: PropTypes.func.isRequired,
    trashArticulateWordRequest: PropTypes.func.isRequired,
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
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    addWordRequest,
    confirmArticulateScoreRequest,
    gotArticulateWordRequest,
    joinTeamRequest,
    loadArticulateSummaryRequest,
    randomiseTeamsRequest,
    setArticulateWordConfirmedRequest,
    skipWordArticulateRequest,
    spadeRoundWinnerRequest,
    startArticulateGameRequest,
    startArticulateRoundRequest,
    startWhoInHatGameRequest,
    trashArticulateWordRequest,
    trashWordRequest
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
