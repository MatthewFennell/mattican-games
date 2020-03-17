import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Fixtures reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('set success message', () => {
        const action = actions.setSuccessMessage('message');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            successMessage: 'message'
        });
    });

    it('close success message', () => {
        const action = actions.closeSuccessMessage();
        expect(reducer({
            ...initialState,
            successMessage: 'message'
        }, action)).toEqual({
            ...initialState,
            successMessage: ''
        });
    });

    it('feature request error', () => {
        const action = actions.featureRequestError({
            message: 'Error message',
            code: 'Error code'
        }, 'Error header');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header'
        });
    });

    it('close feature request error', () => {
        const action = actions.closeFeatureRequestError();
        expect(reducer({
            ...initialState,
            errorCode: 'abc',
            errorHeader: 'abc',
            errorMessage: 'abc'
        }, action)).toEqual({
            ...initialState,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        });
    });
});
