import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import { noop } from 'lodash';
import defaultStyles from './YouTube.module.scss';

const defaultOpts = {
    // height: '390',
    // width: '100%',
    playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
    }
};

const CustomYouTube = props => (
    <div className={props.styles.youTubeWrapper}>
        <YouTube
            videoId={props.videoId}
            opts={props.opts}
            onReady={props.onReady}
        />
    </div>
);

CustomYouTube.defaultProps = {
    onReady: noop,
    opts: defaultOpts,
    styles: defaultStyles,
    videoId: ''
};

CustomYouTube.propTypes = {
    onReady: PropTypes.func,
    opts: PropTypes.shape({
        height: PropTypes.string,
        width: PropTypes.string,
        playerVars: PropTypes.shape({
            autoplay: PropTypes.number
        })
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    videoId: PropTypes.string
};

export default CustomYouTube;
