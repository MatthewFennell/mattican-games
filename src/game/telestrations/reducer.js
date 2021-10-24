import * as actions from './actions';

export const initialState = {
    isAddingWord: false
};

const telestrationsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.ADD_WORD_REQUEST: {
        return {
            ...state,
            isAddingWord: true
        };
    }
    case actions.CANCEL_ADDING_WORD: {
        return {
            ...state,
            isAddingWord: false
        };
    }
    default:
        return state;
    }
};

export default telestrationsReducer;
