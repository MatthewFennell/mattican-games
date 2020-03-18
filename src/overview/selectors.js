// eslint-disable-next-line import/prefer-default-export
export const getGames = state => {
    const { games } = state.firestore.data;

    if (!games) {
        return [];
    }

    return Object.keys(games).map(key => ({
        ...games[key],
        id: key
    }));
};
