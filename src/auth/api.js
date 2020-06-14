import { functionToCall } from '../api/api';

export const updateDisplayName = request => functionToCall('profile-updateDisplayName')(request);
export const getRolePermissions = request => functionToCall('auth-getRolePermissions')(request).then(response => response.data);

export const editDisabledPages = request => functionToCall('editDisabledPages')(request);
