import fp from 'lodash/fp';

export const getNotifications = state => {
    const profile = fp.flow(
        fp.get('firebase'),
        fp.get('profile')
    )(state);

    const isLoaded = fp.get('isLoaded')(profile);
    const isEmpty = fp.get('isEmpty')(profile);

    if (isLoaded && !isEmpty) {
        return fp.get('notifications')(profile);
    }
    return [];
};
