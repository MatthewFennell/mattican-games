// eslint-disable-next-line import/prefer-default-export
export const getMyGames = state => {
    const myId = state.firebase.auth.uid;
    const allGames = state.firestore.data.games;

    if (!allGames) {
        return null;
    }

    const game = Object.keys(allGames).find(key => allGames[key].currentPlayers
        && allGames[key].currentPlayers.includes(myId));

    return game || null;
};
