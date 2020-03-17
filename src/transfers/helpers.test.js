import * as helpers from './helpers';

const currentNonFullTeam = [
    {
        id: 'idOne',
        name: 'Player one',
        team: 'England',
        hasPaidSubs: true,
        goals: 0,
        price: 0,
        assists: 0,
        points: 0,
        position: 'DEFENDER',
        previousScore: 0
    }
];

const playerNotInTeam = {
    id: 'not in current not full team',
    name: 'Player one',
    position: 'GOALKEEPER'
};

const currentFullTeam = [
    {
        id: 'idOne',
        name: 'Player one',
        position: 'GOALKEEPER'
    },
    {
        id: 'idTwo',
        name: 'Player two',
        position: 'DEFENDER'
    },
    {
        id: 'idThree',
        name: 'Player three',
        position: 'DEFENDER'
    },
    {
        id: 'idFour',
        name: 'Player four',
        position: 'DEFENDER'
    },
    {
        id: 'idFive',
        name: 'Player five',
        position: 'DEFENDER'
    },
    {
        id: 'idSix',
        name: 'Player six',
        position: 'MIDFIDLER'
    },
    {
        id: 'idSeven',
        name: 'Player seven',
        position: 'MIDFIELDER'
    },
    {
        id: 'idEight',
        name: 'Player eight',
        position: 'MIDFIELDER'
    },
    {
        id: 'IdNine',
        name: 'Player nine',
        position: 'MIDFIELDER'
    },
    {
        id: 'idTen',
        name: 'Player ten',
        position: 'ATTACKER'
    },
    {
        id: 'idEleven',
        name: 'Player eleven',
        position: 'ATTACKER'
    }
];

const defenderToAdd = {
    id: 'defnederToAdd',
    position: 'Defender',
    previousScore: 0,
    name: 'Def to add',
    team: 'England',
    hasPaidSubs: true,
    goals: 0,
    price: 0,
    assists: 0,
    points: 0
};

const playerToAdd = {
    id: 'idOne',
    name: 'Player one',
    team: 'England',
    hasPaidSubs: true,
    goals: 0,
    price: 0,
    assists: 0,
    points: 0,
    position: 'DEFENDER',
    previousScore: 0
};

const playerToRemove = {
    id: 'a defender 1',
    name: 'defender 1',
    team: 'England',
    position: 'DEFENDER'
};

const teamWithGoalkeeper = [
    {
        id: 'a goalkeeper',
        name: 'some goakeeper',
        team: 'England',
        hasPaidSubs: true,
        goals: 0,
        price: 0,
        assists: 0,
        points: 0,
        position: 'GOALKEEPER',
        previousScore: 0
    }
];

const teamWithFiveDefenders = [
    {
        id: 'a defender 1',
        name: 'defender 1',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a defender 2',
        name: 'defender 2',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a defender 3',
        name: 'defender 3',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a defender 4',
        name: 'defender 4',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a defender 5',
        name: 'defender 5',
        team: 'England',
        position: 'DEFENDER'
    }
];

const teamWithFiveMidfielders = [
    {
        id: 'a MIDFIELDER 1',
        name: 'MIDFIELDER 1',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 2',
        name: 'MIDFIELDER 2',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 3',
        name: 'MIDFIELDER 3',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 4',
        name: 'MIDFIELDER 4',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 5',
        name: 'MIDFIELDER 5',
        team: 'England',
        position: 'MIDFIELDER'
    }
];

const fourDefendersFiveMidfielders = [
    {
        id: 'a DEFENDER 1',
        name: 'DEFENDER 1',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a DEFENDER 2',
        name: 'DEFENDER 2',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a DEFENDER 3',
        name: 'DEFENDER 3',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a DEFENDER 4',
        name: 'DEFENDER 4',
        team: 'England',
        position: 'DEFENDER'
    },
    {
        id: 'a MIDFIELDER 1',
        name: 'MIDFIELDER 1',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 2',
        name: 'MIDFIELDER 2',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 3',
        name: 'MIDFIELDER 3',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 4',
        name: 'MIDFIELDER 4',
        team: 'England',
        position: 'MIDFIELDER'
    },
    {
        id: 'a MIDFIELDER 5',
        name: 'MIDFIELDER 5',
        team: 'England',
        position: 'MIDFIELDER'
    }
];

