import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('shared-leaveGame')(request);
export const readyUp = request => functionToCall('shared-readyUp')(request);
export const destroyGame = request => functionToCall('shared-destroyGame')(request);
export const leaveMidgame = request => functionToCall('shared-leaveMidgame')(request);
export const approveLeaveMidgame = request => functionToCall('shared-approveLeaveMidgame')(request);
export const editDisplayName = request => functionToCall('shared-editDisplayName')(request);
export const gotWord = request => functionToCall('shared-gotWord')(request);

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

export const startWhoInHatGame = request => functionToCall('whoInHat-startGame')(request);
export const addTeam = request => functionToCall('shared-addTeam')(request);
export const joinTeam = request => functionToCall('shared-joinTeam')(request);
export const skipWord = request => functionToCall('shared-skipWord')(request);
export const trashWord = request => functionToCall('shared-trashWord')(request);
export const confirmWord = request => functionToCall('shared-confirmWord')(request);
export const sharedLeaveMidgame = request => functionToCall('shared-leaveMidgame')(request);
export const joinTeamMidgame = request => functionToCall('shared-joinTeamMidgame')(request);
export const randomiseTeams = request => functionToCall('shared-randomiseTeams')(request);
export const startAvalonGame = request => functionToCall('avalon-startGame')(request);


export const startArticulateGame = request => functionToCall('articulate-startGame')(request); // Into lobby
