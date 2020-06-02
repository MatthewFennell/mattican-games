import * as actions from './actions';

export const initialState = {
    generatingMove: false
};

const othelloReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_GENERATING_MOVE: {
        return {
            ...state,
            generatingMove: action.isGenerating
        };
    }
    default:
        return state;
    }
};

export default othelloReducer;
