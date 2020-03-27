import React from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import defaultStyles from './HitlerBoard.module.scss';

const HitlerBoard = props => {
    const renderLiberalCell = (cell, numberOfLiberals) => {
        if (cell <= numberOfLiberals) {
            return <div className={props.styles.liberalPlayed}>L</div>;
        }
        return <div className={props.styles.liberalNotPlayed}>X</div>;
    };

    if (props.numberOfPlayers <= 6) {
        return (
            <div className={props.styles.boardWrapper}>
                <div className={props.styles.fascistBoard}>
                    <div className={props.styles.firstCell}>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div className={props.styles.hitlerZone}>4</div>
                    <div className={props.styles.hitlerZone}>5</div>
                    <div className={props.styles.hitlerZone}>6</div>
                </div>
                <div className={props.styles.liberalBoard}>
                    <div className={props.styles.firstCell}>{renderLiberalCell(1, props.numberOfLiberals)}</div>
                    <div>{renderLiberalCell(2, props.numberOfLiberals)}</div>
                    <div>{renderLiberalCell(3, props.numberOfLiberals)}</div>
                    <div>{renderLiberalCell(4, props.numberOfLiberals)}</div>
                    <div>{renderLiberalCell(5, props.numberOfLiberals)}</div>
                </div>
            </div>
        );
    }

    if (props.numberOfPlayers <= 8) {
        return <div>8 players</div>;
    }

    return (
        <div>10 players</div>
    );
};


HitlerBoard.defaultProps = {
    numberOfLiberals: 0,
    numberOfPlayers: 0,
    styles: defaultStyles
};

HitlerBoard.propTypes = {
    numberOfLiberals: PropTypes.number,
    numberOfPlayers: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default HitlerBoard;
