import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { noop } from 'lodash';
import defaultStyles from './Voting.module.scss';

const determineColor = (video, myId, isUpvote) => {
    if (video.upvotes.includes(myId) && isUpvote) {
        return 'secondary';
    }
    if (video.downvotes.includes(myId) && !isUpvote) {
        return 'primary';
    }
    return 'inherit';
};

const formatKarma = video => {
    const val = video.upvotes.length - video.downvotes.length;
    if (val >= 0) {
        return `+${val}`;
    }
    return val;
};

const Voting = props => {
    const upvote = useCallback(() => {
        if (!props.video.upvotes.includes(props.authId)) {
            props.upvoteHighlightRequest(props.video.id);
        }
        // eslint-disable-next-line
    }, [props.upvoteHighlightRequest, props.video, props.authId]);

    const downvote = useCallback(() => {
        if (!props.video.downvotes.includes(props.authId)) {
            props.downvoteHighlightRequest(props.video.id);
        }
        // eslint-disable-next-line
    }, [props.downvoteHighlightRequest, props.video, props.authId]);


    return (
        <div className={props.styles.votingWrapper}>
            <div className={props.styles.upvoteIcon}>
                <ArrowUpwardIcon fontSize="large" color={determineColor(props.video, props.authId, true)} onClick={upvote} />
            </div>
            <div className={props.styles.karma}>
                {formatKarma(props.video)}
            </div>
            <div className={props.styles.downvoteIcon}>
                <ArrowDownwardIcon fontSize="large" color={determineColor(props.video, props.authId, false)} onClick={downvote} />
            </div>
        </div>
    );
};

Voting.defaultProps = {
    authId: '',
    downvoteHighlightRequest: noop,
    styles: defaultStyles,
    upvoteHighlightRequest: noop,
    video: {
        downvotes: [],
        upvotes: []
    }
};

Voting.propTypes = {
    authId: PropTypes.string,
    downvoteHighlightRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    upvoteHighlightRequest: PropTypes.func,
    video: PropTypes.shape({
        id: PropTypes.string,
        upvotes: PropTypes.arrayOf(PropTypes.string),
        downvotes: PropTypes.arrayOf(PropTypes.string)
    })
};

export default Voting;
