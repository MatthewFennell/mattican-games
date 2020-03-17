import fp from 'lodash/fp';

export const getLeagues = state => state.leagues.leagues;
export const getLeagueId = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('leagueId'))(props);
export const getFetchingLeagues = state => state.leagues.fetchingLeagues;

export const getUsersInLeagueWithId = (state, id) => fp.flow(
    fp.get('usersInLeague'),
    fp.get(id),
    fp.get('users')
)(state.leagues) || [];

export const getFetchedAllUsersInLeague = (state, leagueId) => fp.flow(
    fp.get(leagueId),
    fp.get('fetchedAll')
)(state.leagues.usersInLeague);

export const getCurrentLeagueProperty = (state, props, property) => fp.flow(
    fp.get(getLeagueId(props)),
    fp.get(property)
)(state.leagues.usersInLeague);
