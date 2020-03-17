import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import _ from 'lodash';
import {
    linkProfileToFacebook, linkProfileToGoogle, updateTeamNameRequest,
    closeAccountLinkError, updateDisplayNameRequest, closeDisplayNameError,
    closeTeamNameError, deleteAccountRequest, closeDeleteAccountError,
    updateProfilePictureRequest
} from './actions';
import defaultStyles from './Profile.module.scss';
import LinkAccounts from './linkaccounts/LinkAccounts';
import SuccessModal from '../common/modal/SuccessModal';
import Update from './update/Update';
import StyledButton from '../common/StyledButton/StyledButton';
import ErrorModal from '../common/modal/ErrorModal';
import Spinner from '../common/spinner/Spinner';
import SelectProfilePicture from './selectprofilepicture/SelectProfilePicture';
import TextInput from '../common/TextInput/TextInput';
import * as textInputConstants from '../common/TextInput/constants';

const Profile = props => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [email, setEmail] = useState('');

    const closeModal = useCallback(() => {
        setDeleteModalOpen(false);
        setEmail('');
    }, []);

    const deleteAccount = useCallback(() => {
        props.deleteAccountRequest(email);
        setDeleteModalOpen(false);
        setEmail('');
        // eslint-disable-next-line
    }, [props.deleteAccountRequest]);

    const updateProfilePicture = useCallback(photoUrl => {
        props.updateProfilePictureRequest(photoUrl);
        // eslint-disable-next-line
    }, [props.updateProfilePictureRequest])

    const potentialPictures = firebase.auth().currentUser.providerData.map(x => x.photoURL);

    return (
        <div className={props.styles.profileWrapper}>
            <div className={props.styles.profileHeader}>
                <div className={props.styles.fields}>
                    <div>{props.profile.displayName || 'N/A'}</div>
                    <div>{props.profile.teamName || 'N/A'}</div>
                    <div>{props.profile.email || 'N/A'}</div>
                </div>
            </div>
            <div className={props.styles.bodyWrapper}>
                <LinkAccounts
                    linkProfileToFacebook={props.linkProfileToFacebook}
                    linkProfileToGoogle={props.linkProfileToGoogle}
                />
                <Update
                    loading={props.updatingDisplayName}
                    closeError={props.closeDisplayNameError}
                    property="Display Name"
                    updateRequest={props.updateDisplayNameRequest}
                    updateError={props.updateDisplayNameError}
                    updateErrorCode={props.updateDisplayNameErrorCode}
                    icon={textInputConstants.textInputIcons.user}
                />
                <Update
                    loading={props.updatingTeamName}
                    closeError={props.closeTeamNameError}
                    property="Team Name"
                    updateRequest={props.updateTeamNameRequest}
                    updateError={props.updateTeamNameError}
                    updateErrorCode={props.updateTeamNameErrorCode}
                />
                <SelectProfilePicture
                    currentPhotoUrl={props.profile.photoUrl}
                    potentialPictures={_.union(potentialPictures, [props.profile.photoUrl])}
                    updateProfilePicture={updateProfilePicture}
                />
            </div>

            <div className={props.styles.deleteButtonWrapper}>
                <StyledButton color="secondary" text="Delete Account" onClick={() => setDeleteModalOpen(true)} />
            </div>
            <SuccessModal
                backdrop
                closeModal={props.closeAccountLinkError}
                error
                isOpen={props.linkAccountErrorMessage.length > 0}
                headerMessage="Account Linking Error"
                toggleModal={props.closeAccountLinkError}
            >
                <div className={props.styles.modalWrapper}>
                    <div>
                        {`Code: ${props.linkAccountErrorCode}`}
                    </div>
                    <div>
                        {`Message: ${props.linkAccountErrorMessage}`}
                    </div>
                    {props.attemptedEmailToLink && (
                        <div>
                            {`Attempted Email: ${props.attemptedEmailToLink}`}
                        </div>
                    )}
                </div>
            </SuccessModal>
            <SuccessModal
                backdrop
                closeModal={closeModal}
                error
                isOpen={deleteModalOpen}
                headerMessage="Delete Account: This cannot be reversed"
                toggleModal={props.closeAccountLinkError}
            >
                <div className={props.styles.enterEmailMessage}>
                    Please confirm your email
                </div>
                <div className={props.styles.emailTextWrapper}>
                    <TextInput
                        label="Email"
                        onChange={setEmail}
                        value={email}
                        icon={textInputConstants.textInputIcons.email}
                        iconColor="primary"
                    />
                </div>
                <div className={props.styles.submitDeleteAccountWrapper}>
                    <StyledButton color="primary" text="Confirm" onClick={deleteAccount} />
                </div>
            </SuccessModal>
            <ErrorModal
                closeModal={props.closeDeleteAccountError}
                headerMessage="Delete Account Error"
                isOpen={props.deleteAccountError.length > 0}
                errorCode={props.deleteAccountErrorCode}
                errorMessage={props.deleteAccountError}
            />
            { props.deletingAccount && <Spinner color="secondary" /> }
        </div>
    );
};

