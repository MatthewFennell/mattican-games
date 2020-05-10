import { functionToCall } from '../../api/api';

export const editGame = request => functionToCall('articulate-editGame')(request);
