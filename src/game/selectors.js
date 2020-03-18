import fp from 'lodash/fp';

export const getGameId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('gameId'))(props);

export const getCurrentGame = (state, props) => {
    const gameId = getGameId(props);
    return state.firestore.data.games[gameId];
};

export const getIsReady = (state, props) => {
    const myId = state.firebase.auth.uid;

    const currentGame = getCurrentGame(state, props);

    return currentGame
    && currentGame.playersReady
     && currentGame.playersReady.includes(myId);
};
