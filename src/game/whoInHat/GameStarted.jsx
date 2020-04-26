import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
import MakingTeams from './MakingTeams';
import PrepareToGuess from './PrepareToGuess';
import Guessing from './Guessing';
import RoundSummary from './RoundSummary';
import {
    addTeamRequest, joinTeamRequest, addWordRequest, startWhoInHatGameRequest,
    startWhoInHatRoundRequest, gotWhoInHatWordRequest, skipWordRequest,
    trashWordRequest, loadScoreSummaryRequest, setWordConfirmedRequest,
    confirmScoreRequest
} from '../actions';

const GameStarted = props => {
    if (props.currentGame.status === constants.whoInHatGameStatuses.MakingTeams) {
        return (
            <MakingTeams
                addTeamRequest={props.addTeamRequest}
                addWordRequest={props.addWordRequest}
                auth={props.auth}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                joinTeamRequest={props.joinTeamRequest}
                startWhoInHatGameRequest={props.startWhoInHatGameRequest}
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

    return (
        <div>
       Hey
        </div>
    );
};

GameStarted.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        status: ''
    },
    currentGameId: '',
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
        status: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    gotWhoInHatWordRequest: PropTypes.func.isRequired,
    joinTeamRequest: PropTypes.func.isRequired,
    loadScoreSummaryRequest: PropTypes.func.isRequired,
    setWordConfirmedRequest: PropTypes.func.isRequired,
    skipWordRequest: PropTypes.func.isRequired,
    startWhoInHatGameRequest: PropTypes.func.isRequired,
    startWhoInHatRoundRequest: PropTypes.func.isRequired,
    trashWordRequest: PropTypes.func.isRequired,
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    addWordRequest,
    confirmScoreRequest,
    gotWhoInHatWordRequest,
    joinTeamRequest,
    loadScoreSummaryRequest,
    setWordConfirmedRequest,
    skipWordRequest,
    startWhoInHatGameRequest,
    startWhoInHatRoundRequest,
    trashWordRequest
};

export default connect(null, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
