import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import defaultStyles from './Desktop.module.scss';
import Pitch from '../../common/pitch/Pitch';
import StyledButton from '../../common/StyledButton/StyledButton';
import * as constants from '../../constants';
import Modals from '../common/Modals';
import Table from './Table';
import NextFixtures from '../nextfixtures/NextFixtures';

const teamsAreDifferent = (original, current) => {
    const playersInCurrentNotInOriginal = current.filter(c => !original.some(x => x.id === c.id));
    return playersInCurrentNotInOriginal.length > 0 && current.length === 11;
};

const Desktop = props => {
    const teamsDiffer = teamsAreDifferent(props.originalTeam, props.currentTeam);
    return (
        <>
            <div className={props.styles.transfersWrapperDesktop}>
                <div className={props.styles.pitchWrapper}>
                    <div className={props.styles.transfersHeader}>
                        <div className={props.styles.remainingBudget}>
                            <div className={props.styles.remainingBudgetValue}>
                                <div className={props.styles.remainingBudgetText}>
                                    Remaining Budget
                                </div>
                                <div>{`£${props.remainingBudget} mil`}</div>
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
                </div>
                <Table
                    allPlayers={props.allPlayers}
                    allTeams={props.allTeams}
                    activeTeam={props.currentTeam}
                    desktopColumns={props.desktopColumns}
                    fetchingAllPlayers={props.fetchingAllPlayers}
                    isAscendingSort={props.isAscendingSort}
                    onTransfersRequest={props.onTransfersRequest}
                    positionFilter={props.positionFilter}
                    sortBy={props.sortBy}
                    stateObj={props.stateObj}
                    setPositionFilter={props.setPositionFilter}
                />
            </div>
            <NextFixtures
                allTeams={props.allTeams}
                fixtures={props.fixtures.filter(x => !x.completed)}
                loadingFixtures={props.loadingFixtures}
                showCollegeCrest
            />
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

Desktop.defaultProps = {
    allPlayers: [],
    allTeams: [],
    closeRemoveModal: noop,
    closeRestoreModal: noop,
    closeTransfersError: noop,
    currentTeam: [],
    desktopColumns: [],
    originalTeam: [],
    fetchingAllPlayers: false,
    fetchingOriginalTeam: false,
    fixtures: [],
    isAscendingSort: false,
    loadingFixtures: false,
    onPlayerClick: noop,
    onTransfersRequest: noop,
    playerToRemove: {},
    positionFilter: '',
    remainingBudget: 0,
    removePlayer: noop,
    removeModalOpen: false,
    restoreModalOpen: false,
    restorePlayer: noop,
    selectReplacement: noop,
    setPositionFilter: noop,
    sortBy: '',
    stateObj: {},
    styles: defaultStyles,
    transfersError: '',
    transfersErrorCode: '',
    undoTransferChanges: noop,
    updateTeamRequest: noop
};

Desktop.propTypes = {
    allPlayers: PropTypes.arrayOf(PropTypes.shape({})),
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    closeRemoveModal: PropTypes.func,
    closeRestoreModal: PropTypes.func,
    closeTransfersError: PropTypes.func,
    currentTeam: PropTypes.arrayOf(PropTypes.shape({})),
    desktopColumns: PropTypes.arrayOf(PropTypes.shape({})),
    originalTeam: PropTypes.arrayOf(PropTypes.shape({})),
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
    isAscendingSort: PropTypes.bool,
    loadingFixtures: PropTypes.bool,
    onPlayerClick: PropTypes.func,
    onTransfersRequest: PropTypes.func,
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
    remainingBudget: PropTypes.number,
    removeModalOpen: PropTypes.bool,
    removePlayer: PropTypes.func,
    restoreModalOpen: PropTypes.bool,
    restorePlayer: PropTypes.func,
    selectReplacement: PropTypes.func,
    setPositionFilter: PropTypes.func,
    sortBy: PropTypes.string,
    stateObj: PropTypes.shape({}),
    styles: PropTypes.objectOf(PropTypes.string),
    transfersError: PropTypes.string,
    transfersErrorCode: PropTypes.string,
    undoTransferChanges: PropTypes.func,
    updateTeamRequest: PropTypes.func
};

export default Desktop;
