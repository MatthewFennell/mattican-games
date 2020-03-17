import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import defaultStyles from './Mobile.module.scss';
import Pitch from '../../common/pitch/Pitch';
import StyledButton from '../../common/StyledButton/StyledButton';
import Table from './Table';
import * as constants from '../../constants';
import Modals from '../common/Modals';
import NextFixtures from '../nextfixtures/NextFixtures';

const teamsAreDifferent = (original, current) => {
    const playersInCurrentNotInOriginal = current.filter(c => !original.some(x => x.id === c.id));
    return playersInCurrentNotInOriginal.length > 0 && current.length === 11;
};

const Mobile = props => {
    const teamsDiffer = teamsAreDifferent(props.originalTeam, props.currentTeam);
    return (
        <>
            <SwipeableDrawer
                anchor="right"
                open={props.playerTableOpen}
                onClose={props.closePlayerTable}
                onOpen={noop}
            >
                <Table
                    activeTeam={props.currentTeam}
                    allPlayers={props.allPlayers}
                    allTeams={props.allTeams}
                    closePlayerTable={props.closePlayerTable}
                    fetchingAllPlayers={props.fetchingAllPlayers}
                    playerToRemove={props.playerToRemove}
                    onTransfersRequest={props.onTransfersRequest}
                    remainingBudget={props.remainingBudget}
                    positionFilter={props.positionFilter}
                    setPositionFilter={props.setPositionFilter}
                    setSortBy={props.setSortBy}
                    sortBy={props.sortBy}
                    stateObj={props.stateObj}
                />
            </SwipeableDrawer>
            <div className={props.styles.pitchWrapper}>
                <div className={props.styles.currentTeamWrapper}>
                    <div className={props.styles.transfersHeader}>
                        <div className={props.styles.remainingBudget}>
                            <div className={props.styles.remainingBudgetValue}>
                                {`£${props.remainingBudget} mil`}
                            </div>
                        </div>
                        <div>
                            <StyledButton
                                color="primary"
                                onClick={props.undoTransferChanges}
                                text="Reset"
                                disabled={!teamsDiffer}
                            />
                        </div>
                        <div>
                            <StyledButton
                                color="primary"
                                onClick={props.updateTeamRequest}
                                text="Confirm"
                                disabled={!teamsDiffer}
                            />
                            <div className={classNames({
                                [props.styles.saveChanges]: true,
                                [props.styles.hidden]: !teamsDiffer
                            })}
                            >
                            Save changes
                            </div>
                        </div>
                    </div>
                    <Pitch
                        additionalInfo={player => `£${player.price} mil`}
                        activeTeam={props.currentTeam}
                        loading={props.fetchingOriginalTeam}
                        maxInPos={{
                            GOALKEEPER: constants.maxPerPosition.GOALKEEPER,
                            DEFENDER: constants.maxPerPosition.DEFENDER,
                            MIDFIELDER: constants.maxPerPosition.MIDFIELDER,
                            ATTACKER: constants.maxPerPosition.ATTACKER
                        }}
                        onPlayerClick={props.onPlayerClick}
                        renderEmptyPlayers
                    />
                    <NextFixtures
                        allTeams={props.allTeams}
                        fixtures={props.fixtures.filter(x => !x.completed)}
                        loadingFixtures={props.loadingFixtures}
                        showCollegeCrest={false}
                    />
                </div>
            </div>
            <Modals
                closeRemoveModal={props.closeRemoveModal}
                closeRestoreModal={props.closeRestoreModal}
                closeTransfersError={props.closeTransfersError}
                playerToRemove={props.playerToRemove}
                removeModalOpen={props.removeModalOpen}
                removePlayer={props.removePlayer}
                restoreModalOpen={props.restoreModalOpen}
                restorePlayer={props.restorePlayer}
                selectReplacement={props.selectReplacement}
                transfersError={props.transfersError}
                transfersErrorCode={props.transfersErrorCode}
            />
        </>
    );
};

Mobile.defaultProps = {
    allPlayers: [],
    allTeams: [],
    closePlayerTable: noop,
    closeRemoveModal: noop,
    closeRestoreModal: noop,
    closeTransfersError: noop,
    currentTeam: [],
    fetchingAllPlayers: false,
    fetchingOriginalTeam: false,
    fixtures: [],
    loadingFixtures: false,
    onTransfersRequest: noop,
    onPlayerClick: noop,
    originalTeam: [],
    remainingBudget: 0,
    playerTableOpen: false,
    playerToRemove: {},
    positionFilter: '',
    removeModalOpen: false,
    restoreModalOpen: false,
    removePlayer: noop,
    restorePlayer: noop,
    setPositionFilter: noop,
    selectReplacement: noop,
    setSortBy: noop,
    sortBy: '',
    styles: defaultStyles,
    transfersError: '',
    transfersErrorCode: '',
    undoTransferChanges: noop,
    updateTeamRequest: noop,
    stateObj: {}
};

Mobile.propTypes = {
    allPlayers: PropTypes.arrayOf(PropTypes.shape({})),
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    closePlayerTable: PropTypes.func,
    closeRemoveModal: PropTypes.func,
    closeRestoreModal: PropTypes.func,
    closeTransfersError: PropTypes.func,
    currentTeam: PropTypes.arrayOf(PropTypes.shape({})),
    fetchingAllPlayers: PropTypes.bool,
    fetchingOriginalTeam: PropTypes.bool,
    fixtures: PropTypes.arrayOf(PropTypes.shape({
        teamOne: PropTypes.string,
        result: PropTypes.string,
        teamTwo: PropTypes.string,
        location: PropTypes.string,
        time: PropTypes.string,
        completed: PropTypes.bool,
        league: PropTypes.string
    })),
    loadingFixtures: PropTypes.bool,
    onTransfersRequest: PropTypes.func,
    onPlayerClick: PropTypes.func,
    originalTeam: PropTypes.arrayOf(PropTypes.shape({})),
    remainingBudget: PropTypes.number,
    playerTableOpen: PropTypes.bool,
    playerToRemove: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string,
            position: PropTypes.string,
            price: PropTypes.number,
            id: PropTypes.string
        })
    ]),
    positionFilter: PropTypes.string,
    removeModalOpen: PropTypes.bool,
    removePlayer: PropTypes.func,
    restorePlayer: PropTypes.func,
    restoreModalOpen: PropTypes.bool,
    selectReplacement: PropTypes.func,
    setPositionFilter: PropTypes.func,
    setSortBy: PropTypes.func,
    sortBy: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    transfersError: PropTypes.string,
    transfersErrorCode: PropTypes.string,
    undoTransferChanges: PropTypes.func,
    updateTeamRequest: PropTypes.func,
    stateObj: PropTypes.shape({})
};

export default Mobile;
