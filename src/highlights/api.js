import { functionToCall } from '../api/api';

export const submitVideo = request => functionToCall('highlights-submitHighlightForApproval')(request);
export const getHighlights = request => functionToCall('highlights-getHighlights')(request).then(response => response.data);
export const upvoteHighlight = request => functionToCall('highlights-upvoteHighlight')(request).then(response => response.data);
export const downvoteHighlight = request => functionToCall('highlights-downvoteHighlight')(request).then(response => response.data);
export const getHighlightsToBeApproved = request => functionToCall('highlights-fetchUserHighlightsToBeApproved')(request).then(response => response.data);
export const getRejectedHighlights = request => functionToCall('highlights-fetchRejectedHighlights')(request).then(response => response.data);

export {
    addComment, addReply, deleteComment, deleteReply
} from '../common/api/api';
