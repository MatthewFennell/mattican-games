import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    allTeams: [],
    teamsWithPlayers: {},
    playerStats: {},
    usersWithExtraRoles: [],
    highlightsForApproval: [],
    rejectedHighlights: [],

    creatingPlayer: false,
    deletingPlayer: false,
    creatingTeam: false,
    deletingTeam: false,

    submittingResult: false,
    submittingExtraResults: false,
    editingStats: false,
    triggeringWeek: false,

    fetchingPlayerStats: false,
    fetchingUsersWithExtraRoles: false,

    loadingHighlightsForApproval: false,
    loadedHighlightsForApproval: false,
    loadingRejectedHighlights: false,
    loadedRejectedHighlights: false,

    updatingSubs: false,

    successMessage: '',
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_TEAMS_SUCCESS: {
        return {
            ...state,
            allTeams: action.teams
        };
    }
    case actions.CREATE_PLAYER_REQUEST: {
        return fp.set('creatingPlayer', true)(state);
    }
    case actions.CREATE_PLAYER_SUCCESS: {
        return fp.set('creatingPlayer', false)(state);
    }
    case actions.CREATE_TEAM_REQUEST: {
        return fp.set('creatingTeam', true)(state);
    }
    case actions.CREATE_TEAM_SUCCESS: {
        return fp.set('creatingTeam', false)(state);
    }
    case actions.FETCH_PLAYERS_FOR_TEAM_SUCCESS: {
        return {
            ...state,
            teamsWithPlayers: fp.set(action.teamName, action.players)(state.teamsWithPlayers)
        };
    }
    case actions.DELETE_PLAYER_REQUEST: {
        return fp.set('deletingPlayer', true)(state);
    }
    case actions.DELETE_PLAYER_SUCCESS: {
        return fp.set('deletingPlayer', false)(state);
    }
    case actions.DELETE_TEAM_REQUEST: {
        return fp.set('deletingTeam', true)(state);
    }
    case actions.DELETE_TEAM_SUCCESS: {
        return fp.set('deletingTeam', false)(state);
    }
    case actions.SUBMIT_RESULT_REQUEST: {
        return fp.set('submittingResult', true)(state);
    }
    case actions.SUBMIT_RESULT_SUCCESS: {
        return fp.set('submittingResult', false)(state);
    }
    case actions.TRIGGER_WEEK_SUCCESS: {
        return fp.set('triggeringWeek', false)(state);
    }
    case actions.TRIGGER_WEEK_REQUEST: {
        return fp.set('triggeringWeek', true)(state);
    }
    case actions.FETCH_PLAYER_STATS_SUCCESS: {
        return fp.flow(
            fp.set('playerStats.fetching', false),
            fp.set('playerStats.assists', action.playerStats.assists),
            fp.set('playerStats.cleanSheet', action.playerStats.cleanSheet),
            fp.set('playerStats.goals', action.playerStats.goals),
            fp.set('playerStats.redCard', action.playerStats.redCard),
            fp.set('playerStats.yellowCard', action.playerStats.yellowCard),
            fp.set('playerStats.manOfTheMatch', action.playerStats.manOfTheMatch),
            fp.set('playerStats.dickOfTheDay', action.playerStats.dickOfTheDay),
            fp.set('playerStats.ownGoals', action.playerStats.ownGoals),
            fp.set('playerStats.penaltyMisses', action.playerStats.penaltyMisses),
            fp.set('playerStats.penaltySaves', action.playerStats.penaltySaves),
            fp.set('fetchingPlayerStats', false)
        )(state);
    }
    case actions.FETCH_PLAYER_STATS_REQUEST: {
        return fp.set('fetchingPlayerStats', true)(state);
    }
    case actions.FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS: {
        return {
            ...state,
            usersWithExtraRoles: action.usersWithExtraRoles,
            fetchingUsersWithExtraRoles: false
        };
    }
    case actions.FETCH_USERS_WITH_EXTRA_ROLES_REQUEST: {
        return fp.set('fetchingUsersWithExtraRoles', true)(state);
    }
    case actions.LOAD_USERS_WITH_EXTRA_ROLES: {
        return fp.set('fetchingUsersWithExtraRoles', true)(state);
    }
    case actions.ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES: {
        return fp.set('fetchingUsersWithExtraRoles', false)(state);
    }
    case actions.FETCH_HIGHLIGHTS_FOR_APPROVAL_SUCCESS: {
        return {
            ...state,
            highlightsForApproval: action.highlights,
            loadingHighlightsForApproval: false,
            loadedHighlightsForApproval: true
        };
    }
    case actions.ALREADY_FETCHED_HIGHLIGHTS_FOR_APPROVAL: {
        return fp.set('loadingHighlightsForApproval', false)(state);
    }
    case actions.FETCH_HIGHLIGHTS_FOR_APPROVAL_REQUEST: {
        return fp.set('loadingHighlightsForApproval', true)(state);
    }
    case actions.APPROVE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            highlightsForApproval: state.highlightsForApproval
                .filter(x => x.id !== action.highlight.id)
        };
    }
    case actions.REJECT_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            highlightsForApproval: state.highlightsForApproval
                .filter(x => x.id !== action.highlight.id),
            rejectedHighlights: state.rejectedHighlights.concat([action.highlight])
        };
    }
    case actions.FETCH_ALL_REJECTED_HIGHLIGHTS_REQUEST: {
        return fp.set('loadingRejectedHighlights', true)(state);
    }
    case actions.REAPPROVE_REJECTED_HIGHLIGHT_REQUEST: {
        return fp.set('loadingRejectedHighlights', true)(state);
    }
    case actions.FETCH_ALL_REJECTED_HIGHLIGHTS_SUCCESS: {
        return {
            ...state,
            loadedRejectedHighlights: true,
            rejectedHighlights: action.highlights,
            loadingRejectedHighlights: false
        };
    }
    case actions.REAPPROVE_REJECTED_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            rejectedHighlights: state.rejectedHighlights.filter(x => x.id !== action.highlight.id),
            loadingRejectedHighlights: false
        };
    }
    case actions.DELETE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            rejectedHighlights: state.rejectedHighlights.concat([action.highlight]),
            loadingRejectedHighlights: false
        };
    }
    case actions.ALREADY_FETCHED_REJECTED_HIGHLIGHTS: {
        return fp.set('loadingRejectedHighlights', false)(state);
    }
    case actions.DELETE_HIGHLIGHT_REQUEST: {
        return fp.set('loadingRejectedHighlights', true)(state);
    }
    case actions.SUBMIT_EXTRA_STATS_REQUEST: {
        return fp.set('submittingExtraResults', true)(state);
    }
    case actions.SUBMIT_EXTRA_STATS_SUCCESS: {
        return fp.set('submittingExtraResults', false)(state);
    }
    case actions.EDIT_PLAYER_STATS_REQUEST: {
        return fp.set('editingStats', true)(state);
    }
    case actions.EDIT_PLAYER_STATS_SUCCESS: {
        return fp.set('editingStats', false)(state);
    }
    case actions.SET_SUCCESS_MESSAGE: {
        return fp.set('successMessage', action.message)(state);
    }
    case actions.CLOSE_SUCCESS_MESSAGE: {
        return fp.set('successMessage', '')(state);
    }
    case actions.SET_ADMIN_ERROR: {
        return {
            ...state,
            errorMessage: action.error.message,
            errorCode: action.error.code,
            errorHeader: action.header
        };
    }
    case actions.CLOSE_ADMIN_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: '',
            creatingPlayer: false,
            creatingTeam: false,
            deletingPlayer: false,
            deletingTeam: false,
            submittingResult: false,
            triggeringWeek: false,
            fetchingPlayerStats: false,
            fetchingUsersWithExtraRoles: false,
            loadingHighlightsForApproval: false,
            loadingRejectedHighlights: false,
            editingStats: false
        };
    }
    case actions.SET_HAS_PAID_SUBS_REQUEST: {
        return fp.set('updatingSubs', true)(state);
    }
    case actions.SET_HAS_PAID_SUBS_SUCCESS: {
        return fp.set('updatingSubs', false)(state);
    }
    default:
        return state;
    }
};

export default adminReducer;
