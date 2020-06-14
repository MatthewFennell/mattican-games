import fp from 'lodash/fp';

export const getGameId = state => {
    const { pathname } = state.router.location;

    if (!pathname) {
        return null;
    }

    if (pathname.includes('game') && pathname.length > 6) {
        const gameId = fp.last(pathname.split('/'));
        return gameId;
    }

    return null;
};

export const getCurrentGame = state => fp.flow(
    fp.get('firestore'),
    fp.get('data'),
    fp.get('games'),
    fp.get(getGameId(state))
)(state);
