import { functionToCall } from '../api/api';

export const getFixtures = request => functionToCall('fixtures-findFixtures')(request)
    .then(response => response.data);

export const setMyTeam = request => functionToCall('fixtures-setMyTeam')(request);

export const fetchMyTeam = request => functionToCall('fixtures-getMyTeam')(request)
    .then(response => response.data);
