import { functionToCall } from '../api/api';

export const createAvalonGame = request => functionToCall('avalon-createAvalonGame')(request);
export const joinGame = request => functionToCall('joinGame')(request);

export const createHitlerGame = request => functionToCall('createHitlerGame')(request);
