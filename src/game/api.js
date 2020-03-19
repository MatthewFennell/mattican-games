import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('leaveGame')(request);
export const readyUp = request => functionToCall('readyUp')(request);
export const startGame = request => functionToCall('startGame')(request);
