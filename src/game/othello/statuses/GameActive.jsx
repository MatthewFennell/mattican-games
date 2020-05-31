import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './GameActive.module.scss';
import GameInfo from './GameInfo';
import PreboardLogic from './PreboardLogic';

const GameActive = props => (
    <div className={props.styles.gameActiveWrapper}>
        <PreboardLogic
            currentGame={props.currentGame}
            currentGameId={props.currentGameId}
            placeDiscRequest={props.placeDiscRequest}
        />

        <GameInfo
            auth={props.auth}
            currentGame={props.currentGame}
            leaveGameRequest={props.leaveGameRequest}
            users={props.users}
        />
    </div>
);

GameActive.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        activePlayer: 1,
        board: {
            rowZero: [],
            rowOne: [],
            rowTwo: [],
            rowThree: [],
            rowFour: [],
            rowFive: [],
            rowSix: [],
            rowSeven: []
        },
        hasFinished: false,
        playerBlack: '',
        playerWhite: ''
    },
    currentGameId: '',
    leaveGameRequest: noop,
    placeDiscRequest: noop,
    styles: defaultStyles,
    users: {}
};

GameActive.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        activePlayer: PropTypes.number,
        board: PropTypes.shape({
            rowZero: PropTypes.arrayOf(PropTypes.number),
            rowOne: PropTypes.arrayOf(PropTypes.number),
            rowTwo: PropTypes.arrayOf(PropTypes.number),
            rowThree: PropTypes.arrayOf(PropTypes.number),
            rowFour: PropTypes.arrayOf(PropTypes.number),
            rowFive: PropTypes.arrayOf(PropTypes.number),
            rowSix: PropTypes.arrayOf(PropTypes.number),
            rowSeven: PropTypes.arrayOf(PropTypes.number)
        }),
        hasFinished: PropTypes.bool,
        playerBlack: PropTypes.string,
        playerWhite: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    leaveGameRequest: PropTypes.func,
    placeDiscRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameActive;
