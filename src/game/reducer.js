import * as actions from './actions';
import * as hitlerActions from './hitler/actions';

export const initialState = {
    errorCode: '',
    errorMessage: '',
    errorHeader: '',

    haveClosedPeekModal: false,
    haveClosedFirstInvestigation: false,
    haveClosedSecondInvestigation: false,

    isAddingTeam: false,
    isRandomisingTeams: false
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
    default:
        return state;
    }
};

export default overviewReducer;
