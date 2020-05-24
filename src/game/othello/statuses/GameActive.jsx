import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './GameActive.module.scss';
import Board from '../View/Board';

const mapBoardToArrays = board => Object.values(board);

const GameActive = props => {
    console.log('current game board', props.currentGame.board);

    const actualBoard = mapBoardToArrays(props.currentGame.board);

    return (
        <div className={props.styles.gameActiveWrapper}>

            <Board />

            {/* <div className={props.styles.boardWrapper}>
                {Array.from(Array(8)).map(() => (
                    <div className={props.styles.rowWrapper}>
                        {Array.from(Array(8)).map(() => (
                            <div className={props.styles.cellWrapper}>
                                <Cell />
                            </div>
                        ))}
                    </div>
                ))}
            </div> */}
        </div>

    );
};

GameActive.defaultProps = {
    auth: {
        uid: ''
    },
    currentGame: {
        board: {
            rowOne: [],
            rowTwo: [],
            rowThree: [],
            rowFour: [],
            rowFive: [],
            rowSix: [],
            rowSeven: [],
            rowEight: []
        }
    },
    currentGameId: '',
    styles: defaultStyles,
    users: {}
};

GameActive.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    currentGame: PropTypes.shape({
        board: PropTypes.objectOf(PropTypes.shape({
            rowOne: PropTypes.arrayOf(PropTypes.number),
            rowTwo: PropTypes.arrayOf(PropTypes.number),
            rowThree: PropTypes.arrayOf(PropTypes.number),
            rowFour: PropTypes.arrayOf(PropTypes.number),
            rowFive: PropTypes.arrayOf(PropTypes.number),
            rowSix: PropTypes.arrayOf(PropTypes.number),
            rowSeven: PropTypes.arrayOf(PropTypes.number),
            rowEight: PropTypes.arrayOf(PropTypes.number)
        }))
    }),
    currentGameId: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameActive;
