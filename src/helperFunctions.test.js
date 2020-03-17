import * as helpers from './helperFunctions';

const fixturesNotSortedByDate = [
    {
        teamOne: 'Josephine Butler C',
        result: 'vs',
        teamTwo: 'Collingwood J',
        location: 'Rubber Crumb 3 (Track)',
        time: '08/02/2020 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    },
    {
        teamOne: 'Collingwood A',
        result: 'vs',
        teamTwo: 'Butler C',
        location: 'Rubber Crumb 10 (Track)',
        time: '09/02/2020 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    },
    {
        teamOne: 'Trevs Z',
        result: 'vs',
        teamTwo: 'Chads J',
        location: 'Rubber Crumb 1 (Track)',
        time: '07/02/2020 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    }
];

// Current date = 1/1/2020
const fixturesWithMatchesInPast = [
    {
        teamOne: 'Josephine Butler C',
        result: 'vs',
        teamTwo: 'Collingwood J',
        location: 'Rubber Crumb 3 (Track)',
        time: '08/02/1500 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    },
    {
        teamOne: 'Collingwood A',
        result: 'vs',
        teamTwo: 'Butler C',
        location: 'Rubber Crumb 10 (Track)',
        time: '09/02/1850 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    },
    {
        teamOne: 'Trevs Z',
        result: 'vs',
        teamTwo: 'Chads J',
        location: 'Rubber Crumb 1 (Track)',
        time: '07/02/2500 09:00',
        completed: false,
        league: 'Division 3',
        isCup: false
    }
];

const fixturesWithUnsorted = [
    {
        teamOne: 'Collingwood Z',
        result: '1 - 2',
        teamTwo: 'St. Aidan\'s A',
        location: 'Rubber Crumb 1 (Old)',
        time: '12/10/2019 10:45',
        completed: true,
        league: 'Premiership',
        isCup: false
    },
    {
        teamOne: 'Collingwood Z',
        result: '1 - 2',
        teamTwo: 'St. Aidan\'s A',
        location: 'Rubber Crumb 1 (Old)',
        time: '12/10/2019 10:45',
        completed: true,
        league: 'Premiership',
        isCup: false
    },
    {
        teamOne: 'Collingwood F',
        result: '1 - 2',
        teamTwo: 'Collingwood Z',
        location: 'Rubber Crumb 1 (Old)',
        time: '12/10/2019 10:45',
        completed: true,
        league: 'Premiership',
        isCup: false
    }
];

// ------------------------------------------------------------------------- //

describe('Date functions', () => {
    it('Sorts fixtures by date', () => {
        expect(helpers.sortMatchesByDate(fixturesNotSortedByDate, false))
            .toEqual([
                {
                    teamOne: 'Trevs Z',
                    result: 'vs',
                    teamTwo: 'Chads J',
                    location: 'Rubber Crumb 1 (Track)',
                    time: '07/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                },
                {
                    teamOne: 'Josephine Butler C',
                    result: 'vs',
                    teamTwo: 'Collingwood J',
                    location: 'Rubber Crumb 3 (Track)',
                    time: '08/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                },
                {
                    teamOne: 'Collingwood A',
                    result: 'vs',
                    teamTwo: 'Butler C',
                    location: 'Rubber Crumb 10 (Track)',
                    time: '09/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                }
            ]);
    });

    it('Sorts fixtures by date reversed', () => {
        expect(helpers.sortMatchesByDate(fixturesNotSortedByDate, true))
            .toEqual([
                {
                    teamOne: 'Collingwood A',
                    result: 'vs',
                    teamTwo: 'Butler C',
                    location: 'Rubber Crumb 10 (Track)',
                    time: '09/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                },
                {
                    teamOne: 'Josephine Butler C',
                    result: 'vs',
                    teamTwo: 'Collingwood J',
                    location: 'Rubber Crumb 3 (Track)',
                    time: '08/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                },
                {
                    teamOne: 'Trevs Z',
                    result: 'vs',
                    teamTwo: 'Chads J',
                    location: 'Rubber Crumb 1 (Track)',
                    time: '07/02/2020 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                }
            ]);
    });

    it('Only includes matches in the future', () => {
        expect(helpers.filterFixturesByTime(fixturesWithMatchesInPast, true))
            .toEqual([
                {
                    teamOne: 'Trevs Z',
                    result: 'vs',
                    teamTwo: 'Chads J',
                    location: 'Rubber Crumb 1 (Track)',
                    time: '07/02/2500 09:00',
                    completed: false,
                    league: 'Division 3',
                    isCup: false
                }
            ]);
    });
});

// ------------------------------------------------------------------------- //

describe('College Teams', () => {
    it('Removes duplicate college names', () => {
        expect(helpers.uniqueCollegeTeamsFromFixtures(fixturesWithUnsorted, 'Collingwood'))
            .toEqual(['Collingwood Z', 'Collingwood F']);
    });
});

// ------------------------------------------------------------------------- //

describe('Other', () => {
    it('Is defensive Goalkeeper', () => {
        expect(helpers.isDefensive('Goalkeeper')).toEqual(true);
    });

    it('Is defensive goalkeeper', () => {
        expect(helpers.isDefensive('goalkeeper')).toEqual(true);
    });

    it('Is defensive Defender', () => {
        expect(helpers.isDefensive('Defender')).toEqual(true);
    });

    it('Is defensive defender', () => {
        expect(helpers.isDefensive('defender')).toEqual(true);
    });

    it('Generating points route', () => {
        expect(helpers.generatePointsRoute('userId', 'week')).toEqual('/points/userId/week');
    });

    it('Generating overview route', () => {
        expect(helpers.generateOverviewRoute('userId', 'week')).toEqual('/overview/userId/week');
    });
});
