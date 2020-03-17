import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Auth reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('sign up error', () => {
        const action = actions.signUpError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            signUpError: 'Error message',
            signUpErrorCode: 'Error code'
        });
    });

    it('sign in error', () => {
        const action = actions.signInError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            signInError: 'Error message',
            signInErrorCode: 'Error code'
        });
    });

    it('send password reset email error', () => {
        const action = actions.sendPasswordResetEmailError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            passwordResetError: 'Error message',
            passwordResetErrorCode: 'Error code'
        });
    });

    it('resend verification email request', () => {
        const action = actions.resendEmailVerificationRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            sendingEmailVerification: true
        });
    });

    it('resend verification email success', () => {
        const action = actions.resendEmailVerificationSuccess();
        expect(reducer({
            ...initialState,
            sendingEmailVerification: true
        }, action)).toEqual({
            ...initialState,
            sendingEmailVerification: false
        });
    });

    it('resend verification email error', () => {
        const action = actions.resendEmailVerificationError({
            message: 'Error message',
            code: 'Error code'
        });
        expect(reducer({
            ...initialState,
            sendingEmailVerification: true
        }, action)).toEqual({
            ...initialState,
            sendingEmailVerification: false,
            resendVerificationEmailError: 'Error message',
            resendVerificationEmailErrorCode: 'Error code'
        });
    });

    it('close verification email error', () => {
        const action = actions.closeEmailVerificationError();
        expect(reducer({
            ...initialState,
            resendVerificationEmailError: 'Error message',
            resendVerificationEmailErrorCode: 'Error code'
        }, action)).toEqual({
            ...initialState,
            resendVerificationEmailError: '',
            resendVerificationEmailErrorCode: ''
        });
    });

    it('add permissions', () => {
        const currentPermissions = ['a', 'b', 'c'];
        const givingPermissions = ['b', 'c', 'd', 'e'];
        const newPermissions = ['a', 'b', 'c', 'd', 'e'];
        const action = actions.addPermissions(givingPermissions);
        expect(reducer({
            ...initialState,
            userPermissions: currentPermissions
        }, action)).toEqual({
            ...initialState,
            userPermissions: newPermissions
        });
    });

    it('set loaded permissions true', () => {
        const action = actions.setLoadedPermissions(true);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadedPermissions: true
        });
    });

    it('set permission mappings and rules', () => {
        const action = actions.setPermissionsMappingsAndRoles({
            mappings: ['a', 'b', 'c'],
            allRoles: ['All', 'Rol', 'Es']
        });
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            permissionMappings: ['a', 'b', 'c'],
            allRoles: ['All', 'Rol', 'Es']
        });
    });

    it('close auth error', () => {
        const action = actions.closeAuthError();
        expect(reducer({
            ...initialState,
            signUpError: 'abc',
            signUpErrorCode: 'def',
            signInError: 'ghi',
            signInErrorCode: 'jkl'
        }, action)).toEqual({
            ...initialState,
            signUpError: '',
            signUpErrorCode: '',
            signInError: '',
            signInErrorCode: ''
        });
    });
});
