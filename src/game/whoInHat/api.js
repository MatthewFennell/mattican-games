import { functionToCall } from '../../api/api';

export const addWord = request => functionToCall('whoInHat-addWord')(request);
export const startWhoInHat = request => functionToCall('whoInHat-start')(request);
export const startWhoInHatRound = request => functionToCall('whoInHat-startRound')(request);
export const editGameWhoInHat = request => functionToCall('whoInHat-editGame')(request);
export const loadSummary = request => functionToCall('whoInHat-loadSummary')(request);
export const confirmScore = request => functionToCall('whoInHat-confirmScore')(request);
