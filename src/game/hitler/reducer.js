import * as actions from './actions';

export const initialState = {
    hasRequestedVeto: false,
    hasRepliedToVeto: false
};

const hitlerReducing = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_HAS_REQUESTED_VETO: {
        return {
            ...state,
            hasRequestedVeto: action.hasRequested
        };
    }
    case actions.SET_HAS_REPLIED_TO_VETO: {
        return {
            ...state,
            hasRepliedToVeto: action.hasRequested
        };
    }
    default:
        return state;
    }
};

export default hitlerReducing;
