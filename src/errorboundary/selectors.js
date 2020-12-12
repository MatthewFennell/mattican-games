import fp from 'lodash/fp';

export const getAuthField = (state, field) => fp.flow(
    fp.get('firebase'),
    fp.get('auth'),
    fp.get(field)
)(state);