const teamWithThreeAttackers = [
    {
        id: 'a ATTACKER 1',
        name: 'ATTACKER 1',
        team: 'England',
        position: 'ATTACKER'
    },
    {
        id: 'a ATTACKER 2',
        name: 'ATTACKER 2',
        team: 'England',
        position: 'ATTACKER'
    },
    {
        id: 'a ATTACKER 3',
        name: 'ATTACKER 3',
        team: 'England',
        position: 'ATTACKER'
    }
];

describe('Checking condition for whether you can add a player to current team', () => {
    it('Can add to mainly empty team', () => {
        expect(helpers.canAddPlayer(defenderToAdd, currentNonFullTeam)).toEqual(true);
    });

    it('Cannot add to full team', () => {
        expect(helpers.canAddPlayer(defenderToAdd, currentFullTeam)).toEqual({
            code: 'overflow',
            message: 'Too many players'
        });
    });

    it('Cannot add the same player twice via id and name', () => {
        expect(helpers.canAddPlayer(playerToAdd, currentNonFullTeam)).toEqual({
            code: 'already-found',
            message: 'You already have that player selected'
        });
    });

    it('Can  add the same player twice if same name different id', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, id: 'test' }), currentNonFullTeam)).toEqual(true);
    });

    it('Can not add a second goalkeeper', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, position: 'GOALKEEPER' }), teamWithGoalkeeper))
            .toEqual({
                code: 'max in pos',
                message: 'Too many players in that position'
            });
    });

    it('Can not add a 6th defender', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, position: 'DEFENDER' }), teamWithFiveDefenders))
            .toEqual({
                code: 'max in pos',
                message: 'Too many players in that position'
            });
    });

    it('Can not add a 6th midfielder', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, position: 'MIDFIELDER' }), teamWithFiveMidfielders))
            .toEqual({
                code: 'max in pos',
                message: 'Too many players in that position'
            });
    });

    it('Can not add a 4th attacker', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, position: 'ATTACKER' }), teamWithThreeAttackers))
            .toEqual({
                code: 'max in pos',
                message: 'Too many players in that position'
            });
    });

    it('Can have 5 defenders and 5 midfielders', () => {
        expect(helpers.canAddPlayer(({ ...playerToAdd, position: 'DEFENDER' }), fourDefendersFiveMidfielders))
            .toEqual({
                code: 'formation',
                message: 'Invalid Formation'
            });
    });

    it('Cannot remove a player not in your team', () => {
        expect(helpers.canReplacePlayer(playerNotInTeam, null, currentNonFullTeam))
            .toEqual({
                code: 'not-found',
                message: 'You are trying to remove a player not in your team'
            });
    });

    it('Can replace a defender with a defender', () => {
        expect(helpers.canReplacePlayer(playerToRemove, playerToAdd, teamWithFiveDefenders))
            .toEqual(true);
    });
});


describe('Rendering desktop columns', () => {
    it('Generates desktop columns', () => {
        expect(JSON.stringify(helpers.desktopColumns(() => {}, () => {}, 'styles')))
            .toEqual(JSON.stringify([
                {
                    id: 'name',
                    name: 'Name',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Name'),
                    fixed: true,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'position',
                    name: 'Pos',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Position'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'team',
                    name: 'Team',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Team'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'price',
                    name: 'Price',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Price'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'points',
                    name: 'Points',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Points'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'goals',
                    name: 'Goals',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Goals'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'assists',
                    name: 'Assists',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'Assists'),
                    fixed: false,
                    active: true,
                    align: 'center'
                },
                {
                    id: 'previousScore',
                    name: 'Previous Score',
                    label: helpers.headerCell(() => {}, () => {}, 'styles', 'PreviousScore'),
                    fixed: false,
                    active: true,
                    align: 'center'
                }
            ]));
    });
});