Profile.defaultProps = {
    attemptedEmailToLink: '',
    deleteAccountError: '',
    deleteAccountErrorCode: '',
    deletingAccount: false,
    linkAccountErrorCode: '',
    linkAccountErrorMessage: '',
    profile: {
        displayName: '',
        email: '',
        teamName: ''
    },
    styles: defaultStyles,
    updatingDisplayName: false,
    updateDisplayNameError: '',
    updateDisplayNameErrorCode: '',
    updatingTeamName: false,
    updateTeamNameError: '',
    updateTeamNameErrorCode: ''
};

Profile.propTypes = {
    attemptedEmailToLink: PropTypes.string,
    closeAccountLinkError: PropTypes.func.isRequired,
    closeDeleteAccountError: PropTypes.func.isRequired,
    closeDisplayNameError: PropTypes.func.isRequired,
    closeTeamNameError: PropTypes.func.isRequired,
    deleteAccountError: PropTypes.string,
    deleteAccountErrorCode: PropTypes.string,
    deleteAccountRequest: PropTypes.func.isRequired,
    deletingAccount: PropTypes.bool,
    linkAccountErrorCode: PropTypes.string,
    linkAccountErrorMessage: PropTypes.string,
    linkProfileToFacebook: PropTypes.func.isRequired,
    linkProfileToGoogle: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        displayName: PropTypes.string,
        email: PropTypes.string,
        photoUrl: PropTypes.string,
        teamName: PropTypes.string
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    updateDisplayNameRequest: PropTypes.func.isRequired,
    updateTeamNameRequest: PropTypes.func.isRequired,
    updatingDisplayName: PropTypes.bool,
    updateDisplayNameError: PropTypes.string,
    updateDisplayNameErrorCode: PropTypes.string,
    updateProfilePictureRequest: PropTypes.func.isRequired,
    updatingTeamName: PropTypes.bool,
    updateTeamNameError: PropTypes.string,
    updateTeamNameErrorCode: PropTypes.string
};

const mapDispatchToProps = {
    closeAccountLinkError,
    closeDeleteAccountError,
    closeDisplayNameError,
    closeTeamNameError,
    deleteAccountRequest,
    linkProfileToFacebook,
    linkProfileToGoogle,
    updateDisplayNameRequest,
    updateProfilePictureRequest,
    updateTeamNameRequest
};

const mapStateToProps = state => ({
    attemptedEmailToLink: state.profile.attemptedEmailToLink,
    auth: state.firebase.auth,

    deleteAccountError: state.profile.deleteAccountError,
    deleteAccountErrorCode: state.profile.deleteAccountErrorCode,
    deletingAccount: state.profile.deletingAccount,

    profile: state.firebase.profile,
    linkAccountErrorCode: state.profile.linkAccountErrorCode,
    linkAccountErrorMessage: state.profile.linkAccountError,
    updatingDisplayName: state.profile.updatingDisplayName,
    updateDisplayNameError: state.profile.updateDisplayNameError,
    updateDisplayNameErrorCode: state.profile.updateDisplayNameErrorCode,

    updatingTeamName: state.profile.updatingTeamName,
    updateTeamNameError: state.profile.updateTeamNameError,
    updateTeamNameErrorCode: state.profile.updateTeamNameErrorCode
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

export { Profile as ProfileUnconnected };
