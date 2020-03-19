import fp from 'lodash/fp';

export const getGameId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('gameId'))(props);
export const getMyId = state => state.firebase.auth.uid;

export const getCurrentGame = (state, props) => {
    const gameId = getGameId(props);
    return state.firestore.data.games[gameId];
};

export const getIsReady = (state, props) => {
    const myId = getMyId(state);

    const currentGame = getCurrentGame(state, props);

    return currentGame
    && currentGame.playersReady
     && currentGame.playersReady.includes(myId);
};

export const getMyRole = (state, props) => {
    const myId = getMyId(state);
    const currentGame = getCurrentGame(state, props);
    if (!currentGame) {
        return null;
    }
    const myRole = currentGame.playerRoles.find(x => x.player === myId).role;
    return myRole;
};
