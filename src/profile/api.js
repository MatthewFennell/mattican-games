import { functionToCall } from '../api/api';

export const updateDisplayName = request => functionToCall('profile-updateDisplayName')(request);

export const updateTeamName = request => functionToCall('profile-updateTeamName')(request);

export const deleteUser = request => functionToCall('auth-deleteUser')(request);

export const linkFacebookAccount = request => functionToCall('profile-linkFacebookAccount')(request);

export const updateProfilePicture = request => functionToCall('profile-updateProfilePicture')(request);
