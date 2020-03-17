import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import fp from 'lodash/fp';
import { noop } from 'lodash';
import defaultStyles from './DeletePlayer.module.scss';
import Dropdown from '../../common/dropdown/Dropdown';
import {
    fetchTeamsRequest, fetchPlayersForTeamRequest, deletePlayerRequest,
    closeSuccessMessage, closeAdminError
} from '../actions';
import StyledButton from '../../common/StyledButton/StyledButton';
import ErrorModal from '../../common/modal/ErrorModal';
import SuccessModal from '../../common/modal/SuccessModal';
import Spinner from '../../common/spinner/Spinner';

const DeletePlayer = props => {
    const [playerName, setPlayerName] = useState('');
    const [playerTeam, setPlayerTeam] = useState('');

    useEffect(() => {
        props.fetchTeamsRequest();
        // eslint-disable-next-line
    }, [props.fetchTeamsRequest]);

    const setTeam = useCallback(name => {
        setPlayerTeam(name);
        props.fetchPlayersForTeamRequest(name);
        // eslint-disable-next-line
    }, [props.fetchPlayersForTeamRequest, playerTeam, setPlayerTeam]);

    const playersForActiveTeam = fp.getOr([], playerTeam)(props.teamsWithPlayers);

    const nameToId = name => fp.get('id')(playersForActiveTeam.find(a => a.value === name));

    const deletePlayer = useCallback(() => {
        props.deletePlayerRequest(nameToId(playerName));
        setPlayerName('');
        setPlayerTeam('');
        // eslint-disable-next-line
    }, [playerName, props.deletePlayerRequest, nameToId]);

    return (
        <>
            <div className={props.styles.deletePlayerWrapper}>
                <div className={props.styles.deletePlayerHeader}>
                    <StyledButton
                        color="primary"
                        onClick={deletePlayer}
                        text="Delete Player"
                        disabled={!playerTeam || !playerName}
                    />
                </div>
                <div className={props.styles.deletePlayerForm}>
                    <div className={props.styles.deletePlayerDropdowns}>
                        <Dropdown
                            value={playerTeam}
                            onChange={setTeam}
                            options={props.allTeams}
                            title="Team"
                            key="Team"
                        />
                        <Dropdown
                            value={playerName}
                            onChange={setPlayerName}
                            options={playersForActiveTeam}
                            title="Player"
                            key="Player"
                        />
                    </div>

                </div>
                <ErrorModal
                    closeModal={props.closeAdminError}
                    headerMessage={props.errorHeader}
                    isOpen={props.errorMessage.length > 0}
                    errorCode={props.errorCode}
                    errorMessage={props.errorMessage}
                />

                <div className={classNames({
                    [props.styles.hidden]: !props.deletingPlayer
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

DeletePlayer.defaultProps = {
    allTeams: [],
    errorMessage: '',
    errorCode: '',
    errorHeader: '',
    successMessage: '',
    styles: defaultStyles
};

DeletePlayer.propTypes = {
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    closeAdminError: PropTypes.func.isRequired,
    closeSuccessMessage: PropTypes.func.isRequired,
    deletePlayerRequest: PropTypes.func.isRequired,
    deletingPlayer: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    errorHeader: PropTypes.string,
    fetchTeamsRequest: PropTypes.func.isRequired,
    fetchPlayersForTeamRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    successMessage: PropTypes.string,
    teamsWithPlayers: PropTypes.objectOf(PropTypes.array).isRequired
};

const mapDispatchToProps = {
    closeAdminError,
    closeSuccessMessage,
    deletePlayerRequest,
    fetchTeamsRequest,
    fetchPlayersForTeamRequest
};

const mapStateToProps = state => ({
    allTeams: state.admin.allTeams,
    deletingPlayer: state.admin.deletingPlayer,
    errorMessage: state.admin.errorMessage,
    errorCode: state.admin.errorCode,
    errorHeader: state.admin.errorHeader,
    successMessage: state.admin.successMessage,
    teamsWithPlayers: state.admin.teamsWithPlayers
});

export default connect(mapStateToProps, mapDispatchToProps)(DeletePlayer);

export { DeletePlayer as DeletePlayerUnconnected };
