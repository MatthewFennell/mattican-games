import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('leaveGame')(request);
export const readyUp = request => functionToCall('readyUp')(request);
export const startGame = request => functionToCall('startGame')(request);
export const nominatePlayer = request => functionToCall('nominatePlayer')(request);
export const confirmNominations = request => functionToCall('confirmNominations')(request);
export const makeVote = request => functionToCall('makeVote')(request);
export const goOnQuest = request => functionToCall('goOnQuest')(request);
export const guessMerlin = request => functionToCall('guessMerlin')(request);
export const destroyGame = request => functionToCall('destroyGame')(request);
