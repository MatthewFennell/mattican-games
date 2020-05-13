import { functionToCall } from '../api/api';

export const joinGame = request => functionToCall('shared-joinGame')(request);

export const joinWhoInHatMidgame = request => functionToCall('shared-joinMidgame')(request);
