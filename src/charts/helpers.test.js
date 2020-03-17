import * as helpers from './helpers';

const allTeams = [
    {
        id: 'teamOne',
        team_name: 'England',
        goalsFor: 11,
        losses: 0,
        draws: 0,
        results: [
            {
                goalsFor: 2,
                week: 1,
                goalsAgainst: 2
            },
            {
                goalsFor: 1,
                week: 2,
                goalsAgainst: 0
            },
            {
                goalsFor: 8,
                week: 3,
                goalsAgainst: 4
            },
            {
                goalsFor: 25,
                week: 4,
                goalsAgainst: 15
            },
            {
                goalsFor: 5,
                week: 5,
                goalsAgainst: 20
            }
        ]
    },
    {
        id: 'teamTwo',
        team_name: 'Brazil',
        goalsFor: 3,
        losses: 1,
        draws: 2,
        results: [
            {
                goalsFor: 3,
                week: 1,
                goalsAgainst: 5
            },
            {
                goalsFor: 1,
                week: 2,
                goalsAgainst: 1
            },
            {
                goalsFor: 4,
                week: 3,
                goalsAgainst: 4
            },
            {
                goalsFor: 3,
                week: 4,
                goalsAgainst: 2
            },
            {
                goalsFor: 5,
                week: 5,
                goalsAgainst: 5
            }
        ]
    },
    {
        id: 'ID NOT INCLUDED in charts',
        team_name: 'Not included in charts',
        goalsFor: 5,
        losses: 2,
        draws: 5,
        results: [
            {
                goalsFor: 7,
                week: 1,
                goalsAgainst: 9
            },
            {
                goalsFor: 3,
                week: 2,
                goalsAgainst: 4
            },
            {
                goalsFor: 5,
                week: 3,
                goalsAgainst: 40
            },
            {
                goalsFor: 5,
                week: 3,
                goalsAgainst: 40
            },
            {
                goalsFor: 5,
                week: 3,
                goalsAgainst: 40
            }
        ]
    }
];

const teamsToBeSortedByGoalDifference = [
    {
        id: '+5 Goal Difference',
        team_name: 'England',
        goalsFor: 11,
        losses: 0,
        draws: 0,
        results: [
            {
                goalsFor: 25,
                week: 1,
                goalsAgainst: 20
            }
        ]
    },
    {
        id: '+2 goal difference in one match',
        team_name: 'Brazil',
        goalsFor: 3,
        losses: 1,
        draws: 2,
        results: [
            {
                goalsFor: 4,
                week: 1,
                goalsAgainst: 2
            }
        ]
    },
    {
        id: '+2 goal difference 2 matches',
        team_name: 'Not included in charts',
        goalsFor: 12,
        losses: 1,
        draws: 0,
        results: [
            {
                goalsFor: 3,
                week: 1,
                goalsAgainst: 4
            },
            {
                goalsFor: 9,
                week: 1,
                goalsAgainst: 6
            }
        ]
    },
    {
        id: 'last place with 2 wins',
        team_name: '2 wins',
        goalsFor: 4,
        losses: 0,
        draws: 0,
        results: [
            {
                goalsFor: 1,
                week: 1,
                goalsAgainst: 0
            },
            {
                goalsFor: 1,
                week: 2,
                goalsAgainst: 0
            }
        ]
    }
];

const edgeCase = [
    {
        id: 'teamOne',
        team_name: 'England',
        goalsFor: 0,
        losses: 0,
        draws: 0,
        results: [
            {
                goalsFor: 3,
                week: 1,
                goalsAgainst: 0
            },
            {
                goalsFor: 0,
                week: 2,
                goalsAgainst: 1
            },
            {
                goalsFor: 0,
                week: 3,
                goalsAgainst: 2
            }
        ]
    },
    {
        id: 'teamTwo',
        team_name: 'Brazil',
        goalsFor: 3,
        losses: 1,
        draws: 2,
        results: [
            {
                goalsFor: 1,
                week: 1,
                goalsAgainst: 1
            },
            {
                goalsFor: 1,
                week: 2,
                goalsAgainst: 1
            },
            {
                goalsFor: 1,
                week: 3,
                goalsAgainst: 1
            }
        ]
    },
    {
        id: 'teamThree',
        team_name: 'France',
        goalsFor: 12,
        losses: 1,
        draws: 0,
        results: [
            {
                goalsFor: 1,
                week: 1,
                goalsAgainst: 1
            },
            {
                goalsFor: 1,
                week: 2,
                goalsAgainst: 1
            },
            {
                goalsFor: 1,
                week: 3,
                goalsAgainst: 1
            }
        ]
    }
];

const activeTeams = ['teamOne', 'teamTwo'];

