import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import defaultStyles from './CurrentTeam.module.scss';
import * as selectors from './selectors';
import { fetchActiveTeamRequest, makeCaptainRequest } from './actions';
import goalkeeperStyles from './ShirtStyles/Goalkeeper.module.scss';
import activePlayerStyles from './ShirtStyles/ActivePlayer.module.scss';
import Pitch from '../common/pitch/Pitch';
import ConfirmModal from '../common/modal/ConfirmModal';
import SuccessModal from '../common/modal/SuccessModal';

const CurrentTeam = props => {
    useEffect(() => {
        props.fetchActiveTeamRequest(props.userId);
        // eslint-disable-next-line
    }, [props.fetchActiveTeamRequest, props.userId]);

    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [emptyPlayerOpen, setEmptyPlayerOpen] = useState(false);
    const [modalPlayer, setModalPlayer] = useState({});

    const onPlayerClick = useCallback(p => {
        const { position, ...rest } = p;
        if (!_.isEmpty(rest)) {
            setModalPlayer(p);
            setPlayerModalOpen(true);
        } else {
            setEmptyPlayerOpen(true);
        }
    }, [setPlayerModalOpen, setEmptyPlayerOpen]);

    const closeEmptyPlayerModal = useCallback(() => {
        setEmptyPlayerOpen(false);
    }, [setEmptyPlayerOpen]);

    const closeModal = useCallback(() => {
        setPlayerModalOpen(false);
        setModalPlayer({});
    }, []);

    const submit = useCallback(() => {
        props.makeCaptainRequest(modalPlayer.id);
        setPlayerModalOpen(false);
        setModalPlayer({});
        // eslint-disable-next-line
    }, [setModalPlayer, props.makeCaptainRequest, modalPlayer.id]);

    return (
        <div className={props.styles.pitchWrapper}>
            <div className={props.styles.currentTeamWrapper}>
                <Pitch
                    additionalInfo={player => player.team}
                    activeTeam={props.activeTeam}
                    activePlayerStyles={activePlayerStyles}
                    captain={props.captain}
                    loading={props.fetchingForUser}
                    goalkeeperStyles={goalkeeperStyles}
                    onPlayerClick={onPlayerClick}
                    renderEmptyPlayers
                    showCaptain
                />
            </div>
            <ConfirmModal
                closeModal={closeModal}
                isOpen={playerModalOpen}
                cancel={closeModal}
                submit={submit}
                text="Make captain?"
            />
            <SuccessModal
                closeModal={closeEmptyPlayerModal}
                isOpen={emptyPlayerOpen}
                cancel={closeEmptyPlayerModal}
                headerMessage="Go to the transfers page to make your team"
            />
        </div>
    );
};

CurrentTeam.defaultProps = {
    activeTeam: [],
    captain: '',
    fetchingForUser: false,
    styles: defaultStyles,
    userId: ''
};

CurrentTeam.propTypes = {
    activeTeam: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        position: PropTypes.string,
        team: PropTypes.string
    })),
    captain: PropTypes.string,
    fetchActiveTeamRequest: PropTypes.func.isRequired,
    fetchingForUser: PropTypes.bool,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    makeCaptainRequest: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string),
    userId: PropTypes.string
};

const mapStateToProps = (state, props) => ({
    activeTeam: selectors.getActiveTeam(state, props),
    captain: selectors.getCurrentCaptain(state, props),
    fetchingForUser: selectors.getFetchingForUser(state, props),
    userId: selectors.getUserId(props)
});

const mapDispatchToProps = {
    fetchActiveTeamRequest,
    makeCaptainRequest
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentTeam));

export { CurrentTeam as CurrentTeamUnconnected };
