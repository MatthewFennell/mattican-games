
import fp from 'lodash/fp';

import * as constants from '../constants';
// eslint-disable-next-line import/prefer-default-export
export const mapUserIdToName = (users, userId) => fp.get(userId)(users);

export const isRoleGood = role => Object.values(constants.avalonRoles)
    .some(x => x.name === role && x.isGood);

export const printRoleName = role => {
    if (role === constants.avalonRoles.RegularGood.name) {
        return 'Regular Good';
    }
    if (role === constants.avalonRoles.RegularBad.name) {
        return 'Regular Bad';
    }
    return role;
};
