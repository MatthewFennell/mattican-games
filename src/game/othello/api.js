import { functionToCall } from '../../api/api';

export const createGame = request => functionToCall('othello-createGame')(request);
export const editGame = request => functionToCall('othello-editGame')(request);
export const startGame = request => functionToCall('othello-startGame')(request);
export const placeDisc = request => functionToCall('othello-placeDisc')(request);
export const leaveGame = request => functionToCall('othello-leaveGame')(request);
export const resign = request => functionToCall('othello-resign')(request);
export const regenerateComputerMove = request => functionToCall('othello-regenerateComputerMove')(request);
export const setAiError = request => functionToCall('othello-setAiError')(request);
