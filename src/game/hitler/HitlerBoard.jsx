import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import Looks3Icon from '@material-ui/icons/Looks3';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import defaultStyles from './HitlerBoard.module.scss';
import Bullet from './testBullet.png';

const HitlerBoard = props => {
    const renderLiberalCell = (cell, numberOfLiberals) => {
        if (cell <= numberOfLiberals) {
            return <div className={props.styles.liberalPlayed}>L</div>;
        }
        return <div className={props.styles.liberalNotPlayed}>X</div>;
    };

    const renderFascistCell = (cell, numberOfFascists, numberOfPlayers) => {
        if (cell <= numberOfFascists) {
            return <div className={props.styles.fascistPlayed}>F</div>;
        }

        if ((cell === 1 && numberOfPlayers >= 9) || (cell === 2 && numberOfPlayers >= 7)) {
            return <div className={props.styles.fascistNotPlayedWithIcon}><SearchIcon fontSize="large" /></div>;
        }

        if (cell === 3 && numberOfPlayers <= 6) {
            return <div className={props.styles.fascistNotPlayedWithIcon}><Looks3Icon fontSize="large" /></div>;
        }

        if (cell === 3) {
            return <div className={props.styles.fascistNotPlayedWithIcon}><StarHalfIcon fontSize="large" /></div>;
        }

        if (cell === 4 || cell === 5) {
            return (
                <div className={props.styles.bulletImageWrapper}>
                    <img src={Bullet} className={props.styles.bulletImage} alt="Bullet" />
                </div>
            );
        }

        return <div className={props.styles.fascistNotPlayed}>N</div>;
    };

    return (
        <div className={props.styles.boardWrapper}>
            <div className={props.styles.fascistBoard}>
                <div className={props.styles.firstCell}>
                    {renderFascistCell(1, props.numberOfFascists, props.numberOfPlayers)}

                </div>
                <div>{renderFascistCell(2, props.numberOfFascists, props.numberOfPlayers)}</div>
                <div>{renderFascistCell(3, props.numberOfFascists, props.numberOfPlayers)}</div>
                <div className={props.styles.hitlerZone}>
                    {renderFascistCell(4, props.numberOfFascists, props.numberOfPlayers)}
                </div>
                <div className={props.styles.hitlerZone}>
                    {renderFascistCell(5, props.numberOfFascists, props.numberOfPlayers)}
                </div>
                <div className={props.styles.hitlerZone}>
                    {renderFascistCell(6, props.numberOfFascists, props.numberOfPlayers)}

                </div>
            </div>
            <div className={props.styles.liberalBoard}>
                <div className={props.styles.firstCell}>
                    {renderLiberalCell(1, props.numberOfLiberals)}

                </div>
                <div>{renderLiberalCell(2, props.numberOfLiberals)}</div>
                <div>{renderLiberalCell(3, props.numberOfLiberals)}</div>
                <div>{renderLiberalCell(4, props.numberOfLiberals)}</div>
                <div>{renderLiberalCell(5, props.numberOfLiberals)}</div>
            </div>
        </div>
    );
};


HitlerBoard.defaultProps = {
    numberOfFascists: 0,
    numberOfLiberals: 0,
    numberOfPlayers: 0,
    styles: defaultStyles
};

HitlerBoard.propTypes = {
    numberOfFascists: PropTypes.number,
    numberOfLiberals: PropTypes.number,
    numberOfPlayers: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default HitlerBoard;
