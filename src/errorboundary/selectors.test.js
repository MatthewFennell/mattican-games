import * as selectors from './selectors';

describe('ErrorBoundary selectors', () => {
    const uid = 'uid';
    const email = 'email';
    const displayName = 'displayname';
    const state = {
        firebase: {
            auth: {
                displayName,
                email,
                uid
            }
        }
    };

    it('Get display name', () => {
        expect(selectors.getAuthField(state, 'displayName')).toEqual(displayName);
    });

    it('Get email', () => {
        expect(selectors.getAuthField(state, 'email')).toEqual(email);
    });

    it('Get uid', () => {
        expect(selectors.getAuthField(state, 'uid')).toEqual(uid);
    });
});
