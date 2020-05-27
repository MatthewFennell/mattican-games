import { functionToCall } from '../../api/api';

export const createGame = request => functionToCall('createOthelloGame')(request);
export const editGame = request => functionToCall('editGame')(request);
export const startGame = request => functionToCall('startGame')(request);
export const placeDisc = request => functionToCall('placeDisc')(request);
export const leaveGame = request => functionToCall('leaveGame')(request);
export const resign = request => functionToCall('resign')(request);
