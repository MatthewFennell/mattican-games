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
    isRandomisingTeams: false,

    isAddingWord: false,

    isApprovingLeaveMidgame: false
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
    case actions.CLOSE_GAME_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
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
    default:
        return state;
    }
};

export default overviewReducer;
