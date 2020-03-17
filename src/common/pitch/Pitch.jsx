/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './Pitch.module.scss';
import Player from '../player/Player';
import Spinner from '../spinner/Spinner';
import * as constants from '../../constants';

const Pitch = props => {
    const numberOfSpareSpots = position => {
        const numAttIHaveToAdd = Math.max(constants.minPerPosition.ATTACKER - props.activeTeam.filter(x => x.position === 'ATTACKER').length, 0);
        const numMidIHaveToAdd = Math.max(constants.minPerPosition.MIDFIELDER - props.activeTeam.filter(x => x.position === 'MIDFIELDER').length, 0);
        const numDefIHaveToAdd = Math.max(constants.minPerPosition.DEFENDER - props.activeTeam.filter(x => x.position === 'DEFENDER').length, 0);
        const numGkIHaveToAdd = Math.max(constants.minPerPosition.GOALKEEPER - props.activeTeam.filter(x => x.position === 'GOALKEEPER').length, 0);

        if (position === 'ATTACKER') {
            return 11 - props.activeTeam.filter(x => !x.inactive).length - numMidIHaveToAdd - numDefIHaveToAdd - numGkIHaveToAdd;
        }
        if (position === 'MIDFIELDER') {
            return 11 - props.activeTeam.filter(x => !x.inactive).length - numAttIHaveToAdd - numDefIHaveToAdd - numGkIHaveToAdd;
        }
        if (position === 'DEFENDER') {
            return 11 - props.activeTeam.filter(x => !x.inactive).length - numAttIHaveToAdd - numMidIHaveToAdd - numGkIHaveToAdd;
        }
        return 11 - props.activeTeam.filter(x => !x.inactive).length - numAttIHaveToAdd - numMidIHaveToAdd - numDefIHaveToAdd;
    };

    const renderPlayers = position => props.activeTeam
        .filter(player => player.position === position).map(player => (
            <Player
                additionalInfo={props.additionalInfo(player)}
                isCaptain={props.captain === player.id}
                name={player.name}
                onClick={() => props.onPlayerClick(player)}
                showCaptain={props.showCaptain}
                key={player.name}
                team={player.team}
                position={position}
            />
        ));

    const calculateToRender = (maxInRow, pos) => {
        const numInRow = props.activeTeam.filter(x => x.position === pos).length;
        const numSpareSpots = numberOfSpareSpots(pos);
        const numToRender = Math.min(maxInRow - numInRow, numSpareSpots);
        const players = [];
        for (let x = 0; x < numToRender; x += 1) {
            players.push(<Player
                additionalInfo=""
                inactive
                name="No player selected"
                onClick={() => props.onPlayerClick({ position: pos })}
                team={null}
                key={x}
            />);
        }
        return players;
    };

    return (
        <div className={props.styles.pitchBackground}>
            {props.loading ? (
                <div className={props.styles.loadingSpinner}>
                    <Spinner color="secondary" />
                </div>
            )
                : (
                    <>
                        <div className={props.styles.goalKeepers}>
                            {renderPlayers('GOALKEEPER')}
                            {calculateToRender(props.maxInPos.GOALKEEPER, 'GOALKEEPER')}
                        </div>
                        <div className={props.styles.defenders}>
                            {renderPlayers('DEFENDER')}
                            {calculateToRender(props.maxInPos.DEFENDER, 'DEFENDER')}
                        </div>
                        <div className={props.styles.midfielders}>
                            {renderPlayers('MIDFIELDER')}
                            {calculateToRender(props.maxInPos.MIDFIELDER, 'MIDFIELDER')}
                        </div>

                        <div className={props.styles.attackers}>
                            {renderPlayers('ATTACKER')}
                            {calculateToRender(props.maxInPos.ATTACKER, 'ATTACKER')}
                        </div>
                    </>
                )}
        </div>
    );
};

Pitch.defaultProps = {
    activeTeam: [],
    additionalInfo: noop,
    captain: '',
    loading: false,
    maxInPos: {
        GOALKEEPER: 1,
        DEFENDER: 4,
        MIDFIELDER: 4,
        ATTACKER: 2
    },
    onPlayerClick: noop,
    showCaptain: false,
    styles: defaultStyles
};

Pitch.propTypes = {
    activeTeam: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        position: PropTypes.string,
        team: PropTypes.string
    })),
    additionalInfo: PropTypes.func,
    captain: PropTypes.string,
    loading: PropTypes.bool,
    maxInPos: PropTypes.shape({
        GOALKEEPER: PropTypes.number,
        DEFENDER: PropTypes.number,
        MIDFIELDER: PropTypes.number,
        ATTACKER: PropTypes.number
    }),
    onPlayerClick: PropTypes.func,
    showCaptain: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Pitch;
