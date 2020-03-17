import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import moment from 'moment';
import { generateCollingwoodTeams } from '../fixtures/helpers';

export const generateUniqueTeams = fixtures => fixtures
    .reduce((prev, curr) => _.uniqBy(
        [...prev, curr.teamOne, curr.teamTwo]
    ), [])
    .sort()
    .map(x => ({
        id: x,
        value: x,
        text: x
    }));

export const graphModes = {
    totalPoints: 'totalPoints',
    totalGoalsFor: 'totalGoalsFor',
    totalGoalsAgainst: 'totalGoalsAgainst'
};

const generateAccumulation = (team, maxWeek) => {
    let result = {};

    result = fp.flow(
        fp.set('week-0.totalGoalsFor', 0),
        fp.set('week-0.totalGoalsAgainst', 0),
        fp.set('week-0.totalPoints', 0)
    )(result);

    for (let week = 1; week <= maxWeek; week += 1) {
        const currentResults = team.results.filter(t => t.week === week);
        let totalPoints = 0;
        let totalGoalsFor = 0;
        let totalGoalsAgainst = 0;
        currentResults.forEach(x => {
            if (x.goalsFor > x.goalsAgainst) {
                totalPoints += 3;
            }
            if (x.goalsFor === x.goalsAgainst) {
                totalPoints += 1;
            }
            totalGoalsFor += x.goalsFor;
            totalGoalsAgainst += x.goalsAgainst;
        });
        const previousData = fp.get(`week-${(week - 1).toString()}`)(result);
        result = fp.flow(
            fp.set(`week-${week}.totalGoalsFor`, totalGoalsFor + previousData.totalGoalsFor),
            fp.set(`week-${week}.totalGoalsAgainst`, totalGoalsAgainst + previousData.totalGoalsAgainst),
            fp.set(`week-${week}.totalPoints`, totalPoints + previousData.totalPoints)
        )(result);
    }
    return result;
};

// eslint-disable-next-line import/prefer-default-export
export const findGraphData = (allTeams, activeTeams, graphMode, maxGameweek) => {
    const includedTeams = allTeams.filter(team => activeTeams.includes(team.id));

    const output = [];


    const accumulation = fp.flow(
        allTeams.map(x => fp.set(x.id, generateAccumulation(x, maxGameweek)))
    )({});

    // Add all the selected team names
    output.push(['x'].concat(includedTeams.map(team => team.team_name)));

    for (let week = 1; week <= maxGameweek; week += 1) {
        const weekData = [week];
        includedTeams.forEach(team => {
            const resultsForThatWeek = team.results.filter(x => x.week === week);
            let total = 0;
            resultsForThatWeek.forEach(result => {
                if (result[graphMode] || result[graphMode] === 0) {
                    total += result[graphMode];
                } else {
                    total = fp.get(`${team.id}.week-${week}.${graphMode}`)(accumulation) || 0;
                }
            });
            if (resultsForThatWeek.length === 0) {
                if (graphMode === graphModes.goalsFor || graphMode === graphModes.goalsAgainst) {
                    total = 0;
                } else {
                    total = fp.get(`${team.id}.week-${week}.${graphMode}`)(accumulation) || 0;
                }
            }
            weekData.push(total);
        });
        output.push(weekData);
    }
    return output;
};

// Sort by points first (stored as `score` since `points` is a bold div)
// Then by goal difference
// Then by games played
// Then by wins
const sortLeagueTable = leagueTable => leagueTable.sort((a, b) => {
    if (a.score - b.score !== 0) {
        return a.score - b.score;
    }

    if (a.goalDifference - b.goalDifference !== 0) {
        return a.goalDifference - b.goalDifference;
    }

    if (a.gamesPlayed - b.gamesPlayed !== 0) {
        return b.gamesPlayed - a.gamesPlayed;
    }

    if (a.wins - b.wins !== 0) {
        return a.wins - b.wins;
    }
    return 0;
});

export const makeBold = val => <div style={{ fontWeight: 'bold' }}>{val}</div>;

const collingwoodOnly = x => x.teamOne.includes('Collingwood') || x.teamTwo.includes('Collingwood');

// goalDifference: 8
// wins: 4
// draws: 0
// losses: 0
// team: "England"
// gamesPlayed: 4
// score: 12

// Calculated from the point of teamOne
const generateResult = (fixture, isTeamOne) => {
    let goals = fixture.result.split(' - ').map(x => parseInt(x, 10));
    goals = isTeamOne ? goals : goals.reverse();
    if (goals[0] > goals[1]) {
        return ({
            goalDifference: goals[0] - goals[1],
            wins: 1,
            draws: 0,
            losses: 0,
            score: 3,
            goalsFor: goals[0],
            goalsAgainst: goals[1]
        });
    }
    if (goals[0] === goals[1]) {
        return ({
            goalDifference: 0,
            wins: 0,
            draws: 1,
            losses: 0,
            score: 1,
            goalsFor: goals[0],
            goalsAgainst: goals[1]
        });
    }
    return ({
        goalDifference: goals[0] - goals[1],
        wins: 0,
        draws: 0,
        losses: 1,
        score: 0,
        goalsFor: goals[0],
        goalsAgainst: goals[1]
    });
};

