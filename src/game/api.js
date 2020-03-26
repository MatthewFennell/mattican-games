import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('leaveGame')(request);
export const readyUp = request => functionToCall('readyUp')(request);
export const destroyGame = request => functionToCall('destroyGame')(request);
export const leaveMidgame = request => functionToCall('leaveMidgame')(request);
export const approveLeaveMidgame = request => functionToCall('approveLeaveMidgame')(request);

export const startGame = request => functionToCall('avalon-startGame')(request);
export const nominatePlayer = request => functionToCall('avalon-nominatePlayer')(request);
export const confirmNominations = request => functionToCall('avalon-confirmNominations')(request);
export const makeVote = request => functionToCall('avalon-makeVote')(request);
export const goOnQuest = request => functionToCall('avalon-goOnQuest')(request);
export const guessMerlin = request => functionToCall('avalon-guessMerlin')(request);
