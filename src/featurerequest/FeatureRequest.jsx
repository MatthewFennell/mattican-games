import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import _, { noop } from 'lodash';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import {
    addReplyToCommentRequest, submitFeatureRequest, addCommentToFeatureRequest,
    deleteCommentRequest, deleteReplyRequest, closeFeatureRequestError, closeSuccessMessage
} from './actions';
import AllFeatureRequests from './AllFeatureRequests';
import ErrorModal from '../common/modal/ErrorModal';
import SubmitFeature from './SubmitFeature';
import SuccessModal from '../common/modal/SuccessModal';


const FeatureRequest = props => {
    const [description, setDescription] = useState('');
    const [submitFeatureRequestOpen, setSubmitFeatureRequestOpen] = useState(false);

    const updateDescription = useCallback(e => {
        const text = e.target.value;
        if (text.length <= 180) {
            setDescription(text);
        }
    }, [setDescription]);

    const addNewComment = useCallback(id => comment => {
        props.addCommentToFeatureRequest(comment, id);
        // eslint-disable-next-line
    }, [props.addCommentToFeatureRequest]);

    const addNewReply = useCallback(id => (message, origin) => {
        props.addReplyToCommentRequest(message, id, origin);
        // eslint-disable-next-line
    }, [props.addReplyToCommentRequest]);

    const submitRequest = useCallback(() => {
        props.submitFeatureRequest(description);
        setDescription('');
        setSubmitFeatureRequestOpen(false);
        // eslint-disable-next-line
    }, [description, props.submitFeatureRequest, setDescription, setSubmitFeatureRequestOpen]);

    const [featuresOpen, setFeaturesOpen] = useState([]);

    const toggleFeature = useCallback((isOpen, id) => {
        if (isOpen) {
            setFeaturesOpen(_.union(featuresOpen, [id]));
        } else {
            setFeaturesOpen(featuresOpen.filter(x => x !== id));
        }
    }, [setFeaturesOpen, featuresOpen]);

    const deleteComment = useCallback(featureId => commentId => {
        props.deleteCommentRequest(featureId, commentId);
        // eslint-disable-next-line
    }, [props.deleteCommentRequest])

    const deleteReply = useCallback(featureId => (commentId, replyId) => {
        props.deleteReplyRequest(featureId, commentId, replyId);
        // eslint-disable-next-line
    }, [props.deleteReplyRequest])

    return (
        <>
            <SubmitFeature
                closeSubmitFeature={() => setSubmitFeatureRequestOpen(false)}
                description={description}
                submitFeatureOpen={submitFeatureRequestOpen}
                submitRequest={submitRequest}
                updateDescription={updateDescription}
            />
            <AllFeatureRequests
                addNewComment={addNewComment}
                addNewReply={addNewReply}
                deleteComment={deleteComment}
                deleteReply={deleteReply}
                featuresOpen={featuresOpen}
                featureRequests={_.map(props.featureRequests, (value, id) => ({ id, ...value }))}
                setSubmitFeatureRequestOpen={setSubmitFeatureRequestOpen}
                toggleFeature={toggleFeature}
                loggedInUserId={props.auth.uid}
            />
            <ErrorModal
                closeModal={props.closeFeatureRequestError}
                headerMessage={props.errorHeader}
                isOpen={props.errorMessage.length > 0}
                errorCode={props.errorCode}
                errorMessage={props.errorMessage}
            />
            <SuccessModal
                backdrop
                closeModal={props.closeSuccessMessage}
                isOpen={props.successMessage.length > 0}
                isSuccess
                headerMessage={props.successMessage}
                toggleModal={noop}
            />
        </>
    );
};

FeatureRequest.defaultProps = {
    closeSuccessMessage: noop,
    errorMessage: '',
    errorCode: '',
    errorHeader: '',
    addCommentToFeatureRequest: noop,
    addReplyToCommentRequest: noop,
    auth: {
        uid: null
    },
    featureRequests: {},
    submitFeatureRequest: noop,
    successMessage: ''
};

FeatureRequest.propTypes = {
    closeSuccessMessage: PropTypes.func,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    errorHeader: PropTypes.string,
    addCommentToFeatureRequest: PropTypes.func,
    addReplyToCommentRequest: PropTypes.func,
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    closeFeatureRequestError: PropTypes.func.isRequired,
    deleteCommentRequest: PropTypes.func.isRequired,
    deleteReplyRequest: PropTypes.func.isRequired,
    featureRequests: PropTypes.objectOf(PropTypes.shape({
        dateCreated: PropTypes.any,
        description: PropTypes.string,
        userId: PropTypes.string
    })),
    submitFeatureRequest: PropTypes.func,
    successMessage: PropTypes.string
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    errorMessage: state.features.errorMessage,
    errorCode: state.features.errorCode,
    errorHeader: state.features.errorHeader,
    featureRequests: state.firestore.data.featureRequests,
    successMessage: state.features.successMessage
});

const mapDispatchToProps = {
    addCommentToFeatureRequest,
    addReplyToCommentRequest,
    closeFeatureRequestError,
    closeSuccessMessage,
    deleteCommentRequest,
    deleteReplyRequest,
    submitFeatureRequest
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'feature-requests',
            storeAs: 'featureRequests'
        }
    ]),
)(FeatureRequest);

export { FeatureRequest as FeatureRequestUnconnected };
