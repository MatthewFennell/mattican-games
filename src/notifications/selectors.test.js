import * as selectors from './selectors';

describe('Notifications selectors', () => {
    const notifications = ['some', 'cool', 'notifications'];

    const stateNotLoaded = {
        firebase: {
            profile: {
                isLoaded: false,
                isEmpty: false,
                notifications
            }
        }
    };

    const stateLoaded = {
        firebase: {
            profile: {
                isLoaded: true,
                isEmpty: false,
                notifications
            }
        }
    };

    it('No notifications when not loaded', () => {
        expect(selectors.getNotifications(stateNotLoaded)).toEqual([]);
    });

    it('Get notifications when loaded', () => {
        expect(selectors.getNotifications(stateLoaded)).toEqual(notifications);
    });
});
