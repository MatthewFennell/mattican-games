import {
    all, takeEvery, put, call, delay, takeLatest
} from 'redux-saga/effects';
import * as actions from './actions';
import * as featuresApi from './api';
import { successDelay } from '../constants';

export function* addReplyToComment(api, action) {
    try {
        yield call(api.addReply, {
            collection: 'feature-requests',
            reply: action.reply,
            collectionId: action.featureId,
            commentId: action.commentId
        });
    } catch (error) {
        yield put(actions.featureRequestError(error, 'Reply Error'));
    }
}

export function* addCommentToFeature(api, action) {
    try {
        yield call(api.addComment,
            {
                collection: 'feature-requests',
                comment: action.comment,
                collectionId: action.featureId
            });
    } catch (error) {
        yield put(actions.featureRequestError(error, 'Comment Error'));
    }
}

export function* submitFeature(api, action) {
    try {
        yield call(api.submitFeature, { description: action.description });
        yield put(actions.setSuccessMessage('Feature submitted successfully'));
        yield delay(successDelay);
        yield put(actions.closeSuccessMessage());
    } catch (error) {
        yield put(actions.featureRequestError(error, 'Submit Feature Error'));
    }
}

export function* deleteComment(api, action) {
    try {
        yield call(api.deleteComment, {
            collection: 'feature-requests',
            collectionId: action.featureId,
            commentId: action.commentId
        });
    } catch (error) {
        yield put(actions.featureRequestError(error, 'Delete Comment Error'));
    }
}

export function* deleteReply(api, action) {
    try {
        yield call(api.deleteReply, {
            collection: 'feature-requests',
            collectionId: action.featureId,
            commentId: action.commentId,
            replyId: action.replyId
        });
    } catch (error) {
        yield put(actions.featureRequestError(error, 'Delete Reply Error'));
    }
}

export default function* featureRequestSaga() {
    yield all([
        takeLatest(actions.SUBMIT_FEATURE_REQUEST, submitFeature, featuresApi),
        takeEvery(actions.ADD_COMMENT_TO_FEATURE_REQUEST, addCommentToFeature, featuresApi),
        takeEvery(actions.ADD_REPLY_TO_COMMENT_REQUEST, addReplyToComment, featuresApi),
        takeEvery(actions.DELETE_COMMENT_REQUEST, deleteComment, featuresApi),
        takeEvery(actions.DELETE_REPLY_REQUEST, deleteReply, featuresApi)
    ]);
}
