import { functionToCall } from '../api/api';

export const joinGame = request => functionToCall('shared-joinGame')(request);

export const createAvalonGame = request => functionToCall('avalon-createAvalonGame')(request);

export const createHitlerGame = request => functionToCall('hitler-createHitlerGame')(request);

export const createWhoInHatGame = request => functionToCall('whoInHat-createGame')(request);

export const joinWhoInHatMidgame = request => functionToCall('shared-joinMidgame')(request);

export const createArticulateGame = request => functionToCall('articulate-createArticulateGame')(request);
