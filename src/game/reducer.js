import * as actions from './actions';

export const initialState = {
    haveVoted: false,
    haveQuested: false
};

const avalonGameReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.MAKE_VOTE_REQUEST: {
        return {
            ...state,
            haveVoted: true
        };
    }
    case actions.CANCEL_VOTE_LOADING: {
        return {
            ...state,
            haveVoted: false
        };
    }
    case actions.MAKE_QUEST_REQUEST: {
        return {
            ...state,
            haveQuested: true
        };
    }
    case actions.CANCEL_QUEST_LOADING: {
        return {
            ...state,
            haveQuested: false
        };
    }
    default:
        return state;
    }
};

export default avalonGameReducer;