describe('Generating graph data for charts', () => {
    it('Goals For extending to the correct week', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'goalsFor', 5)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 3],
            [2, 1, 1],
            [3, 8, 4],
            [4, 25, 3],
            [5, 5, 5]
        ]);
    });

    it('Goals For extending to the correct week going past the number of weeks their is data for', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'goalsFor', 7)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 3],
            [2, 1, 1],
            [3, 8, 4],
            [4, 25, 3],
            [5, 5, 5],
            [6, 0, 0],
            [7, 0, 0]
        ]);
    });

    it('Goals Against extending to the correct week, missing off the final weeks', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'goalsAgainst', 3)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 5],
            [2, 0, 1],
            [3, 4, 4]
        ]);
    });

    it('Total points extending to the correct week', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'totalPoints', 5)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 1, 0],
            [2, 4, 1],
            [3, 7, 2],
            [4, 10, 5],
            [5, 10, 6]
        ]);
    });

    it('Total goals FOR extending to the correct week', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'totalGoalsFor', 5)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 3],
            [2, 3, 4],
            [3, 11, 8],
            [4, 36, 11],
            [5, 41, 16]
        ]);
    });

    it('Total goals FOR extending to the correct week extending beyond data', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'totalGoalsFor', 7)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 3],
            [2, 3, 4],
            [3, 11, 8],
            [4, 36, 11],
            [5, 41, 16],
            [6, 41, 16],
            [7, 41, 16]
        ]);
    });

    it('Total goals AGAINST extending to the correct week', () => {
        expect(helpers.findGraphData(allTeams, activeTeams, 'totalGoalsAgainst', 5)).toEqual([
            ['x', 'England', 'Brazil'],
            [1, 2, 5],
            [2, 2, 6],
            [3, 6, 10],
            [4, 21, 12],
            [5, 41, 17]
        ]);
    });
});

describe('League data generation', () => {
    it('Generates the league table', () => {
        expect(helpers.marks(5)).toEqual([
            {
                value: 1,
                label: '1'
            },
            {
                value: 2,
                label: '2'
            },
            {
                value: 3,
                label: '3'
            },
            {
                value: 4,
                label: '4'
            },
            {
                value: 5,
                label: '5'
            }
        ]);
    });
});

describe('Generates league data', () => {
    it('League array', () => {
        expect(helpers.generateLeagueTable(allTeams, 0, 5)).toEqual([
            {
                goalDifference: 0,
                wins: 3,
                draws: 1,
                losses: 1,
                points: helpers.makeBold(10),
                team: 'England',
                gamesPlayed: 5,
                score: 10,
                id: 'teamOne',
                position: helpers.makeBold(1)
            },
            {
                goalDifference: -1,
                wins: 1,
                draws: 3,
                losses: 1,
                points: helpers.makeBold(6),
                team: 'Brazil',
                gamesPlayed: 5,
                score: 6,
                id: 'teamTwo',
                position: helpers.makeBold(2)
            },
            {
                goalDifference: -108,
                wins: 0,
                draws: 0,
                losses: 5,
                points: helpers.makeBold(0),
                team: 'Not included in charts',
                gamesPlayed: 5,
                score: 0,
                id: 'ID NOT INCLUDED in charts',
                position: helpers.makeBold(3)
            }
        ]);
    });

    it('Filters on correct tiebreakers', () => {
        expect(helpers.generateLeagueTable(teamsToBeSortedByGoalDifference, 0, 3)).toEqual([
            {
                goalDifference: 2,
                wins: 2,
                draws: 0,
                losses: 0,
                points: helpers.makeBold(6),
                team: '2 wins',
                gamesPlayed: 2,
                score: 6,
                id: 'last place with 2 wins',
                position: helpers.makeBold(1)
            },
            {
                goalDifference: 5,
                wins: 1,
                draws: 0,
                losses: 0,
                points: helpers.makeBold(3),
                team: 'England',
                gamesPlayed: 1,
                score: 3,
                id: '+5 Goal Difference',
                position: helpers.makeBold(2)
            },
            {
                goalDifference: 2,
                wins: 1,
                draws: 0,
                losses: 0,
                points: helpers.makeBold(3),
                team: 'Brazil',
                gamesPlayed: 1,
                score: 3,
                id: '+2 goal difference in one match',
                position: helpers.makeBold(3)
            },
            {
                goalDifference: 2,
                wins: 1,
                draws: 0,
                losses: 1,
                points: helpers.makeBold(3),
                team: 'Not included in charts',
                gamesPlayed: 2,
                score: 3,
                id: '+2 goal difference 2 matches',
                position: helpers.makeBold(4)
            }
        ]);
    });

    it('Filters on correct tiebreakers edgecases', () => {
        expect(helpers.generateLeagueTable(edgeCase, 0, 3)).toEqual([
            {
                goalDifference: 0,
                wins: 1,
                draws: 0,
                losses: 2,
                points: helpers.makeBold(3),
                team: 'England',
                gamesPlayed: 3,
                score: 3,
                id: 'teamOne',
                position: helpers.makeBold(1)
            },
            {
                goalDifference: 0,
                wins: 0,
                draws: 3,
                losses: 0,
                points: helpers.makeBold(3),
                team: 'France',
                gamesPlayed: 3,
                score: 3,
                id: 'teamThree',
                position: helpers.makeBold(2)
            },
            {
                goalDifference: 0,
                wins: 0,
                draws: 3,
                losses: 0,
                points: helpers.makeBold(3),
                team: 'Brazil',
                gamesPlayed: 3,
                score: 3,
                id: 'teamTwo',
                position: helpers.makeBold(3)
            }
        ]);
    });
});
