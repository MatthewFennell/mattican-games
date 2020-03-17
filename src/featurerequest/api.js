import { functionToCall } from '../api/api';

export const submitFeature = request => functionToCall('features-submitFeature')(request);

export {
    addComment, addReply, deleteComment, deleteReply
} from '../common/api/api';
