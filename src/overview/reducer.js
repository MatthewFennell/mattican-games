import * as actions from './actions';

export const initialState = {
    creatingGame: false,
    joiningGame: false,
    settingDisplayName: false
};

const overviewReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.JOIN_GAME_REQUEST: {
        return {
            ...state,
            joiningGame: true
        };
    }
    case actions.STOP_CREATE_GAME: {
        return {
            ...state,
            creatingGame: false
        };
    }
    case actions.STOP_JOIN_GAME: {
        return {
            ...state,
            joiningGame: false
        };
    }
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
