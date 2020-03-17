import { functionToCall } from '../api/api';

export const getLeaguesIAmIn = () => functionToCall('league-getLeaguesIAmIn')()
    .then(data => data.data.map(league => ({
        id: league.id,
        leagueId: league.data.league_id,
        name: league.data.name,
        startWeek: league.data.start_week,
        userPoints: league.data.user_points,
        position: league.data.position
    })));


export const getUsersInLeague = request => functionToCall('league-orderedUsers')(request)
    .then(response => ({
        users: response.data.users.map(league => ({
            id: league.id,
            name: league.data.name,
            username: league.data.username,
            userPoints: league.data.user_points,
            position: league.data.position,
            userId: league.data.user_id,
            weekPoints: league.data.week_points,
            teamName: league.data.teamName
        })),
        numberOfUsers: response.data.numberOfUsers || null,
        leagueName: response.data.leagueName || null
    }));


export const createLeague = request => functionToCall('league-createLeague')(request);

export const joinLeague = request => functionToCall('league-joinLeague')(request);

export const leaveLeague = request => functionToCall('league-leaveLeague')(request);
