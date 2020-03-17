/* eslint-disable no-underscore-dangle */
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as constants from './constants';

export const isDefensive = position => position.toLowerCase() === 'goalkeeper' || position.toLowerCase() === 'defender';
export const generatePointsRoute = (userId, week) => `${constants.URL.POINTS}/${userId}/${week}`;
export const generateOverviewRoute = (userId, week) => `${constants.URL.OVERVIEW}/${userId}/${week}`;

// eslint-disable-next-line no-underscore-dangle
export const generateTimeSinceNow = date => moment(new Date(date._seconds * 1000)).startOf('second').fromNow();

export const generateYouTubeLinkFromId = id => (
    <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noopener noreferrer"
    >
        {`https://www.youtube.com/watch?v=${id}`}

    </a>
);

export const uniqueCollegeTeamsFromFixtures = (fixtures, team) => fixtures
    .reduce((acc, cur) => _.union(acc, [cur.teamOne, cur.teamTwo]
        .filter(x => x.includes(team))), []);

const convertToDate = d => moment(d, 'DD-MM-YYYY hh:mm');
const isFutureTense = date => moment(date, 'DD-MM-YYYY hh:mm')
    .isAfter(moment().subtract(constants.matchLengthMinutes, 'minutes'));

export const filterFixturesByTime = (fixtures, isFuture) => fixtures
    .filter(x => (isFuture ? isFutureTense(x.time) : !isFutureTense(x.time)));

export const sortMatchesByDate = (fixtures, isDesc) => (isDesc
    ? fixtures.sort((a, b) => (convertToDate(a.time) > convertToDate(b.time) ? -1 : 1))
    : fixtures.sort((a, b) => (convertToDate(a.time) > convertToDate(b.time) ? 1 : -1))
);
