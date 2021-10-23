import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import LoadingDiv from '../loadingDiv/LoadingDiv';
import defaultStyles from './ConfirmModal.module.scss';
import StyledButton from '../StyledButton/StyledButton';
import WithModal from './WithModal';

const ConfirmModal = props => (
    <>
        <div className={props.styles.modalText}>
            {props.text}
        </div>
        <LoadingDiv isLoading={props.isLoading} isBorderRadius isFitContent>
            <div className={props.styles.buttonsWrapper}>
                <StyledButton
                    color="primary"
                    onClick={props.submit}
                    text="Yes"
                    disabled={props.isDisabled || props.isLoading}
                />
                <StyledButton
                    color="secondary"
                    onClick={props.cancel}
                    text="No"
                    disabled={props.isDisabled || props.isLoading}
                />
            </div>
        </LoadingDiv>
    </>
);

ConfirmModal.defaultProps = {
    cancel: noop,
    isDisabled: false,
    isLoading: false,
    styles: defaultStyles,
    submit: noop,
    text: 'Are you sure?'
};

ConfirmModal.propTypes = {
    cancel: PropTypes.func,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string),
    submit: PropTypes.func,
    text: PropTypes.string
};

export default WithModal(ConfirmModal);
