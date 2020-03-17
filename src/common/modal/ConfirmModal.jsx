import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './ConfirmModal.module.scss';
import StyledButton from '../StyledButton/StyledButton';
import WithModal from './WithModal';

const ConfirmModal = props => (
    <>
        <div className={props.styles.modalText}>
            {props.text}
        </div>
        <div className={props.styles.buttonsWrapper}>
            <StyledButton
                color="primary"
                onClick={props.submit}
                text="Yes"
            />
            <StyledButton
                color="secondary"
                onClick={props.cancel}
                text="No"
            />
        </div>
    </>
);

ConfirmModal.defaultProps = {
    cancel: noop,
    styles: defaultStyles,
    submit: noop,
    text: 'Are you sure?'
};

ConfirmModal.propTypes = {
    cancel: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    submit: PropTypes.func,
    text: PropTypes.string
};

export default WithModal(ConfirmModal);
