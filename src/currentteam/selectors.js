import fp from 'lodash/fp';

export const getUserId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('userId'))(props);
export const getAlreadyFetchedForUser = (state, userId) => fp.get(`activeTeam.${userId}.fetched`)(state.currentTeam);
export const getActiveTeam = (state, props) => fp.flow(fp.get('activeTeam'), fp.get(getUserId(props)), fp.get('players'))(state.currentTeam);
export const getCurrentCaptain = (state, props) => fp.flow(
    fp.get('activeTeam'),
    fp.get(getUserId(props)),
    fp.get('captain')
)(state.currentTeam);
export const getFetchingForUser = (state, props) => fp.flow(fp.get('activeTeam'), fp.get(getUserId(props)), fp.get('fetching'))(state.currentTeam);
