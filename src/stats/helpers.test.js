import * as helpers from './helpers';

const players = [
    {
        goals: 5,
        player_id: 'playerOne',
        assists: 10,
        week: 2,
        penaltyMisses: 5,
        manOfTheMatch: true,
        dickOfTheDay: true,
        ownGoals: 1,
        cleanSheet: true,
        yellowCard: true,
        penaltySaves: 1,
        redCard: true
    },
    {
        goals: 4,
        player_id: 'playerOne',
        assists: 1,
        week: 3,
        penaltyMisses: 7,
        manOfTheMatch: true,
        dickOfTheDay: true,
        ownGoals: 1,
        cleanSheet: true,
        yellowCard: true,
        penaltySaves: 1,
        redCard: true
    }
];

const playersWithFalseValues = [
    {
        goals: 5,
        player_id: 'playerOne',
        assists: 10,
        week: 2,
        penaltyMisses: 5,
        manOfTheMatch: true,
        dickOfTheDay: true,
        ownGoals: 1,
        cleanSheet: true,
        yellowCard: true,
        penaltySaves: 1,
        redCard: true
    },
    {
        goals: 4,
        player_id: 'playerOne',
        assists: 1,
        week: 3,
        penaltyMisses: 7,
        manOfTheMatch: false,
        dickOfTheDay: false,
        ownGoals: 0,
        cleanSheet: false,
        yellowCard: false,
        penaltySaves: 0,
        redCard: false
    }
];

describe('Stats max / min week operations', () => {
    it('Generates correct week tickers', () => {
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

    it('Fetches data for the correct weeks efficiently either side of weeks', () => {
        expect(helpers.weeksToRequest(0, 10, [4, 5, 6])).toEqual([
            {
                min: 0,
                max: 3
            },
            {
                min: 7,
                max: 10
            }
        ]);
    });

    it('Fetches data for the correct weeks when initially empty', () => {
        expect(helpers.weeksToRequest(0, 10, [])).toEqual([
            {
                min: 0,
                max: 10
            }
        ]);
    });

    it('Fetches data for the correct weeks efficiently on larger side', () => {
        expect(helpers.weeksToRequest(0, 10, [0, 1, 2, 3])).toEqual([
            {
                min: 4,
                max: 10
            }
        ]);
    });

    it('Fetches data for the correct weeks efficiently in between gaps', () => {
        expect(helpers.weeksToRequest(0, 15, [1, 4, 7, 10])).toEqual([
            {
                min: 0,
                max: 0
            },
            {
                min: 2,
                max: 3
            },
            {
                min: 5,
                max: 6
            },
            {
                min: 8,
                max: 9
            },
            {
                min: 11,
                max: 15
            }
        ]);
    });
});

describe('Combining player stats together', () => {
    it('Combines stats together for the same player', () => {
        expect(helpers.combinePlayers(players, 0, 5)).toEqual([
            {
                goals: 9,
                player_id: 'playerOne',
                assists: 11,
                week: 3,
                penaltyMisses: 12,
                manOfTheMatch: 2,
                dickOfTheDay: 2,
                ownGoals: 2,
                cleanSheet: 2,
                yellowCard: 2,
                penaltySaves: 2,
                redCard: 2
            }
        ]);
    });

    it('Does not include stats out of week range', () => {
        expect(helpers.combinePlayers(players, 0, 2)).toEqual([
            {
                goals: 5,
                player_id: 'playerOne',
                assists: 10,
                week: 2,
                penaltyMisses: 5,
                manOfTheMatch: 1,
                dickOfTheDay: 1,
                ownGoals: 1,
                cleanSheet: 1,
                yellowCard: 1,
                penaltySaves: 1,
                redCard: 1
            }
        ]);
    });

    it('Players including false values', () => {
        expect(helpers.combinePlayers(playersWithFalseValues, 0, 5)).toEqual([
            {
                goals: 9,
                player_id: 'playerOne',
                assists: 11,
                week: 3,
                penaltyMisses: 12,
                manOfTheMatch: 1,
                dickOfTheDay: 1,
                ownGoals: 1,
                cleanSheet: 1,
                yellowCard: 1,
                penaltySaves: 1,
                redCard: 1
            }
        ]);
    });
});
