import { functionToCall } from '../../api/api';

export const startHitlerGame = request => functionToCall('hitler-startGame')(request);
export const nominateChancellor = request => functionToCall('hitler-nominateChancellor')(request);
export const confirmChancellor = request => functionToCall('hitler-confirmChancellor')(request);
export const makeHitlerVote = request => functionToCall('hitler-makeVote')(request);
export const giveCardsToChancellor = request => functionToCall('hitler-giveCardsToChancellor')(request);
export const playChancellorCard = request => functionToCall('hitler-playChancellorCard')(request);
export const investigatePlayer = request => functionToCall('hitler-investigatePlayer')(request);
export const confirmInvestigation = request => functionToCall('hitler-confirmInvestigation')(request);
export const temporaryPresident = request => functionToCall('hitler-temporaryPresident')(request);
export const confirmPresident = request => functionToCall('hitler-confirmTemporaryPresident')(request);
export const killPlayer = request => functionToCall('hitler-killPlayer')(request);
export const confirmKillPlayer = request => functionToCall('hitler-confirmKillPlayer')(request);
export const initiateVeto = request => functionToCall('hitler-initiateVeto')(request);
export const replyToVeto = request => functionToCall('hitler-replyToVeto')(request);
export const closeTopThree = request => functionToCall('hitler-closeTopThree')(request);
export const editGameHitler = request => functionToCall('hitler-editGameHitler')(request);
export const closeInvestigation = request => functionToCall('hitler-closeInvestigation')(request);
