import * as actions from './actions';

export const initialState = {
    isAddingTeam: false,
    isRandomisingTeams: false
};

const whoInHatReducer = (state = initialState, action) => {
    switch (action.type) {
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

export default whoInHatReducer;
