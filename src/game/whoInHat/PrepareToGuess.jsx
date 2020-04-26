import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './PrepareToGuess.module.scss';
import * as helpers from '../helpers';
import TeamsAndScore from './TeamsAndScore';
import Fade from '../../common/Fade/Fade';
import StyledButton from '../../common/StyledButton/StyledButton';


const PrepareToGuess = props => {
    const [viewingTeams, setViewingTeams] = useState(false);
    const toggleViewingTeams = useCallback(() => {
        setViewingTeams(!viewingTeams);
    }, [viewingTeams, setViewingTeams]);

    return (
        <div className={props.styles.prepareToGuessWrapper}>
            <div className={props.styles.prepareToGuessHeader}>
                {`The next team to go is ${props.currentGame.activeTeam}`}
            </div>
            {props.auth.uid !== props.currentGame.activeExplainer
        && (
            <div className={props.styles.waitingToStart}>
                {`Waiting for ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} to start`}
            </div>
        )}

            {props.auth.uid === props.currentGame.activeExplainer && (
                <div className={props.styles.startRoundButton}>
                    <StyledButton
                        onClick={() => props.startWhoInHatRoundRequest(props.currentGameId)}
                        text="Start round"
                    />
                </div>
            )}

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
        finishTime: null,
        words: [],
        host: '',
        isCustomNames: false,
        teams: []
    },
    currentGameId: '',
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
    startWhoInHatRoundRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PrepareToGuess;
