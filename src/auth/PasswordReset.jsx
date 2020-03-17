import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './PasswordReset.module.scss';
import { sendPasswordResetEmail, closeAuthError } from './actions';
import StyledButton from '../common/StyledButton/StyledButton';
import ErrorModal from '../common/modal/ErrorModal';
import TextInput from '../common/TextInput/TextInput';
import * as textInputConstants from '../common/TextInput/constants';

const PasswordReset = props => {
    const [email, setEmail] = useState('');
    return (
        <div className={props.styles.passwordReset}>
            <div className={props.styles.passwordResetHeader}>Password reset</div>
            <TextInput
                icon={textInputConstants.textInputIcons.email}
                label="Email"
                onChange={setEmail}
                value={email}
                iconColor="secondary"
            />
            <div className={props.styles.resetPasswordButton}>
                <StyledButton
                    color="primary"
                    onClick={() => props.sendPasswordResetEmail(email)}
                    text="Send reset password email"
                />
            </div>
            <ErrorModal
                closeModal={props.closeAuthError}
                headerMessage="Password Reset Error"
                isOpen={props.passwordResetErrorMessage.length > 0}
                errorCode={props.passwordResetErrorCode}
                errorMessage={props.passwordResetErrorMessage}
            />
        </div>
    );
};

PasswordReset.defaultProps = {
    passwordResetErrorCode: '',
    passwordResetErrorMessage: '',
    styles: defaultStyles
};

PasswordReset.propTypes = {
    closeAuthError: PropTypes.func.isRequired,
    passwordResetErrorCode: PropTypes.string,
    passwordResetErrorMessage: PropTypes.string,
    sendPasswordResetEmail: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    closeAuthError,
    sendPasswordResetEmail
};

const mapStateToProps = state => ({
    passwordResetErrorMessage: state.auth.passwordResetError,
    passwordResetErrorCode: state.auth.passwordResetErrorCode
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);

export { PasswordReset as PasswordResetUnconnected };
