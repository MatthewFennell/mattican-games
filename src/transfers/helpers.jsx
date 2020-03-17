import React from 'react';
import classNames from 'classnames';
import * as constants from '../constants';
import { invalidFormations } from './invalidFormations';

const error = (code, message) => ({
    code,
    message
});

const {
    GOALKEEPER, DEFENDER, MIDFIELDER, ATTACKER
} = constants.POSITIONS;

export const canAddPlayer = (player, currentTeam) => {
    const numInPos = position => currentTeam
        .filter(x => x.position === position && !x.inactive).length;

    const playerPos = player.position.toUpperCase();

    if (currentTeam.filter(x => !x.inactive).length >= 11) {
        return error('overflow', 'Too many players');
    }

    if (currentTeam.find(x => x.id === player.id && x.name === player.name)) {
        return error('already-found', 'You already have that player selected');
    }

    if (numInPos(playerPos) >= constants.maxPerPosition[playerPos]) {
        return error('max in pos', 'Too many players in that position');
    }

    const numGoal = (numInPos(GOALKEEPER)) + (playerPos === GOALKEEPER ? 1 : 0);
    const numDef = (numInPos(DEFENDER)) + (playerPos === DEFENDER ? 1 : 0);
    const numMid = (numInPos(MIDFIELDER)) + (playerPos === MIDFIELDER ? 1 : 0);
    const numAtt = (numInPos(ATTACKER)) + (playerPos === ATTACKER ? 1 : 0);

    let invalidFormation = false;

    invalidFormations.forEach(formation => {
        if (formation.toString() === [numGoal, numDef, numMid, numAtt].toString()) {
            invalidFormation = true;
        }
    });

    if (invalidFormation) {
        return error('formation', 'Invalid Formation');
    }

    return true;
};


export const canReplacePlayer = (oldPlayer, newPlayer, currentTeam) => {
    if (currentTeam.find(x => x.id === oldPlayer.id) === undefined) {
        return error('not-found', 'You are trying to remove a player not in your team');
    }
    return canAddPlayer(newPlayer, currentTeam.filter(x => x.id !== oldPlayer.id));
};

export const headerCell = (sortBy, activeSort, styles, expectedSort) => (
    <div
        className={classNames({
            [styles.activeSort]: activeSort === expectedSort,
            [styles.headerCell]: true
        })}
        role="button"
        tabIndex={0}
        onClick={() => sortBy(expectedSort)}
    >
        {expectedSort}
    </div>
);

export const desktopColumns = (sortBy, activeSort, styles) => [
    {
        id: 'name',
        name: 'Name',
        label: headerCell(sortBy, activeSort, styles, 'Name'),
        fixed: true,
        active: true,
        align: 'center'
    },
    {
        id: 'position',
        name: 'Pos',
        label: headerCell(sortBy, activeSort, styles, 'Position'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'team',
        name: 'Team',
        label: headerCell(sortBy, activeSort, styles, 'Team'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'price',
        name: 'Price',
        label: headerCell(sortBy, activeSort, styles, 'Price'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'points',
        name: 'Points',
        label: headerCell(sortBy, activeSort, styles, 'Points'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'goals',
        name: 'Goals',
        label: headerCell(sortBy, activeSort, styles, 'Goals'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'assists',
        name: 'Assists',
        label: headerCell(sortBy, activeSort, styles, 'Assists'),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'previousScore',
        name: 'Previous Score',
        label: headerCell(sortBy, activeSort, styles, 'PreviousScore'),
        fixed: false,
        active: true,
        align: 'center'
    }
];
