import * as actions from './actions';
import * as hitlerActions from './hitler/actions';
import * as whoInHatActions from './whoInHat/actions';

export const initialState = {
    errorCode: '',
    errorMessage: '',
    errorHeader: '',

    haveClosedPeekModal: false,
    haveClosedFirstInvestigation: false,
    haveClosedSecondInvestigation: false,

    isAddingTeam: false,
    isAddingWord: false,
    isDeletingGame: false,
    isLeavingGame: false,
    isKickingUser: false,
    isRandomisingTeams: false,
    isPlayingAgain: false,

    isStartingGame: false,

    isApprovingLeaveMidgame: false,

    isEditingDisplayName: false
};

const overviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.GAME_ERROR: {
        return {
            ...state,
            errorMessage: action.error.message,
            errorCode: action.error.code,
            errorHeader: action.header
        };
    }
    case actions.EDIT_DISPLAY_NAME: {
        return {
            ...state,
            isEditingDisplayName: true
        };
    }
    case actions.CANCEL_EDITING_DISPLAY_NAME: {
        return {
            ...state,
            isEditingDisplayName: false
        };
    }
    case actions.PLAY_AGAIN_REQUEST: {
        return {
            ...state,
            isPlayingAgain: true
        };
    }
    case actions.LEAVE_UNCONSTRAINED_GAME_REQUEST: {
        return {
            ...state,
            isLeavingGame: true
        };
    }
    case actions.CANCEL_LEAVE_GAME: {
        return {
            ...state,
            isLeavingGame: false
        };
    }
    case actions.CANCEL_PLAY_AGAIN: {
        return {
            ...state,
            isPlayingAgain: false
        };
    }
    case actions.KICK_USER_REQUEST: {
        return {
            ...state,
            isKickingUser: true
        };
    }
    case actions.CANCEL_KICK_USER: {
        return {
            ...state,
            isKickingUser: false
        };
    }
    case actions.CLOSE_GAME_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        };
    }
    case actions.SET_IS_STARTING_GAME: {
        return {
            ...state,
            isStartingGame: action.isStarting
        };
    }
    case hitlerActions.CLOSE_LOOK_AT_TOP_THREE_REQUEST: {
        return {
            ...state,
            haveClosedPeekModal: true
        };
    }
    case hitlerActions.CLOSE_LOOK_AT_INVESTIGATION_REQUEST: {
        return {
            ...state,
            haveClosedFirstInvestigation: action.isFirst,
            haveClosedSecondInvestigation: !action.isFirst
        };
    }
    case actions.SET_IS_RANDOMISING_TEAMS: {
        return {
            ...state,
            isRandomisingTeams: action.isRandomising
        };
    }
    case actions.SET_IS_ADDING_TEAM: {
        return {
            ...state,
            isAddingTeam: action.isAdding
        };
    }
    case actions.SET_IS_APPROVING_LEAVE_MIDGAME: {
        return {
            ...state,
            isApprovingLeaveMidgame: action.isApproving
        };
    }
    case whoInHatActions.ADD_WORD_REQUEST: {
        return {
            ...state,
            isAddingWord: true
        };
    }
    case whoInHatActions.CANCEL_ADDING_WORD: {
        return {
            ...state,
            isAddingWord: false
        };
    }
    case actions.DELETE_GAME_REQUEST: {
        return {
            ...state,
            isDeletingGame: true
        };
    }
    case actions.CANCEL_DELETING_GAME: {
        return {
            ...state,
            isDeletingGame: false
        };
    }
    default:
        return state;
    }
};

export default overviewReducer;
