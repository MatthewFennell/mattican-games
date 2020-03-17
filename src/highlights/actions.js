const pre = 'HIGHLIGHTS/';

export const SUBMIT_HIGHLIGHT_REQUEST = `${pre}SUBMIT_HIGHLIGHT_REQUEST`;

export const FETCH_HIGHLIGHTS_REQUEST = `${pre}FETCH_HIGHLIGHTS_REQUEST`;
export const FETCH_HIGHLIGHTS_SUCCESS = `${pre}FETCH_HIGHLIGHTS_SUCCESS`;
export const ALREADY_FETCHED_VIDEOS = `${pre}ALREADY_FETCHED_VIDEOS`;

export const UPVOTE_HIGHLIGHT_REQUEST = `${pre}UPVOTE_HIGHLIGHT_REQUEST`;
export const UPVOTE_HIGHLIGHT_SUCCESS = `${pre}UPVOTE_HIGHLIGHT_SUCCESS`;

export const DOWNVOTE_HIGHLIGHT_REQUEST = `${pre}DOWNVOTE_HIGHLIGHT_REQUEST`;
export const DOWNVOTE_HIGHLIGHT_SUCCESS = `${pre}DOWNVOTE_HIGHLIGHT_SUCCESS`;

export const FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_REQUEST = `${pre}FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_REQUEST`;
export const FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_SUCCESS = `${pre}FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_SUCCESS`;
export const ALREADY_FETCHED_APPROVED_HIGHLIGHTS = `${pre}ALREADY_FETCHED_APPROVED_HIGHLIGHTS`;

export const FETCH_REJECTED_HIGHLIGHTS_REQUEST = `${pre}FETCH_REJECTED_HIGHLIGHTS_REQUEST`;
export const FETCH_REJECTED_HIGHLIGHTS_SUCCESS = `${pre}FETCH_REJECTED_HIGHLIGHTS_SUCCESS`;
export const ALREADY_FETCHED_REJECTED_VIDEOS = `${pre}ALREADY_FETCHED_REJECTED_VIDEOS`;

export const ADD_COMMENT_TO_VIDEO_REQUEST = `${pre}ADD_COMMENT_TO_VIDEO_REQUEST`;
export const ADD_COMMENT_TO_VIDEO_SUCCESS = `${pre}ADD_COMMENT_TO_VIDEO_SUCCESS`;

export const ADD_REPLY_TO_VIDEO_REQUEST = `${pre}ADD_REPLY_TO_VIDEO_REQUEST`;
export const ADD_REPLY_TO_VIDEO_SUCCESS = `${pre}ADD_REPLY_TO_VIDEO_SUCCESS`;

export const DELETE_COMMENT_REQUEST = `${pre}DELETE_COMMENT_REQUEST`;
export const DELETE_COMMENT_SUCCESS = `${pre}DELETE_COMMENT_SUCCESS`;

export const DELETE_REPLY_REQUEST = `${pre}DELETE_REPLY_REQUEST`;
export const DELETE_REPLY_SUCCESS = `${pre}DELETE_REPLY_SUCCESS`;

export const SET_HIGHLIGHT_ERROR = `${pre}SET_HIGHLIGHT_ERROR`;
export const CLOSE_HIGHLIGHT_ERROR = `${pre}CLOSE_HIGHLIGHT_ERROR`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const setHighlightError = (error, header) => ({
    type: SET_HIGHLIGHT_ERROR,
    error,
    header
});

export const closeHighlightError = () => ({
    type: CLOSE_HIGHLIGHT_ERROR
});

export const alreadyFetchedRejectedVideos = () => ({
    type: ALREADY_FETCHED_REJECTED_VIDEOS
});

export const fetchRejectedHighlightsRequest = () => ({
    type: FETCH_REJECTED_HIGHLIGHTS_REQUEST
});

export const fetchRejectedHighlightsSuccess = highlights => ({
    type: FETCH_REJECTED_HIGHLIGHTS_SUCCESS,
    highlights
});

export const alreadyFetchedApprovedHighlights = () => ({
    type: ALREADY_FETCHED_APPROVED_HIGHLIGHTS
});

export const fetchUserHighlightsToBeApprovedRequest = () => ({
    type: FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_REQUEST
});

export const fetchUserHighlightsToBeApprovedSuccess = highlights => ({
    type: FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_SUCCESS,
    highlights
});

export const alreadyFetchedVideos = () => ({
    type: ALREADY_FETCHED_VIDEOS
});

export const downvoteHighlightRequest = highlightId => ({
    type: DOWNVOTE_HIGHLIGHT_REQUEST,
    highlightId
});

export const downvoteHighlightSuccess = highlight => ({
    type: DOWNVOTE_HIGHLIGHT_SUCCESS,
    highlight
});

export const upvoteHighlightRequest = highlightId => ({
    type: UPVOTE_HIGHLIGHT_REQUEST,
    highlightId
});

export const upvoteHighlightSuccess = highlight => ({
    type: UPVOTE_HIGHLIGHT_SUCCESS,
    highlight
});

export const fetchHighlightsRequest = () => ({
    type: FETCH_HIGHLIGHTS_REQUEST
});

export const fetchHighlightsSuccess = highlights => ({
    type: FETCH_HIGHLIGHTS_SUCCESS,
    highlights
});

export const submitHighlightRequest = (videoId, title) => ({
    type: SUBMIT_HIGHLIGHT_REQUEST,
    videoId,
    title
});

export const addCommentToVideoRequest = (comment, videoId) => ({
    type: ADD_COMMENT_TO_VIDEO_REQUEST,
    comment,
    videoId
});

export const addCommentToVideoSuccess = video => ({
    type: ADD_COMMENT_TO_VIDEO_SUCCESS,
    video
});

export const addReplyToVideoRequest = (reply, videoId, commentId) => ({
    type: ADD_REPLY_TO_VIDEO_REQUEST,
    reply,
    videoId,
    commentId
});

export const addReplyToVideoSuccess = video => ({
    type: ADD_REPLY_TO_VIDEO_SUCCESS,
    video
});

export const deleteCommentRequest = (videoId, commentId) => ({
    type: DELETE_COMMENT_REQUEST,
    videoId,
    commentId
});

export const deleteCommentSuccess = (videoId, commentId) => ({
    type: DELETE_COMMENT_SUCCESS,
    videoId,
    commentId
});

export const deleteReplyRequest = (videoId, commentId, replyId) => ({
    type: DELETE_REPLY_REQUEST,
    videoId,
    commentId,
    replyId
});

export const deleteReplySuccess = (videoId, commentId, replyId) => ({
    type: DELETE_REPLY_SUCCESS,
    videoId,
    commentId,
    replyId
});
