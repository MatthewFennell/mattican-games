export const NOTIFICATION_TYPE_SUCCESS = 'success';
export const NOTIFICATION_TYPE_DANGER = 'danger';
export const NOTIFICATION_TYPE_INFO = 'info';
export const NOTIFICATION_TYPE_DEFAULT = 'default';
export const NOTIFICATION_TYPE_WARNING = 'warning';

export const commonNotificationProps = {
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    touchSlidingExit: {
        swipe: {
            duration: 400,
            timingFunction: 'ease-out',
            delay: 0
        },
        fade: {
            duration: 400,
            timingFunction: 'ease-out',
            delay: 0
        }
    }
};
