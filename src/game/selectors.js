import fp from 'lodash/fp';
import { createSelector } from 'reselect';

export const getGameId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('gameId'))(props);
export const getMyId = state => state.firebase.auth.uid;

export const getCurrentGame = (state, props) => {
    const gameId = getGameId(props);
    return state.firestore.data.games[gameId];
};

export const getIsReady = createSelector(
    getMyId,
    getCurrentGame,
    (myId, currentGame) => currentGame
    && currentGame.playersReady
     && currentGame.playersReady.includes(myId)
);

export const getMyRole = createSelector(
    getMyId,
    getCurrentGame,
    (myId, currentGame) => {
        if (!currentGame) {
            return null;
        }
        return fp.get('role')(currentGame.playerRoles.find(x => x.player === myId));
    }
);
