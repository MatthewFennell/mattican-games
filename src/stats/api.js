import { functionToCall } from '../api/api';

// eslint-disable-next-line import/prefer-default-export
export const getTeamStatsByWeek = request => functionToCall('points-teamStatsByWeek')(request).then(response => response.data);
