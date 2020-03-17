import { functionToCall } from '../api/api';

// eslint-disable-next-line import/prefer-default-export
export const getAllTeams = () => functionToCall('team-getAllTeams')()
    .then(response => response.data);
