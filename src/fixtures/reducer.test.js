import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Fixtures reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch fixtures success', () => {
        const fixtures = ['a', 'b', 'c'];
        const action = actions.fetchFixturesSuccess(fixtures);
        expect(reducer({
            ...initialState,
            loadingFixtures: true
        }, action)).toEqual({
            ...initialState,
            fixtures,
            loadingFixtures: false
        });
    });

    it('already fetched fixtures', () => {
        const action = actions.alreadyFetchedFixtures();
        expect(reducer({
            ...initialState,
            loadingFixtures: true
        }, action)).toEqual({
            ...initialState,
            loadingFixtures: false
        });
    });

    it('fetch fixtures request', () => {
        const action = actions.fetchFixturesRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingFixtures: true
        });
    });

    it('fetch fixtures error', () => {
        const action = actions.fetchFixturesError(null);
        expect(reducer({
            ...initialState,
            loadingFixtures: true
        }, action)).toEqual({
            ...initialState,
            loadingFixtures: false
        });
    });

    it('set my team', () => {
        const team = 'Demancia';
        const action = actions.setMyTeam(team);
        expect(reducer({
            ...initialState,
            loadingMyTeam: true
        }, action)).toEqual({
            ...initialState,
            loadingMyTeam: false,
            myTeam: team
        });
    });

    it('fetch my team request', () => {
        const action = actions.fetchMyTeamRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingMyTeam: true
        });
    });

    it('set my team error', () => {
        const action = actions.setMyTeamError(null);
        expect(reducer({
            ...initialState,
            loadingMyTeam: true
        }, action)).toEqual({
            ...initialState,
            loadingMyTeam: false
        });
    });

    it('set my team request', () => {
        const action = actions.setMyTeamRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingMyTeam: true
        });
    });

    it('set fixtures error', () => {
        const action = actions.setFixturesError({
            message: 'Error message',
            code: 'Error code'
        }, 'Error header');
        expect(reducer({
            ...initialState,
            loadingFixtures: true,
            loadingMyTeam: true
        }, action)).toEqual({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header',
            loadingFixtures: false,
            loadingMyTeam: false
        });
    });

    it('close fixtures error', () => {
        const action = actions.closeFixturesError();
        expect(reducer({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header'
        }, action)).toEqual({
            ...initialState,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        });
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
});
