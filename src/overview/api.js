import { functionToCall } from '../api/api';

export const createAvalonGame = request => functionToCall('createAvalonGame')(request);
export const joinAvalonGame = request => functionToCall('joinAvalonGame')(request);
