import { functionToCall } from '../api/api';

// eslint-disable-next-line import/prefer-default-export
export const fetchPointsForUserInWeek = request => functionToCall('points-pointsForWeek')(request)
    .then(data => data.data);
