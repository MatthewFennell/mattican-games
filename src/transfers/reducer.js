import fp from 'lodash/fp';
import * as overviewActions from '../overview/actions';
import * as currentTeamActions from '../currentteam/actions';
import * as actions from './actions';
import * as adminActions from '../admin/actions';

export const initialState = {
    remainingTransfers: 0,
    remainingBudget: 0,
    originalBudget: 0,
    fetchingUserStats: false,

    originalTeam: [],
    currentTeam: [],
    fetchingOriginalTeam: false,

    allPlayers: [],
    fetchingAllPlayers: false,

    allTeams: [],
    transfersError: '',
    transfersErrorCode: '',

    successMessage: ''
};

const transfersReducer = (state = initialState, action) => {
    switch (action.type) {
    case overviewActions.FETCH_USER_STATS_REQUEST: {
        return fp.set('fetchingUserStats', true)(state);
    }
    case overviewActions.FETCH_USER_STATS_ERROR: {
        return fp.set('fetchingUserStats', false)(state);
    }
    case overviewActions.FETCH_USER_STATS_SUCCESS: {
        return {
            ...state,
            remainingTransfers: action.stats.remainingTransfers,
            originalBudget: action.stats.remainingBudget,
            remainingBudget: action.stats.remainingBudget,
            fetchingUserStats: false
        };
    }
    // ----------------------------------------------------- \\
    case currentTeamActions.FETCH_ACTIVE_TEAM_REQUEST: {
        return fp.set('fetchingOriginalTeam', true)(state);
    }
    case currentTeamActions.FETCH_ACTIVE_TEAM_SUCCESS: {
        return fp.flow(
            fp.set('originalTeam', action.activeTeam),
            fp.set('currentTeam', action.activeTeam),
            fp.set('fetchingOriginalTeam', false)
        )(state);
    }
    case currentTeamActions.FETCH_ACTIVE_TEAM_ERROR: {
        return fp.set('fetchingOriginalTeam', false)(state);
    }
    case currentTeamActions.ALREADY_FETCHED_ACTIVE_TEAM: {
        return fp.set('fetchingOriginalTeam', false)(state);
    }
    // ----------------------------------------------------- \\
    case actions.FETCH_ALL_PLAYERS_SUCCESS: {
        return {
            ...state,
            fetchingAllPlayers: false,
            allPlayers: action.players
        };
    }
    case actions.FETCH_ALL_PLAYERS_REQUEST: {
        return fp.set('fetchingAllPlayers', true)(state);
    }
    case actions.FETCH_ALL_PLAYERS_ERROR: {
        return {
            ...state,
            fetchingAllPlayers: false
        };
    }
    // ----------------------------------------------------- \\
    case actions.FETCH_ALL_TEAMS_SUCCESS: {
        return fp.set('allTeams', action.teams)(state);
    }
    case actions.ADD_PLAYER_TO_CURRENT_TEAM_SUCCESS: {
        const index = state.currentTeam
            .findIndex(x => x.position === action.player.position && x.inactive);
        const newTeam = index === -1 ? state.currentTeam.concat([action.player])
            : state.currentTeam.map((p, i) => (index === i ? action.player : p));
        if (newTeam.length === 12) {
            const firstIndex = state.currentTeam.findIndex(x => x.inactive);
            newTeam.splice(firstIndex, 1);
        }

        return fp.flow(
            fp.set('currentTeam', newTeam),
            fp.set('remainingBudget', state.remainingBudget - action.player.price),
        )(state);
    }
    case actions.ADD_PLAYER_TO_CURRENT_TEAM_ERROR: {
        return {
            ...state,
            transfersError: action.error.message,
            transfersErrorCode: action.error.code
        };
    }
    case actions.CLOSE_TRANSFERS_ERROR: {
        return {
            ...state,
            transfersError: '',
            transfersErrorCode: ''
        };
    }
    case actions.UNDO_TRANSFER_CHANGES: {
        return fp.flow(
            fp.set('currentTeam', state.originalTeam),
            fp.set('remainingBudget', state.originalBudget),
        )(state);
    }
    case actions.REMOVE_PLAYER_FROM_CURRENT_TEAM: {
        const remove = player => {
            if (state.originalTeam.some(x => x.id === player.id)) {
                return fp.set('currentTeam', state.currentTeam.map(x => (x.id !== action.player.id ? x
                    : ({
                        id: x.id, inactive: true, position: x.position, name: `${action.player.name} (removed)`, price: 0
                    }))));
            }
            return fp.set('currentTeam', state.currentTeam.filter(x => x.id !== player.id));
        };

        return fp.flow(
            remove(action.player),
            fp.set('remainingBudget', state.remainingBudget + action.player.price)
        )(state);
    }
    case actions.ALREADY_FETCHED_ALL_PLAYERS: {
        return fp.set('fetchingAllPlayers', false)(state);
    }
    case actions.UPDATE_TEAM_ERROR: {
        return {
            ...state,
            transfersError: action.error.message,
            transfersErrorCode: action.error.code,
            fetchingOriginalTeam: false
        };
    }
    case actions.RESTORE_PLAYER_REQUEST: {
        const playerToRestore = state.allPlayers.find(x => x.id === action.playerId);

        return fp.flow(
            fp.set('currentTeam', state.currentTeam.map(x => (x.id === action.playerId ? playerToRestore : x))),
            fp.set('remainingBudget', state.remainingBudget - playerToRestore.price)
        )(state);
    }
    case actions.REPLACE_PLAYER_SUCCESS: {
        const budgetDiff = action.oldPlayer.price - action.newPlayer.price;
        return fp.flow(
            fp.set('currentTeam', state.currentTeam.map(x => (x.id === action.oldPlayer.id ? action.newPlayer : x))),
            fp.set('remainingBudget', state.remainingBudget + budgetDiff)
        )(state);
    }
    case actions.UPDATE_TEAM_REQUEST: {
        return fp.set('fetchingOriginalTeam', true)(state);
    }
    case actions.SET_SUCCESS_MESSAGE: {
        return fp.set('successMessage', action.message)(state);
    }
    case actions.CLOSE_SUCCESS_MESSAGE: {
        return fp.set('successMessage', '')(state);
    }
    case adminActions.SET_HAS_PAID_SUBS_SUCCESS: {
        return {
            ...state,
            allPlayers: state.allPlayers
                .map(player => (action.changes.some(x => x.playerId === player.id) ? ({
                    ...player,
                    hasPaidSubs: action.changes.find(y => y.playerId === player.id).hasPaidSubs
                }) : player))
        };
    }
    default:
        return state;
    }
};

export default transfersReducer;
