import reducer, { initialState } from './reducer';
import * as actions from './actions';


describe('Profile reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('link to facebook error', () => {
        const action = actions.linkProfileToFacebookError({
            email: 'Email',
            code: 'code',
            message: 'Message'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            attemptedEmailToLink: 'Email',
            linkAccountErrorCode: 'code',
            linkAccountError: 'Message'
        });
    });

    it('link to google error', () => {
        const action = actions.linkProfileToGoogleError({
            email: 'Email',
            code: 'code',
            message: 'Message'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            attemptedEmailToLink: 'Email',
            linkAccountErrorCode: 'code',
            linkAccountError: 'Message'
        });
    });

    it('close account link error', () => {
        const action = actions.closeAccountLinkError();
        expect(reducer({
            ...initialState,
            attemptedEmailToLink: 'abc',
            linkAccountError: 'abc',
            linkAccountErrorCode: 'abc'
        }, action)).toEqual({
            ...initialState,
            attemptedEmailToLink: '',
            linkAccountErrorCode: '',
            linkAccountError: ''
        });
    });

    it('update display name request', () => {
        const action = actions.updateDisplayNameRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updatingDisplayName: true
        });
    });

    it('update display name success', () => {
        const action = actions.updateDisplayNameSuccess();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updatingDisplayName: false
        });
    });

    it('update display name error', () => {
        const action = actions.updateDisplayNameError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updatingDisplayName: false,
            updateDisplayNameError: 'Error message',
            updateDisplayNameErrorCode: 'Error code'
        });
    });

    it('close display name error', () => {
        const action = actions.closeDisplayNameError();
        expect(reducer({
            ...initialState,
            updateDisplayNameError: 'Error message',
            updateDisplayNameErrorCode: 'Error code'
        }, action)).toEqual({
            ...initialState,
            updateDisplayNameError: '',
            updateDisplayNameErrorCode: ''
        });
    });

    it('update team name request', () => {
        const action = actions.updateTeamNameRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updatingTeamName: true
        });
    });

    it('update team name success', () => {
        const action = actions.updateTeamNameSuccess();
        expect(reducer({
            ...initialState,
            updatingTeamName: true
        }, action)).toEqual({
            ...initialState,
            updatingTeamName: false
        });
    });

    it('update team name error', () => {
        const action = actions.updateTeamNameError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer({
            ...initialState,
            updatingTeamName: true
        }, action)).toEqual({
            ...initialState,
            updatingTeamName: false,
            updateTeamNameError: 'Error message',
            updateTeamNameErrorCode: 'Error code'
        });
    });

    it('close team name error', () => {
        const action = actions.closeTeamNameError();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            updateTeamNameError: '',
            updateTeamNameErrorCode: ''
        });
    });

    it('delete account error', () => {
        const action = actions.deleteAccountError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            deleteAccountError: 'Error message',
            deleteAccountErrorCode: 'Error code'
        });
    });

    it('close delete account error', () => {
        const action = actions.closeDeleteAccountError();
        expect(reducer({
            ...initialState,
            deleteAccountError: 'Error message',
            deleteAccountErrorCode: 'Error code'
        }, action)).toEqual({
            ...initialState,
            deleteAccountError: '',
            deleteAccountErrorCode: ''
        });
    });

    it('delete account request', () => {
        const action = actions.deleteAccountRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            deletingAccount: true
        });
    });

    it('delete account success', () => {
        const action = actions.deleteAccountSuccess();
        expect(reducer({
            ...initialState,
            deletingAccount: true
        }, action)).toEqual({
            ...initialState,
            deletingAccount: false
        });
    });
});
