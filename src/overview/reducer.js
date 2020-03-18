import * as actions from './actions';

export const initialState = {
    creatingGame: false
};

const overviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.CREATE_GAME_REQUEST: {
        return {
            ...state,
            creatingGame: true
        };
    }
    case actions.CREATE_GAME_SUCCESS: {
        return {
            ...state,
            creatingGame: false
        };
    }
    default:
        return state;
    }
};

export default overviewReducer;
