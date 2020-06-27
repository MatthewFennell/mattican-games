import { functionToCall } from '../../api/api';

export const startAvalonGame = request => functionToCall('avalon-startGame')(request);
export const editGameAvalon = request => functionToCall('avalon-editGameAvalon')(request);
export const nominatePlayer = request => functionToCall('avalon-nominatePlayer')(request);
export const confirmNominations = request => functionToCall('avalon-confirmNominations')(request);
export const makeVote = request => functionToCall('avalon-makeVote')(request);
export const goOnQuest = request => functionToCall('avalon-goOnQuest')(request);
export const guessMerlin = request => functionToCall('avalon-guessMerlin')(request);
export const createAvalonGame = request => functionToCall('avalon-createAvalonGame')(request);
export const realignQuestNominations = request => functionToCall('avalon-realignQuestNominations')(request);
