import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './YouTubeItem.module.scss';
import Voting from './Voting';

const YouTubeItemClosed = props => (
    <div className={props.styles.closedVideoItemWrapper}>
        <div>{`Title: ${props.title}`}</div>
        <div>{`Author: ${props.author}`}</div>
        <div>{`Created ${props.date}`}</div>
        {props.votingPage && (
            <Voting
                authId={props.authId}
                downvoteHighlightRequest={props
                    .downvoteHighlightRequest}
                video={props.video}
                upvote={props.upvote}
                upvoteHighlightRequest={props
                    .upvoteHighlightRequest}
            />
        )}
    </div>
);

YouTubeItemClosed.defaultProps = {
    author: '',
    authId: '',
    date: '',
    downvoteHighlightRequest: noop,
    styles: defaultStyles,
    upvote: noop,
    upvoteHighlightRequest: noop,
    video: {},
    votingPage: false,
    title: ''
};

YouTubeItemClosed.propTypes = {
    authId: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    downvoteHighlightRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    upvote: PropTypes.func,
    upvoteHighlightRequest: PropTypes.func,
    video: PropTypes.shape({}),
    votingPage: PropTypes.bool,
    title: PropTypes.string
};

export default YouTubeItemClosed;
