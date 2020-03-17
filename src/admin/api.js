import { functionToCall } from '../api/api';

export const getUsersWithExtraRoles = request => functionToCall('auth-usersWithExtraRoles')(request).then(result => result.data);

export const addUserRole = request => functionToCall('auth-addUserRole')(request);
export const removeUserRole = request => functionToCall('auth-removeUserRole')(request);
