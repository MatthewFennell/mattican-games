import fp from 'lodash/fp';

// eslint-disable-next-line import/prefer-default-export
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
