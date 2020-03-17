import { functionToCall } from '../api/api';

export const getAllPlayers = request => functionToCall('player-getAllPlayers')(request).then(response => response.data);

export const getAllTeams = request => functionToCall('team-getAllTeams')(request).then(response => response.data);

export const updateTeam = request => functionToCall('activeTeam-updateTeam')(request).then(response => response.data);

export const fetchActiveTeam = request => functionToCall('activeTeam-getActiveTeam')(request)
    .then(data => data.data);
