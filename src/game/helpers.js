
import fp from 'lodash/fp';
// eslint-disable-next-line import/prefer-default-export
export const mapUserIdToName = (users, userId) => fp.flow(fp.get(userId), fp.get('displayName'))(users);
