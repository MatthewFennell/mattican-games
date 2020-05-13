import { functionToCall } from '../../api/api';

export const startArticulateGame = request => functionToCall('articulate-startGame')(request);
export const editGame = request => functionToCall('articulate-editGame')(request);
export const start = request => functionToCall('articulate-start')(request); // Confirm teams
export const startRound = request => functionToCall('articulate-startRound')(request); // Start round
export const loadSummary = request => functionToCall('articulate-loadSummary')(request);
export const confirmScore = request => functionToCall('articulate-confirmScore')(request);
export const confirmSpadeRoundWinner = request => functionToCall('articulate-confirmSpadeRoundWinner')(request);
export const confirmWinner = request => functionToCall('articulate-confirmWinner')(request);
export const createArticulateGame = request => functionToCall('articulate-createGame')(request);

export { gotWord, skipWord, trashWord } from '../api';
