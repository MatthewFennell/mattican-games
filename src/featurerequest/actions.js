const pre = 'features/';


export const ADD_COMMENT_TO_FEATURE_REQUEST = `${pre}ADD_COMMENT_TO_FEATURE_REQUEST`;
export const ADD_REPLY_TO_COMMENT_REQUEST = `${pre}ADD_REPLY_TO_COMMENT_REQUEST`;

export const DELETE_COMMENT_REQUEST = `${pre}DELETE_COMMENT_REQUEST`;
export const DELETE_REPLY_REQUEST = `${pre}DELETE_REPLY_REQUEST`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const SUBMIT_FEATURE_REQUEST = `${pre}SUBMIT_FEATURE_REQUEST`;
export const FEATURE_REQUEST_ERROR = `${pre}FEATURE_REQUEST_ERROR`;
export const CLOSE_FEATURE_REQUEST_ERROR = `${pre}CLOSE_FEATURE_REQUEST_ERROR`;

export const closeFeatureRequestError = () => ({
    type: CLOSE_FEATURE_REQUEST_ERROR
});

export const featureRequestError = (error, header) => ({
    type: FEATURE_REQUEST_ERROR,
    error,
    header
});

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const submitFeatureRequest = description => ({
    type: SUBMIT_FEATURE_REQUEST,
    description
});

export const addCommentToFeatureRequest = (comment, featureId) => ({
    type: ADD_COMMENT_TO_FEATURE_REQUEST,
    comment,
    featureId
});

export const addReplyToCommentRequest = (reply, featureId, commentId) => ({
    type: ADD_REPLY_TO_COMMENT_REQUEST,
    reply,
    featureId,
    commentId
});

export const deleteCommentRequest = (featureId, commentId) => ({
    type: DELETE_COMMENT_REQUEST,
    featureId,
    commentId
});

export const deleteReplyRequest = (featureId, commentId, replyId) => ({
    type: DELETE_REPLY_REQUEST,
    featureId,
    commentId,
    replyId
});
