import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './JoinTeamModal.module.scss';
import SuccessModal from '../../common/modal/SuccessModal';
import Dropdown from '../../common/dropdown/Dropdown';
import StyledButton from '../../common/StyledButton/StyledButton';
import LoadingDiv from '../../common/loadingDiv/LoadingDiv';

const JoinTeamModal = props => {
    const { onConfirm } = props;

    const [joiningTeam, setJoiningTeam] = useState(false);

    const joinTeam = useCallback(() => {
        setJoiningTeam(true);
        onConfirm();
    }, [setJoiningTeam, onConfirm]);

    return (
        <SuccessModal
            backdrop
            closeModal={props.closeModal}
            error
            isOpen={props.isOpen}
            headerMessage="Choose a team to join"
        >

            <div className={props.styles.joinTeamWrapper}>
                <Dropdown
                    title="Choose a team"
                    value={props.value}
                    onChange={props.onChange}
                    options={props.teams.map(team => ({
                        id: team.name,
                        value: team.name,
                        text: team.name
                    }))}
                />
            </div>
            <div>
                <LoadingDiv isLoading={joiningTeam} isBorderRadius isFitContent>
                    <div className={props.styles.confirmButtons}>
                        <StyledButton
                            text="Confirm"
                            onClick={joinTeam}
                            disabled={joiningTeam}
                        />
                    </div>
                </LoadingDiv>
            </div>
        </SuccessModal>
    );
};

JoinTeamModal.defaultProps = {
    closeModal: noop,
    isOpen: false,
    onChange: noop,
    onConfirm: noop,
    styles: defaultStyles,
    teams: [],
    value: ''
};

JoinTeamModal.propTypes = {
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool,
    onChange: PropTypes.func,
    onConfirm: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    teams: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    value: PropTypes.string
};

export default JoinTeamModal;
