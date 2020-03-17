import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import defaultStyles from './VerifyEmail.module.scss';
import { resendEmailVerificationRequest, closeEmailVerificationError } from './actions';
import StyledButton from '../common/StyledButton/StyledButton';
import Spinner from '../common/spinner/Spinner';
import ErrorModal from '../common/modal/ErrorModal';

const VerifyEmail = props => (
    <>
        <div className={props.styles.verifyEmailMessage}>
            {`A verification link has been sent to ${props.email}. Please click on the link to verify your account. 
            If you signed in with Facebook, try refreshing the page` }
            <div className={props.styles.resendEmailButtonWrapper}>
                <StyledButton
                    color="primary"
                    onClick={props.resendEmailVerificationRequest}
                    text="Resend email"
                />
                <div className={props.styles.spinnerWrapper}>
                    {props.sendingEmail && <Spinner color="secondary" /> }
                </div>
            </div>
        </div>
        <ErrorModal
            closeModal={props.closeEmailVerificationError}
            headerMessage="Error Resending Email Verification"
            isOpen={props.emailError.length > 0}
            errorCode={props.emailErrorCode}
            errorMessage={props.emailError}
        />
    </>
);

VerifyEmail.defaultProps = {
    email: '',
    emailError: '',
    emailErrorCode: '',
    sendingEmail: false,
    styles: defaultStyles
};

VerifyEmail.propTypes = {
    closeEmailVerificationError: PropTypes.func.isRequired,
    email: PropTypes.string,
    emailError: PropTypes.string,
    emailErrorCode: PropTypes.string,
    resendEmailVerificationRequest: PropTypes.func.isRequired,
    sendingEmail: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapStateToProps = state => ({
    email: state.firebase.auth.email,
    emailError: state.auth.resendVerificationEmailError,
    emailErrorCode: state.auth.resendVerificationEmailErrorCode,
    sendingEmail: state.auth.sendingEmailVerification
});

const mapDispatchToProps = {
    closeEmailVerificationError,
    resendEmailVerificationRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);

export { VerifyEmail as VerifyEmailUnconnected };
