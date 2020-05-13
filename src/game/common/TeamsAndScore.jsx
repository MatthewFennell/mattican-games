import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './TeamsAndScore.module.scss';
import * as helpers from '../helpers';

const TeamsAndScore = props => (
    props.currentGame.teams.slice().sort(props.sortingMethod).map((team, index) => (
        <div
            className={classNames({
                [props.styles.teamWrapper]: true,
                [props.styles[`team-${index % 5}`]]: true
            })}
            tabIndex={0}
            role="button"
            onClick={() => props.onTeamClick(team.name)}
            key={team.name}
        >
            <div className={props.styles.teamName}>
                {team.name + (props.showScore ? ` (${team.score} points)` : '')}
            </div>
            {team.members.map(member => (
                <div>
                    {helpers.mapUserIdToName(props.users, member) + (member === props.auth.uid ? ' (you)' : '')}
                </div>
            ))}
        </div>
    ))
);

TeamsAndScore.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activeExplainer: '',
        activeTeam: '',
        host: '',
        isCustomNames: false,
        teams: []
    },
    onTeamClick: noop,
    showScore: false,
    sortingMethod: noop,
    styles: defaultStyles,
    users: {}
};

TeamsAndScore.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        teams: PropTypes.arrayOf(PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string,
            score: PropTypes.number
        }))
    }),
    onTeamClick: PropTypes.func,
    showScore: PropTypes.bool,
    sortingMethod: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default TeamsAndScore;
