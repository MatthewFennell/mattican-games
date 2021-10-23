import { functionToCall } from '../../api/api';

export const startTelestrationsGame = request => functionToCall('telestration-startGame')(request);
export const createTelestrationsGame = request => functionToCall('telestration-createGame')(request);
export const addTelestrationWord = request => functionToCall('telestration-addWord')(request);
export const startTelestrationsRound = request => functionToCall('telestration-startRound')(request);
