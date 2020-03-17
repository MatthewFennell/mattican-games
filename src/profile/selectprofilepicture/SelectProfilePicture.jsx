/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './SelectProfilePicture.module.scss';
import StyledButton from '../../common/StyledButton/StyledButton';
import TextInput from '../../common/TextInput/TextInput';
import * as textInputConstants from '../../common/TextInput/constants';

const SelectProfilePicture = props => {
    const [ownPhotoUrl, setOwnPhotoUrl] = useState(props.currentPhotoUrl);

    const updateImage = useCallback(photoUrl => {
        if (photoUrl !== props.currentPhotoUrl) {
            props.updateProfilePicture(photoUrl);
        }
        // eslint-disable-next-line
    }, [props.updateProfilePicture, setOwnPhotoUrl, props.currentPhotoUrl]);

    return (
        <div className={props.styles.selectProfilePictureWrapper}>
            <div className={props.styles.selectAvatar}>
                Select your own avatar
            </div>
            <div className={props.styles.potentialPicturesWrapper}>
                {props.potentialPictures.map(photoUrl => (
                    <div className={props.styles.imageWrapper} key={photoUrl}>
                        <div
                            className={classNames({
                                [props.styles.activeAvatar]: true,
                                [props.styles.hidden]: props.currentPhotoUrl !== photoUrl
                            })}
                        >
                            Active Avatar
                        </div>

                        <img
                            className={props.styles.profilePicture}
                            onClick={() => updateImage(photoUrl)}
                            src={photoUrl}
                            alt="new"
                        />
                    </div>
                ))}
            </div>
            <hr />
            <div className={props.styles.selectOwnPictureWrapper}>
                <div className={props.styles.uploadOwnIconMessage}>
                    Upload your own avatar
                </div>
                <div className={props.styles.ownPictureOptions}>
                    <div className={props.styles.enterOwnUrl}>
                        <TextInput
                            onChange={setOwnPhotoUrl}
                            value={ownPhotoUrl}
                            label="Enter the URL of your own image"
                            icon={textInputConstants.textInputIcons.face}
                            iconColor="secondary"
                        />
                        <div className={props.styles.infoText}>
                            The image to the right is what your avatar will look like.
                            You can often get the URL by
                            clicking
                            <i> Copy Image Address </i>
                            on Google
                        </div>
                    </div>
                    <div className={props.styles.ownImageExample}>
                        <img
                            className={props.styles.exampleImage}
                            src={ownPhotoUrl}
                            alt="new"
                        />
                        <div>
                            <StyledButton color="primary" onClick={() => updateImage(ownPhotoUrl)} text="Change my icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

SelectProfilePicture.defaultProps = {
    currentPhotoUrl: '',
    potentialPictures: [],
    styles: defaultStyles,
    updateProfilePicture: noop
};

SelectProfilePicture.propTypes = {
    currentPhotoUrl: PropTypes.string,
    potentialPictures: PropTypes.arrayOf(PropTypes.string),
    styles: PropTypes.objectOf(PropTypes.string),
    updateProfilePicture: PropTypes.func
};

export default SelectProfilePicture;
