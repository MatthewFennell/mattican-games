import { functionToCall } from '../api/api';

export const createAvalonGame = request => functionToCall('avalon-createAvalonGame')(request);
export const joinAvalonGame = request => functionToCall('avalon-joinAvalonGame')(request);
