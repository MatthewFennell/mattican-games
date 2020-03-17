import fp from 'lodash/fp';

export const getAllTeams = state => state.admin.allTeams;
export const fetchedHighlightsForApproval = state => state.admin.loadedHighlightsForApproval;
export const fetchedRejectedHighlights = state => state.admin.loadedRejectedHighlights;
export const getUsersWithExtraRoles = state => state.admin.usersWithExtraRoles;
export const getPlayersInTeam = (state, teamName) => fp.get(teamName)(state.admin.teamsWithPlayers);
