import fp from 'lodash/fp';

export const getCurrentGameWeek = props => parseInt(fp.flow(fp.get('match'), fp.get('params'), fp.get('week'))(props), 10);
export const getUserId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('userId'))(props);

export const getUserInfo = (state, props, property) => fp.flow(
    fp.get(getUserId(props)),
    fp.get(`week-${getCurrentGameWeek(props)}`),
    fp.get(property)
)(state.overview.userInfo);

export const alreadyFetchedUserInfo = (state, userId, week) => fp.flow(
    fp.get(userId),
    fp.get(`week-${week}`),
    fp.get('fetched')
)(state.overview.userInfo);

export const alreadyFetchedUserStats = (state, userId) => fp.flow(
    fp.get(userId),
    fp.get('fetched')
)(state.overview.userStats);


export const getUserStat = (state, props, property) => fp.flow(
    fp.get(getUserId(props)),
    fp.get(property)
)(state.overview.userStats);

export const getMaxGameWeek = state => state.overview.maxGameWeek;
