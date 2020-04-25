import { functionToCall } from '../api/api';

export const joinGame = request => functionToCall('joinGame')(request);

export const createAvalonGame = request => functionToCall('avalon-createAvalonGame')(request);

export const createHitlerGame = request => functionToCall('hitler-createHitlerGame')(request);
