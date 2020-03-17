import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import defaultStyles from './WithModal.module.scss';

const getModalStyle = () => ({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%'
});

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        'box-shadow': '0px 0px 11px 1px rgba(0,0,0,0.3)'
    }
}));

const WithModal = Component => {
    const NormalComponent = props => {
        const classes = useStyles();
        // getModalStyle is not a pure function, we roll the style only on the first render
        const [modalStyle] = useState(getModalStyle);
        const {
            styles, isError, isSuccess, isOpen, closeModal, headerMessage, ...args
        } = props; // Need to not pass down styles

        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={props.isOpen}
                    onClose={props.closeModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500
                    }}
                >
                    <Fade in={props.isOpen}>
                        <div style={modalStyle} className={classes.paper}>
                            <div className={props.styles.modalContextWrapper}>
                                <div className={props.styles.closeModalIcon}>
                                    <CloseIcon onClick={props.closeModal} />
                                </div>
                                <div className={classNames({
                                    [props.styles.headerWrapper]: true,
                                    [props.styles.isError]: props.isError,
                                    [props.styles.isSuccess]: props.isSuccess
                                })}
                                >
                                    {props.headerMessage}
                                </div>
                                <Component {...args} />
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    };

    NormalComponent.defaultProps = {
        cancel: noop,
        closeModal: noop,
        headerMessage: '',
        isOpen: false,
        isError: false,
        isSuccess: false,
        styles: defaultStyles,
        submit: noop
    };

    NormalComponent.propTypes = {
        cancel: PropTypes.func,
        closeModal: PropTypes.func,
        headerMessage: PropTypes.string,
        isOpen: PropTypes.bool,
        isError: PropTypes.bool,
        isSuccess: PropTypes.bool,
        styles: PropTypes.objectOf(PropTypes.string),
        submit: PropTypes.func
    };

    return NormalComponent;
};

export default WithModal;
