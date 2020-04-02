import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('leaveGame')(request);
export const readyUp = request => functionToCall('readyUp')(request);
export const destroyGame = request => functionToCall('destroyGame')(request);
export const leaveMidgame = request => functionToCall('leaveMidgame')(request);
export const approveLeaveMidgame = request => functionToCall('approveLeaveMidgame')(request);

export const startHitlerGame = request => functionToCall('startGame')(request);
export const nominateChancellor = request => functionToCall('nominateChancellor')(request);
export const confirmChancellor = request => functionToCall('confirmChancellor')(request);
export const makeHitlerVote = request => functionToCall('makeVote')(request);
export const giveCardsToChancellor = request => functionToCall('giveCardsToChancellor')(request);
export const playChancellorCard = request => functionToCall('playChancellorCard')(request);
export const investigatePlayer = request => functionToCall('investigatePlayer')(request);
export const confirmInvestigation = request => functionToCall('confirmInvestigation')(request);
export const temporaryPresident = request => functionToCall('temporaryPresident')(request);
export const confirmPresident = request => functionToCall('confirmTemporaryPresident')(request);
export const killPlayer = request => functionToCall('killPlayer')(request);
export const confirmKillPlayer = request => functionToCall('confirmKillPlayer')(request);
export const initiateVeto = request => functionToCall('initiateVeto')(request);
export const replyToVeto = request => functionToCall('replyToVeto')(request);
export const closeTopThree = request => functionToCall('closeTopThree')(request);
export const editGameHitler = request => functionToCall('editGameHitler')(request);
export const editGameAvalon = request => functionToCall('editGameAvalon')(request);
export const closeInvestigation = request => functionToCall('closeInvestigation')(request);

export const startAvalonGame = request => functionToCall('avalon-startGame')(request);
export const nominatePlayer = request => functionToCall('avalon-nominatePlayer')(request);
export const confirmNominations = request => functionToCall('avalon-confirmNominations')(request);
export const makeVote = request => functionToCall('avalon-makeVote')(request);
export const goOnQuest = request => functionToCall('avalon-goOnQuest')(request);
export const guessMerlin = request => functionToCall('avalon-guessMerlin')(request);
