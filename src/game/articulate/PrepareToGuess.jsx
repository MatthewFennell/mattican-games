import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import fp from 'lodash/fp';
import defaultStyles from './PrepareToGuess.module.scss';
import * as helpers from '../helpers';
import TeamsAndScore from '../whoInHat/TeamsAndScore';
import Fade from '../../common/Fade/Fade';
import StyledButton from '../../common/StyledButton/StyledButton';
import { getCategory } from './helpers';

const findCategory = game => {
    const teamToFind = game.temporaryTeam || game.activeTeam;
    const score = fp.get('score')(game.teams.find(team => team.name === teamToFind));
    return getCategory(score);
};

const PrepareToGuess = props => {
    const [viewingTeams, setViewingTeams] = useState(false);
    const toggleViewingTeams = useCallback(() => {
        setViewingTeams(!viewingTeams);
    }, [viewingTeams, setViewingTeams]);

    return (
        <div className={props.styles.prepareToGuessWrapper}>
            <div className={props.styles.prepareToGuessHeader}>
                {props.currentGame.isSpadeRound ? 'All teams play this round!' : `Next team: ${props.currentGame.temporaryTeam || props.currentGame.activeTeam}`}
            </div>
            <div className={props.styles.categoryToExplain}>
                {`Category: ${findCategory(props.currentGame)}`}
            </div>
            {props.auth.uid !== props.currentGame.activeExplainer
        && (
            <div className={props.styles.waitingToStart}>
                {`Waiting for ${helpers.mapUserIdToName(props.users, props.currentGame.activeExplainer)} to start`}
            </div>
        )}

            <div className={props.styles.buttonsWrapper}>
                {props.auth.uid === props.currentGame.activeExplainer && (
                    <div className={props.styles.startRoundButton}>
                        <StyledButton
                            onClick={() => props.startArticulateRoundRequest(props.currentGameId)}
                            text="Start round"
                        />
                    </div>
                )}
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
        isSpadeRound: false,
        words: [],
        host: '',
        isCustomNames: false,
        teams: [],
        temporaryTeam: ''
    },
    currentGameId: '',
    startArticulateRoundRequest: noop,
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
        isSpadeRound: PropTypes.bool,
        words: PropTypes.arrayOf(PropTypes.string),
        host: PropTypes.string,
        isCustomNames: PropTypes.bool,
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        })),
        temporaryTeam: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    startArticulateRoundRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default PrepareToGuess;
