import { functionToCall } from '../api/api';

export const leaveGame = request => functionToCall('leaveGame')(request);
export const readyUp = request => functionToCall('readyUp')(request);
export const destroyGame = request => functionToCall('destroyGame')(request);
export const leaveMidgame = request => functionToCall('leaveMidgame')(request);
export const approveLeaveMidgame = request => functionToCall('approveLeaveMidgame')(request);
export const editDisplayName = request => functionToCall('editDisplayName')(request);

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

export const editGameAvalon = request => functionToCall('editGameAvalon')(request);
export const startAvalonGame = request => functionToCall('avalon-startGame')(request);
export const nominatePlayer = request => functionToCall('avalon-nominatePlayer')(request);
export const confirmNominations = request => functionToCall('avalon-confirmNominations')(request);
export const makeVote = request => functionToCall('avalon-makeVote')(request);
export const goOnQuest = request => functionToCall('avalon-goOnQuest')(request);
export const guessMerlin = request => functionToCall('avalon-guessMerlin')(request);

export const editGameWhoInHat = request => functionToCall('editGameWhoInHat')(request);
export const startWhoInHatGame = request => functionToCall('startWhoInHatGame')(request);
export const addTeam = request => functionToCall('addTeam')(request);
export const joinTeam = request => functionToCall('joinTeam')(request);
export const addWord = request => functionToCall('addWord')(request);
export const startWhoInHat = request => functionToCall('startWhoInHat')(request);
export const startWhoInHatRound = request => functionToCall('startWhoInHatRound')(request);
export const gotWord = request => functionToCall('gotWord')(request);
export const skipWord = request => functionToCall('skipWord')(request);
export const trashWord = request => functionToCall('trashWord')(request);
export const loadSummary = request => functionToCall('loadSummary')(request);
export const confirmWord = request => functionToCall('confirmWord')(request);
export const confirmScore = request => functionToCall('confirmScore')(request);
export const leaveWhoInHatGame = request => functionToCall('leaveWhoInHatGame')(request);
export const joinWhoInHatTeamMidgame = request => functionToCall('joinWhoInHatTeamMidgame')(request);
export const randomiseTeams = request => functionToCall('randomiseTeams')(request);

export const editArticulateGame = request => functionToCall('editArticulateGame')(request);
export const startArticulateGame = request => functionToCall('startArticulateGame')(request); // Into lobby
export const startArticulate = request => functionToCall('startArticulate')(request); // Confirm teams
export const startArticulateRound = request => functionToCall('startArticulateRound')(request); // Start round
export const skipArticulateWord = request => functionToCall('skipArticulateWord')(request);
export const gotArticulateWord = request => functionToCall('gotArticulateWord')(request);
export const trashArticulateWord = request => functionToCall('trashArticulateWord')(request);
export const loadArticulateSummary = request => functionToCall('loadArticulateSummary')(request);
export const setArticulateWordConfirmed = request => functionToCall('setArticulateWordConfirmed')(request);
export const confirmArticulateScore = request => functionToCall('confirmArticulateScore')(request);
export const confirmSpadeRoundWinner = request => functionToCall('confirmSpadeRoundWinner')(request);
