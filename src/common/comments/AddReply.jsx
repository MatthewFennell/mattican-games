import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './AddReply.module.scss';
import TextInput from '../TextInput/TextInput';
import * as textInputConstants from '../TextInput/constants';

const AddReply = props => (
    <div className={props.styles.replyingWrapper}>
        <TextInput
            label={props.label}
            value={props.text}
            onChange={props.setText}
            icon={textInputConstants.textInputIcons.face}
            iconColor="secondary"
        />
        <div className={props.styles.replyOptions}>
            <div
                className={props.styles.cancelReply}
                onClick={props.cancelReply}
                role="button"
                tabIndex={0}
            >
                Cancel
            </div>
            <div
                className={props.styles.submitReply}
                onClick={props.submitReply}
                role="button"
                tabIndex={0}
            >
                {props.message}
            </div>
        </div>
    </div>
);

AddReply.defaultProps = {
    cancelReply: noop,
    label: '',
    message: '',
    text: '',
    setText: noop,
    styles: defaultStyles,
    submitReply: noop
};

AddReply.propTypes = {
    cancelReply: PropTypes.func,
    label: PropTypes.string,
    message: PropTypes.string,
    text: PropTypes.string,
    setText: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    submitReply: PropTypes.func
};

export default AddReply;
