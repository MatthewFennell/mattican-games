import * as actions from './actions';

export const initialState = {
    errorCode: '',
    errorMessage: '',
    errorHeader: '',

    haveClosedPeekModal: false,
    haveClosedFirstInvestigation: false,
    haveSecondFirstInvestigation: false
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
    case actions.CLOSE_LOOK_AT_TOP_THREE_REQUEST: {
        return {
            ...state,
            haveClosedPeekModal: true
        };
    }
    case actions.CLOSE_LOOK_AT_INVESTIGATION_REQUEST: {
        return {
            ...state,
            haveClosedFirstInvestigation: action.isFirst,
            haveSecondFirstInvestigation: !action.isFirst
        };
    }
    default:
        return state;
    }
};

export default overviewReducer;
