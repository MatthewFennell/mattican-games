import { functionToCall } from '../../api/api';

export const addComment = request => functionToCall('comments-addComment')(request)
    .then(response => response.data);

export const addReply = request => functionToCall('comments-addReply')(request)
    .then(response => response.data);

export const deleteComment = request => functionToCall('comments-deleteComment')(request)
    .then(response => response.data);

export const deleteReply = request => functionToCall('comments-deleteReply')(request)
    .then(response => response.data);
