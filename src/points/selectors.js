import fp from 'lodash/fp';

export const getCurrentGameWeek = props => parseInt(fp.flow(fp.get('match'), fp.get('params'), fp.get('week'))(props), 10);
export const getUserId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('userId'))(props);

export const alreadyFetchedUserPoints = (state, userId, week) => fp.flow(
    fp.get(userId),
    fp.get(`week-${week}`),
    fp.get('fetched')
)(state.points.userTeams);

export const getCurrentInfo = (state, props, property) => fp.flow(
    fp.get(getUserId(props)),
    fp.get(`week-${getCurrentGameWeek(props)}`),
    fp.get(property)
)(state.points.userTeams);