const combineResult = (fixture, result, initialRowObject, property) => ({
    ...initialRowObject,
    [fixture[property]]: ({
        ...initialRowObject[fixture[property]],
        goalDifference: initialRowObject[fixture[property]]
            .goalDifference + result.goalDifference,
        wins: initialRowObject[fixture[property]].wins + result.wins,
        draws: initialRowObject[fixture[property]].draws + result.draws,
        losses: initialRowObject[fixture[property]].losses + result.losses,
        gamesPlayed: initialRowObject[fixture[property]].gamesPlayed + 1,
        score: initialRowObject[fixture[property]].score + result.score
    })
});

export const generateNewTable = fixtures => {
    const filteredFixtures = fixtures
        .filter(collingwoodOnly)
        .filter(x => x.completed)
        .filter(x => !x.isCup);
    const collingwoodTeams = generateCollingwoodTeams(fixtures);
    let initialRowObject = collingwoodTeams.reduce((acc, cur) => ({
        ...acc,
        [cur.text]: {
            goalDifference: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gamesPlayed: 0,
            score: 0
        }
    }), {});

    filteredFixtures.forEach(fixture => {
        if (fixture.teamOne.includes('Collingwood')) {
            const result = generateResult(fixture, true);
            initialRowObject = combineResult(fixture, result, initialRowObject, 'teamOne');
        }
        if (fixture.teamTwo.includes('Collingwood')) {
            const result = generateResult(fixture, false);
            initialRowObject = combineResult(fixture, result, initialRowObject, 'teamTwo');
        }
    });

    const result = Object.keys(initialRowObject).map(x => ({
        ...initialRowObject[x],
        team: x
    }));

    return sortLeagueTable(result)
        .reverse().map((x, pos) => ({ ...x, id: x.team, position: makeBold(pos + 1) }));
};

export const generateLeagueTable = (activeTeams, weekStart, weekEnd) => {
    const rows = [];
    activeTeams.forEach(team => {
        const resultsToLookAt = team.results.filter(x => x.week >= weekStart && x.week <= weekEnd);
        let points = 0;
        let goalDifference = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let gamesPlayed = 0;
        resultsToLookAt.forEach(result => {
            goalDifference = goalDifference + result.goalsFor - result.goalsAgainst;
            gamesPlayed += 1;
            if (result.goalsFor > result.goalsAgainst) {
                points += 3;
                wins += 1;
            } else if (result.goalsFor < result.goalsAgainst) {
                losses += 1;
            } else {
                points += 1;
                draws += 1;
            }
        });
        rows.push({
            points: makeBold(points),
            goalDifference,
            wins,
            draws,
            losses,
            team: team.team_name,
            gamesPlayed,
            score: points,
            id: team.id
        });
    });
    return sortLeagueTable(rows).reverse().map((x, pos) => ({ ...x, position: makeBold(pos + 1) }));
};

export const columns = [
    {
        id: 'position',
        label: 'Pos',
        align: 'center',
        renderCell: true
    },
    {
        id: 'team',
        label: 'Team',
        align: 'center'
    },
    {
        id: 'wins',
        label: 'W',
        align: 'center'
    },
    {
        id: 'draws',
        label: 'D',
        align: 'center'
    },
    {
        id: 'losses',
        label: 'L',
        align: 'center'
    },
    {
        id: 'goalDifference',
        label: 'GD',
        align: 'center'
    },
    {
        id: 'score',
        label: 'Pts',
        align: 'center',
        renderCell: true
    }
];

export const marks = maxWeek => {
    const result = [];
    for (let x = 1; x <= maxWeek; x += 1) {
        result.push({ value: x, label: x.toString() });
    }
    return result;
};

const convertToDay = d => moment(d, 'DD-MM-YYYY');

// Given start and end date, returns array with days between
// for every "dayIncrements" number of days
const enumerateDaysBetweenDates = (startDate, endDate, dayIncrements) => {
    const dates = [];

    const currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');

    while (currDate.add(dayIncrements, 'days').diff(lastDate) <= 0) {
        dates.push(currDate.clone().toDate());
    }

    return dates;
};

// Given a list a fixtures, returns an array of ordered days between the first and last match
export const generateAllDays = fixtures => {
    const fixturesWithDate = fixtures.map(x => convertToDay(x.time));
    const minDate = fixturesWithDate.reduce((prev, cur) => (moment(prev)
        .isBefore(moment(cur)) ? prev : cur), {});
    const maxDate = fixturesWithDate.reduce((prev, cur) => (moment(prev)
        .isAfter(moment(cur)) ? prev : cur), {});

    const dateRange = enumerateDaysBetweenDates(minDate, maxDate, 1);

    return dateRange;
};

