import * as actions from './actions';

export const initialState = {
    isAddingWord: false,
    isEditingSpies: false
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
    case actions.EDIT_NUMBER_OF_SPIES: {
        return {
            ...state,
            isEditingSpies: true
        };
    }
    case actions.CANCEL_EDITING_SPIES: {
        return {
            ...state,
            isEditingSpies: false
        };
    }
    default:
        return state;
    }
};

export default telestrationsReducer;
