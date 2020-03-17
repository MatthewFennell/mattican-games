import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { noop } from 'lodash';
import defaultStyles from './TriggerWeek.module.scss';
import { triggerWeekRequest, closeSuccessMessage, closeAdminError } from '../actions';
import StyledButton from '../../common/StyledButton/StyledButton';
import ErrorModal from '../../common/modal/ErrorModal';
import SuccessModal from '../../common/modal/SuccessModal';
import Spinner from '../../common/spinner/Spinner';
import Dropdown from '../../common/dropdown/Dropdown';

const TriggerWeek = props => {
    const [week, setWeek] = useState('');

    const triggerWeek = useCallback(() => {
        props.triggerWeekRequest(week);
        setWeek('');
        // eslint-disable-next-line
    }, [props.triggerWeekRequest, week]);

    const calculateOptions = (props.maxGameWeek || props.maxGameWeek === 0) ? [{
        id: props.maxGameWeek + 1,
        value: props.maxGameWeek + 1,
        text: props.maxGameWeek + 1
    }] : [];

    return (
        <>
            <div className={props.styles.triggerWeekWrapper}>
                <div className={props.styles.triggerWeekHeader}>
                    <StyledButton
                        color="primary"
                        onClick={triggerWeek}
                        text="Trigger Week"
                        disabled={!(week && week !== 0)}
                    />
                </div>
                <div className={props.styles.triggerWeekForm}>
                    <Dropdown
                        value={week}
                        onChange={setWeek}
                        options={calculateOptions}
                        title="Week"
                        key="Week"
                    />
                </div>
                <ErrorModal
                    closeModal={props.closeAdminError}
                    headerMessage={props.errorHeader}
                    isOpen={props.errorMessage.length > 0}
                    errorCode={props.errorCode}
                    errorMessage={props.errorMessage}
                />
                <div className={classNames({
                    [props.styles.hidden]: !props.triggeringWeek
                })}
                >
                    <Spinner color="secondary" />
                </div>
            </div>
            <SuccessModal
                backdrop
                closeModal={props.closeSuccessMessage}
                isOpen={props.successMessage.length > 0}
                isSuccess
                headerMessage={props.successMessage}
                toggleModal={noop}
            />
        </>
    );
};

TriggerWeek.defaultProps = {
    errorMessage: '',
    errorCode: '',
    errorHeader: '',
    maxGameWeek: null,
    successMessage: '',
    styles: defaultStyles,
    triggeringWeek: false
};

TriggerWeek.propTypes = {
    closeAdminError: PropTypes.func.isRequired,
    closeSuccessMessage: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    errorHeader: PropTypes.string,
    maxGameWeek: PropTypes.number,
    successMessage: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    triggeringWeek: PropTypes.bool,
    triggerWeekRequest: PropTypes.func.isRequired
};

const mapDispatchToProps = {
    closeAdminError,
    closeSuccessMessage,
    triggerWeekRequest
};

const mapStateToProps = state => ({
    errorMessage: state.admin.errorMessage,
    errorCode: state.admin.errorCode,
    errorHeader: state.admin.errorHeader,
    triggeringWeek: state.admin.triggeringWeek,
    triggerWeekError: state.admin.triggerWeekError,
    triggerWeekErrorCode: state.admin.triggerWeekErrorCode,
    maxGameWeek: state.overview.maxGameWeek,
    successMessage: state.admin.successMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(TriggerWeek);

export { TriggerWeek as TriggerWeekUnconnected };
