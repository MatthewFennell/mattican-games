import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './Update.module.scss';
import StyledButton from '../../common/StyledButton/StyledButton';
import Spinner from '../../common/spinner/Spinner';
import ErrorModal from '../../common/modal/ErrorModal';
import TextInput from '../../common/TextInput/TextInput';


const Update = props => {
    const [displayName, setDisplayName] = useState('');

    const update = useCallback(() => {
        props.updateRequest(displayName);
        // eslint-disable-next-line
    }, [displayName, props.updateRequest]);

    return (
        <div className={props.styles.updateWrapper}>
            <TextInput
                label={props.property}
                onChange={setDisplayName}
                value={displayName}
                icon={props.icon}
                iconColor="secondary"
            />
            <StyledButton
                color="primary"
                onClick={update}
                text={`Update ${props.property}`}
            />
            <div className={classNames({
                [props.styles.hidden]: !props.loading
            })}
            >
                <Spinner color="secondary" />
            </div>
            <ErrorModal
                closeModal={props.closeError}
                headerMessage={`${props.property} Error`}
                isOpen={props.updateError.length > 0}
                errorCode={props.updateErrorCode}
                errorMessage={props.updateError}
            />
        </div>
    );
};

Update.defaultProps = {
    closeError: noop,
    icon: '',
    styles: defaultStyles,
    updateRequest: noop,
    updateError: '',
    updateErrorCode: '',
    loading: false,
    property: ''
};

Update.propTypes = {
    closeError: PropTypes.func,
    icon: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    updateRequest: PropTypes.func,
    updateError: PropTypes.string,
    updateErrorCode: PropTypes.string,
    loading: PropTypes.bool,
    property: PropTypes.string
};

export default Update;
