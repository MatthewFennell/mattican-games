import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('shared-leaveGame')(request);
export const readyUp = request => functionToCall('shared-readyUp')(request);
export const destroyGame = request => functionToCall('shared-destroyGame')(request);
export const leaveMidgame = request => functionToCall('shared-leaveMidgame')(request);
export const approveLeaveMidgame = request => functionToCall('shared-approveLeaveMidgame')(request);
export const editDisplayName = request => functionToCall('shared-editDisplayName')(request);
export const gotWord = request => functionToCall('shared-gotWord')(request);
export const addTeam = request => functionToCall('shared-addTeam')(request);
export const joinTeam = request => functionToCall('shared-joinTeam')(request);
export const skipWord = request => functionToCall('shared-skipWord')(request);
export const trashWord = request => functionToCall('shared-trashWord')(request);
export const confirmWord = request => functionToCall('shared-confirmWord')(request);
export const sharedLeaveMidgame = request => functionToCall('shared-leaveMidgame')(request);
export const joinTeamMidgame = request => functionToCall('shared-joinTeamMidgame')(request);
export const randomiseTeams = request => functionToCall('shared-randomiseTeams')(request);
