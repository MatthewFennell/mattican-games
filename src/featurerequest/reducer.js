import fp from 'lodash/fp';
import * as actions from './actions';

export const initialState = {
    errorHeader: '',
    errorMessage: '',
    errorCode: '',

    successMessage: ''
};

const featureReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_SUCCESS_MESSAGE: {
        return fp.set('successMessage', action.message)(state);
    }
    case actions.CLOSE_SUCCESS_MESSAGE: {
        return fp.set('successMessage', '')(state);
    }
    case actions.FEATURE_REQUEST_ERROR: {
        return {
            ...state,
            errorMessage: action.error.message,
            errorCode: action.error.code,
            errorHeader: action.header
        };
    }
    case actions.CLOSE_FEATURE_REQUEST_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        };
    }
    default:
        return state;
    }
};

export default featureReducer;
