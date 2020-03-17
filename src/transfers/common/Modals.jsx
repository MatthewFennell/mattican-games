import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './Modals.module.scss';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import StyledButton from '../../common/StyledButton/StyledButton';

const Modals = props => (
    <>
        <ErrorModal
            closeModal={props.closeTransfersError}
            headerMessage="Transfer Error"
            isOpen={props.transfersError.length > 0}
            errorCode={props.transfersErrorCode}
            errorMessage={props.transfersError}
        />
        <SuccessModal
            backdrop
            closeModal={props.closeRemoveModal}
            isOpen={props.removeModalOpen}
            headerMessage={props.playerToRemove.id !== undefined ? 'Replace / Remove Player' : 'Add Player'}
            toggleModal={props.closeRemoveModal}
        >
            <div className={props.styles.modalWrapper}>
                <div className={props.styles.buttonsWrapper}>
                    <StyledButton
                        color="primary"
                        onClick={props.selectReplacement}
                        text={props.playerToRemove.id !== undefined ? 'Select Replacement' : 'Add Player'}
                    />
                    {props.playerToRemove.id !== undefined && (
                        <StyledButton
                            color="primary"
                            onClick={props.removePlayer}
                            text="Remove Player"
                        />
                    )}

                </div>
            </div>
        </SuccessModal>
        <SuccessModal
            backdrop
            closeModal={props.closeRestoreModal}
            isOpen={props.restoreModalOpen}
            headerMessage="Restoring player"
            toggleModal={props.closeRestoreModal}
        >
            <div className={props.styles.modalWrapper}>
                <div className={props.styles.buttonsWrapper}>
                    <StyledButton
                        color="primary"
                        onClick={props.selectReplacement}
                        text="Select Replacement"
                    />
                    <StyledButton
                        color="primary"
                        onClick={props.restorePlayer}
                        text="Restore player"
                    />
                </div>
            </div>
        </SuccessModal>
    </>
);

Modals.defaultProps = {
    closeRemoveModal: noop,
    closeRestoreModal: noop,
    closeTransfersError: noop,
    removeModalOpen: false,
    removePlayer: noop,
    restoreModalOpen: false,
    restorePlayer: noop,
    playerToRemove: {
        id: ''
    },
    selectReplacement: noop,
    styles: defaultStyles,
    transfersError: '',
    transfersErrorCode: ''
};

Modals.propTypes = {
    closeRemoveModal: PropTypes.func,
    closeRestoreModal: PropTypes.func,
    closeTransfersError: PropTypes.func,
    playerToRemove: PropTypes.shape({
        id: PropTypes.string
    }),
    removeModalOpen: PropTypes.bool,
    removePlayer: PropTypes.func,
    restoreModalOpen: PropTypes.bool,
    restorePlayer: PropTypes.func,
    selectReplacement: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    transfersError: PropTypes.string,
    transfersErrorCode: PropTypes.string
};

export default Modals;
