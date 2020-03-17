import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import FaceIcon from '@material-ui/icons/Face';
import classNames from 'classnames';
import defaultStyles from './Comment.module.scss';
import AddReply from './AddReply';
import CommentInfo from './CommentInfo';

const Comment = props => {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');

    const {
        date, displayName, message, id, userId, photoUrl
    } = props.details;

    const cancelReply = useCallback(() => {
        setReplyText('');
        setReplyOpen(false);
    }, [setReplyOpen, setReplyText]);

    const submitReply = useCallback(() => {
        props.submitReply(replyText, id);
        setReplyText('');
        // eslint-disable-next-line
    }, [setReplyText, props.details, replyText, id]);

    const openReply = useCallback(() => {
        setReplyOpen(true);
    }, [setReplyOpen]);

    const deleteMessage = useCallback(() => {
        if (props.parentId) {
            props.deleteReply(props.parentId, id);
        } else {
            props.deleteComment(id);
        }
        // eslint-disable-next-line
    }, [id, props.parentId, props.deleteComment]);

    return (
        <div className={props.styles.commentWrapper}>
            <div className={props.styles.userInfo}>
                <div className={props.styles.userIcon}>
                    {photoUrl ? (
                        <img
                            className={classNames({
                                [props.styles.smallerImage]: !props.isTopLevel,
                                [props.styles.profilePicture]: true
                            })}
                            src={photoUrl}
                            alt="new"
                        />
                    ) : <FaceIcon color="secondary" />}
                </div>
                <div className={props.styles.messageWrapper}>
                    <CommentInfo
                        date={date}
                        deleteMessage={deleteMessage}
                        displayName={displayName}
                        message={message}
                        isTopLevel={props.isTopLevel}
                        setReplyOpen={openReply}
                        loggedInUserId={props.loggedInUserId}
                        userId={userId}
                        replyOpen={replyOpen}
                    />
                    {replyOpen && props.isTopLevel && (
                        <AddReply
                            cancelReply={cancelReply}
                            message="Add reply"
                            text={replyText}
                            setText={setReplyText}
                            submitReply={submitReply}
                            label="Enter reply"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

Comment.defaultProps = {
    deleteComment: noop,
    deleteReply: noop,
    details: {},
    isTopLevel: false,
    parentId: null,
    styles: defaultStyles,
    submitReply: noop,
    loggedInUserId: ''
};

Comment.propTypes = {
    deleteComment: PropTypes.func,
    deleteReply: PropTypes.func,
    details: PropTypes.shape({
        date: PropTypes.string,
        displayName: PropTypes.string,
        id: PropTypes.string,
        message: PropTypes.string,
        userId: PropTypes.string,
        photoUrl: PropTypes.string
    }),
    isTopLevel: PropTypes.bool,
    parentId: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    submitReply: PropTypes.func,
    loggedInUserId: PropTypes.string
};

export default Comment;
