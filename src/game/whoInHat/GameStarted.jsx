import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './GameStarted.module.scss';
import * as constants from '../../constants';
import MakingTeams from './MakingTeams';
import { addTeamRequest, joinTeamRequest } from '../actions';

const GameStarted = props => {
    if (props.currentGame.status === constants.whoInHatGameStatuses.MakingTeams) {
        return (
            <MakingTeams
                addTeamRequest={props.addTeamRequest}
                currentGame={props.currentGame}
                currentGameId={props.currentGameId}
                joinTeamRequest={props.joinTeamRequest}
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
    styles: defaultStyles,
    users: {}
};

GameStarted.propTypes = {
    addTeamRequest: PropTypes.func.isRequired,
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        status: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    joinTeamRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

const mapDispatchToProps = {
    addTeamRequest,
    joinTeamRequest
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GameStarted);

export { GameStarted as GameStartedUnconnected };
