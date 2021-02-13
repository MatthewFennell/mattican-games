import { functionToCall } from '../api/api';

export const removeNotification = request => functionToCall('notification-removeNotification')(request);
