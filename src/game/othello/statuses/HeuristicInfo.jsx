import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './HeuristicInfo.module.scss';
import * as queries from '../queries';

const HeuristicInfo = props => {
    const getHeuristicBreakdown = useCallback(playerNum => queries.getHeuristicBreakdown(
        props.currentGame.board, playerNum
    ), [props.currentGame.board]);

    return (
        <div className={props.styles.heuristicInfoWrapper}>
            <div className={props.styles.heuristicTitle}>
                <div className={props.styles.heuristicScoreText}>
                    Heuristic Breakdown
                </div>
            </div>

            <div className={props.styles.heuristicScores}>
                <div className={props.styles.columnOne}>
                    <div className={props.styles.invisible}>
                        a
                    </div>
                    <div>
                        Total Score
                    </div>
                    <div>
                        Corners
                    </div>
                    <div>
                        Adj Corner
                    </div>
                    <div>
                        Edges
                    </div>
                    <div>
                        Center
                    </div>
                    <div>
                        Mobility
                    </div>
                    <div>
                        Mobility #2
                    </div>
                    <div>
                        X Squares
                    </div>
                </div>

                <div className={props.styles.columnTwo}>
                    <div>White</div>
                    <div>
                        {queries.evaluatePosition(props.currentGame.board, [], 1)}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).corners}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).adjacent}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).edges}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).center}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).immediateMobility}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).potentialMobility}
                    </div>
                    <div>
                        {getHeuristicBreakdown(1).xSquare}
                    </div>
                </div>

                <div className={props.styles.columnThree}>
                    <div>Black</div>
                    <div>
                        {queries.evaluatePosition(props.currentGame.board, [], -1)}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).corners}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).adjacent}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).edges}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).center}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).immediateMobility}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).potentialMobility}
                    </div>
                    <div>
                        {getHeuristicBreakdown(-1).xSquare}
                    </div>
                </div>
            </div>


        </div>
    );
};

HeuristicInfo.defaultProps = {
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
        }
    },
    styles: defaultStyles,
    users: {}
};

HeuristicInfo.propTypes = {
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
        })
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default HeuristicInfo;
