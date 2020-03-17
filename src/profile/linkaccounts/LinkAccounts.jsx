/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './LinkAccounts.module.scss';
import GoogleImage from '../../common/images/google-image.jpg';
import FacebookImage from '../../common/images/facebook-image.jpg';

const LinkAccounts = props => (
    <div className={props.styles.linkAccountsWrapper}>
        <div className={props.styles.facebookLinkWrapper}>
            <div
                className={props.styles.facebookLinkMessage}
                onClick={props.linkProfileToFacebook}
                role="button"
                tabIndex={0}
            >
            Link your Facebook account
            </div>
            <div className={props.styles.facebookLinkImage}>
                <img alt="Facebook" className={props.styles.facebookImage} src={FacebookImage} onClick={props.linkProfileToFacebook} />
            </div>
        </div>
        <div className={props.styles.googleLinkWrapper}>
            <div
                className={props.styles.googleLinkMessage}
                onClick={props.linkProfileToGoogle}
                role="button"
                tabIndex={0}
            >
            Link your Google account
            </div>
            <div className={props.styles.googleLinkImage}>
                <img alt="Google" className={props.styles.googleImage} src={GoogleImage} onClick={props.linkProfileToGoogle} />
            </div>
        </div>
    </div>
);

LinkAccounts.defaultProps = {
    linkProfileToFacebook: PropTypes.func,
    linkProfileToGoogle: PropTypes.func,
    styles: defaultStyles
};

LinkAccounts.propTypes = {
    linkProfileToFacebook: noop,
    linkProfileToGoogle: noop,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default LinkAccounts;
