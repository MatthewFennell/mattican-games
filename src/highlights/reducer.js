import fp from 'lodash/fp';
import * as actions from './actions';
import * as adminActions from '../admin/actions';
import * as profileActions from '../profile/actions';

export const initialState = {
    loadingVideos: false,
    loadingVideosToBeApproved: false,
    loadingRejectedVideos: false,
    videos: [],
    videosToBeApproved: [],
    videosRejected: [],

    loadedVideos: false,
    loadedRejectedVideos: false,
    loadedVideosToBeApproved: false,

    errorHeader: '',
    errorMessage: '',
    errorCode: '',

    successMessage: ''
};

const highlightsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.FETCH_HIGHLIGHTS_SUCCESS: {
        return {
            ...state,
            videos: action.highlights,
            loadingVideos: false,
            loadedVideos: true
        };
    }
    case actions.FETCH_HIGHLIGHTS_REQUEST: {
        return fp.set('loadingVideos', true)(state);
    }
    case actions.UPVOTE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.highlight.id ? action.highlight : x))
        };
    }
    case actions.DOWNVOTE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.highlight.id ? action.highlight : x))
        };
    }
    case actions.ALREADY_FETCHED_VIDEOS: {
        return fp.set('loadingVideos', false)(state);
    }
    case actions.FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_SUCCESS: {
        return {
            ...state,
            loadingVideosToBeApproved: false,
            videosToBeApproved: action.highlights,
            loadedVideosToBeApproved: true
        };
    }
    case actions.FETCH_REJECTED_HIGHLIGHTS_SUCCESS: {
        return {
            ...state,
            loadingRejectedVideos: false,
            videosRejected: action.highlights,
            loadedRejectedVideos: true
        };
    }
    case actions.FETCH_USER_HIGHLIGHTS_TO_BE_APPROVED_REQUEST: {
        return fp.set('loadingVideosToBeApproved', true)(state);
    }
    case actions.FETCH_REJECTED_HIGHLIGHTS_REQUEST: {
        return fp.set('loadingRejectedVideos', true)(state);
    }
    case actions.ALREADY_FETCHED_REJECTED_VIDEOS: {
        return fp.set('loadingRejectedVideos', false)(state);
    }
    case actions.ALREADY_FETCHED_APPROVED_HIGHLIGHTS: {
        return fp.set('loadingVideosToBeApproved', false)(state);
    }
    case adminActions.DELETE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.filter(x => x.id !== action.highlight.id),
            loadingVideos: false
        };
    }
    case adminActions.APPROVE_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.concat([action.highlight]),
            loadingVideos: false
        };
    }
    case adminActions.REAPPROVE_REJECTED_HIGHLIGHT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.concat([action.highlight]),
            loadingVideos: false
        };
    }
    case adminActions.APPROVE_HIGHLIGHT_REQUEST: {
        return fp.set('loadingVideos', true)(state);
    }
    case adminActions.REAPPROVE_REJECTED_HIGHLIGHT_REQUEST: {
        return fp.set('loadingVideos', true)(state);
    }
    case adminActions.DELETE_HIGHLIGHT_REQUEST: {
        return fp.set('loadingVideos', true)(state);
    }
    case actions.ADD_COMMENT_TO_VIDEO_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.video.id ? action.video : x))
        };
    }
    case actions.ADD_REPLY_TO_VIDEO_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.video.id ? action.video : x))
        };
    }
    case actions.DELETE_COMMENT_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.videoId ? ({
                ...x,
                comments: x.comments.filter(y => y.id !== action.commentId)
            }) : x))
        };
    }
    case actions.DELETE_REPLY_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => (x.id === action.videoId ? ({
                ...x,
                comments: x.comments.map(y => (y.id === action.commentId ? ({
                    ...y,
                    comments: y.comments.filter(z => z.id !== action.replyId)
                }) : y))
            }) : x))
        };
    }
    case profileActions.UPDATE_PROFILE_PICTURE_SUCCESS: {
        return {
            ...state,
            videos: state.videos.map(x => ({
                ...x,
                comments: x.comments.map(y => (y.userId === action.userId ? ({
                    ...y,
                    comments: y.comments.map(z => (z.userId === action.userId ? ({
                        ...z,
                        photoUrl: action.photoUrl
                    }) : z)),
                    photoUrl: action.photoUrl
                }) : ({
                    ...y,
                    comments: y.comments.map(z => (z.userId === action.userId ? ({
                        ...z,
                        photoUrl: action.photoUrl
                    }) : z))
                })))
            }))
        };
    }
    case actions.SET_HIGHLIGHT_ERROR: {
        return {
            ...state,
            errorMessage: action.error.message,
            errorCode: action.error.code,
            errorHeader: action.header
        };
    }
    case actions.CLOSE_HIGHLIGHT_ERROR: {
        return {
            ...state,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        };
    }
    case actions.SET_SUCCESS_MESSAGE: {
        return fp.set('successMessage', action.message)(state);
    }
    case actions.CLOSE_SUCCESS_MESSAGE: {
        return fp.set('successMessage', '')(state);
    }
    default:
        return state;
    }
};

export default highlightsReducer;