const findPreviousSaturday = date => {
    const dayOfWeek = moment(date).weekday();
    const numberOfDaysToSubtract = (dayOfWeek + 1) % 7;
    const clone = moment(date).clone();
    return moment(clone.subtract(numberOfDaysToSubtract, 'days').toDate());
};

const findNextSaturday = date => {
    const dayOfWeek = moment(date).weekday();
    // 13 = 6 + 7 (otherwise would just be (6-dayOfWeek), but sunday => -1)
    const numberOfDaysToAdd = ((13 - dayOfWeek) % 7);
    const clone = moment(date).clone();
    return moment(clone.add(numberOfDaysToAdd, 'days').toDate());
};

const generateTicks = (firstSat, lastSat) => enumerateDaysBetweenDates(firstSat, lastSat, 7);

const makeTeamAccumulation = (fixtures, team, startDate, endDate) => {
    const fixturesForTeam = fixtures.filter(x => x.teamOne === team || x.teamTwo === team)
        .map(x => ({
            ...x,
            time: convertToDay(x.time)
        }));

    // Oldest first
    const sortedArray = fixturesForTeam.sort((a, b) => (moment(a.time)
        .isAfter(moment(b.time)) ? 1 : -1));

    let currentAccumulationValues = {
        totalGoalsFor: 0,
        totalGoalsAgainst: 0,
        totalPoints: 0,
        goalsScored: 0,
        goalsConceded: 0
    };

    const dateToCompareAgainst = moment(startDate).clone();

    let result = { };

    sortedArray.forEach(fixture => {
        const currentDate = moment(fixture.time);
        while (moment(dateToCompareAgainst).isBefore(moment(currentDate))) {
            result = {
                ...result,
                [moment(dateToCompareAgainst).format('DD-MMM')]: currentAccumulationValues
            };
            dateToCompareAgainst.add(1, 'days');
        }
        if (moment(currentDate).isSame(moment(dateToCompareAgainst), 'day')) {
            const matchResult = generateResult(fixture, fixture.teamOne.includes(team));
            currentAccumulationValues = fp.flow(
                fp.set('totalGoalsFor', currentAccumulationValues.totalGoalsFor + matchResult.goalsFor),
                fp.set('totalGoalsAgainst', currentAccumulationValues.totalGoalsAgainst + matchResult.goalsAgainst),
                fp.set('totalPoints', currentAccumulationValues.totalPoints + matchResult.score)
            )(currentAccumulationValues);
            result = {
                ...result,
                [moment(dateToCompareAgainst).format('DD-MMM')]: currentAccumulationValues
            };
        }
    });
    while (moment(dateToCompareAgainst).diff(endDate) <= 0) {
        result = {
            ...result,
            [moment(dateToCompareAgainst).format('DD-MMM')]: currentAccumulationValues
        };
        dateToCompareAgainst.add(1, 'days');
    }
    return result;
};

export const combineData = (allTeams, allDays, teamAccumulations, graphMode) => {
    const output = [];
    output.push([{ type: 'date', label: 'Day' }].concat(allTeams));

    for (let x = 0; x < allDays.length; x += 7) {
        const currentDate = moment(allDays[x]).format('DD-MMM');
        const row = [new Date(moment(allDays[x]))];

        allTeams.forEach(team => {
            const data = fp.flow(
                fp.get(team),
                fp.get(currentDate),
                fp.get(graphMode)
            )(teamAccumulations);
            row.push(data);
        });
        output.push(row);
    }

    // allDays.forEach(day => {
    //     const currentDate = moment(day).format('DD-MMM');
    //     const row = [new Date(moment(day))];

    //     allTeams.forEach(team => {
    //         const data = fp.flow(
    //             fp.get(team),
    //             fp.get(currentDate),
    //             fp.get(graphMode)
    //         )(teamAccumulations);
    //         row.push(data);
    //     });
    //     output.push(row);
    // });
    return output;
};

export const generateWeekTicks = fixtures => {
    const allDays = generateAllDays(fixtures);

    const firstDay = fp.head(allDays);
    const lastDay = fp.last(allDays);

    const firstSat = findPreviousSaturday(firstDay);
    const lastSat = findNextSaturday(lastDay);
    const weekTicks = generateTicks(firstSat, lastSat);
    return weekTicks;
};

export const makeGraphAccumulation = (prevAcc, fixtures, allDays, activeTeams) => {
    const firstDay = fp.head(allDays);
    const lastDay = fp.last(allDays);

    const firstSat = findPreviousSaturday(firstDay);
    const lastSat = findNextSaturday(lastDay);

    const newTeams = activeTeams.filter(x => !fp.has(x)(prevAcc));

    const newAccumulations = newTeams.reduce((acc, cur) => ({
        ...acc,
        [cur]: makeTeamAccumulation(fixtures, cur, firstSat, lastSat)
    }), {});


    const allAccumulations = fp.merge(newAccumulations)(prevAcc);

    return allAccumulations;
};
