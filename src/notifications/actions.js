import * as constants from './constants';

const pre = 'NOTIFICATIONS/';

export const CLOSE_NOTIFICATION = `${pre}CLOSE_NOTIFICATION`;
export const ADD_NOTIFICATION = `${pre}ADD_NOTIFICATION`;

export const closeNotification = notification => ({
    type: CLOSE_NOTIFICATION,
    notification
});

export const addNotification = (notification,
    notificationType = constants.NOTIFICATION_TYPE_SUCCESS,
    duration = 5000, title = 'Success') => ({
    type: ADD_NOTIFICATION,
    notification,
    notificationType,
    duration,
    title
});
