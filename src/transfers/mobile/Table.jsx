import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import _, { noop } from 'lodash';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import classNames from 'classnames';
import defaultStyles from './Table.module.scss';
import Grid from '../../common/grid/Grid';
import inputStyles from '../common/InputStyles.module.scss';
import SuccessModal from '../../common/modal/SuccessModal';
import TableModal from './TableModal';
import Dropdown from '../../common/dropdown/Dropdown';
import Slider from '../../common/slider/Slider';
import {
    RadioAscDesc, RadioPosition
} from './helpers';
import { marks, sortListAscDesc } from '../common/helpers';
import TextInput from '../../common/TextInput/TextInput';
import * as textInputConstants from '../../common/TextInput/constants';

const Table = props => {
    const {
        myColumns,
        setMyColumns,
        columnModalOpen,
        setColumnModalOpen,
        nameFilter,
        setNameFilter,
        searchByName,
        setSearchByName,
        pointsFilter,
        setPointsFilter,
        teamFilter,
        setTeamFilter,
        goalFilter,
        setGoalFilter,
        assistsFilter,
        setAssistsFilter,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        priceFilter,
        setPriceFilter,
        previousScoreFilter,
        setPreviousScoreFilter
    } = props.stateObj;

    const filterPlayers = players => {
        const notInMyTeam = players.filter(x => !props.activeTeam.some(y => y.id === x.id));
        const byName = notInMyTeam.filter(x => x.name.includes(searchByName));
        if (props.sortBy === 'name') {
            return sortListAscDesc(byName, nameFilter, 'name');
        }
        if (props.sortBy === 'position') {
            return byName.filter(x => x.position === props.positionFilter);
        }
        if (props.sortBy === 'team') {
            return byName.filter(x => x.team === teamFilter || teamFilter === '');
        }
        if (props.sortBy === 'points') {
            return sortListAscDesc(byName, pointsFilter, 'points');
        }
        if (props.sortBy === 'goals') {
            return sortListAscDesc(byName, goalFilter, 'goals');
        }
        if (props.sortBy === 'assists') {
            return sortListAscDesc(byName, assistsFilter, 'assists');
        }
        if (props.sortBy === 'price') {
            return sortListAscDesc(byName.filter(x => x.price >= minPrice && x.price <= maxPrice), priceFilter, 'price');
        }
        if (props.sortBy === 'previousScore') {
            return sortListAscDesc(byName, previousScoreFilter, 'previousScore');
        }
        return [];
    };

    const toggleColumns = useCallback(column => {
        if (myColumns.find(x => x.id === column).active) {
            setMyColumns(myColumns.map(x => (x.id === column ? ({ ...x, active: false }) : x)));
            if (props.sortBy === column) {
                props.setSortBy('name');
            }
        } else {
            setMyColumns(myColumns.map(x => (x.id === column ? ({ ...x, active: true }) : x)));
        }
        // eslint-disable-next-line
    }, [myColumns, setMyColumns]);

    const findSortingComponent = useCallback(id => {
        if (id === 'name') {
            return RadioAscDesc(nameFilter, setNameFilter, 'Direction');
        }
        if (id === 'position') {
            return RadioPosition(props.positionFilter, props.setPositionFilter, 'Filter by Position');
        }
        if (id === 'team') {
            return (
                <Dropdown
                    options={props.allTeams.map(x => ({
                        id: x.id,
                        value: x.team_name,
                        text: x.team_name
                    }))}
                    onChange={setTeamFilter}
                    value={teamFilter}
                />
            );
        }
        if (id === 'price') {
            return (
                <div className={props.styles.priceWrapper}>
                    <Slider marks={marks} min={0} max={10} step={1} text="Min Price" onChange={setMinPrice} defaultValue={0} />
                    <Slider marks={marks} min={0} max={10} step={1} text="Max Price" onChange={setMaxPrice} defaultValue={10} />
                    {RadioAscDesc(priceFilter, setPriceFilter, 'Direction')}
                </div>
            );
        }
        if (id === 'points') {
            return RadioAscDesc(pointsFilter, setPointsFilter, 'Direction');
        }
        if (id === 'goals') {
            return RadioAscDesc(goalFilter, setGoalFilter, 'Direction');
        }
        if (id === 'assists') {
            return RadioAscDesc(assistsFilter, setAssistsFilter, 'Direction');
        }
        if (id === 'previousScore') {
            return RadioAscDesc(previousScoreFilter, setPreviousScoreFilter, 'Direction');
        }
        return null;
    }, [nameFilter, props.positionFilter, teamFilter, priceFilter,
        goalFilter, assistsFilter, pointsFilter, props.allTeams, previousScoreFilter,
        props.setPositionFilter, props.styles, setAssistsFilter, setGoalFilter, setMaxPrice,
        setMinPrice, setNameFilter, setPointsFilter, setPreviousScoreFilter,
        setPriceFilter, setTeamFilter]);

    return (
        <>
            <div className={props.styles.playersWrapper}>
                <div className={props.styles.header}>
                    <div className={props.styles.backIcon}>
                        <ArrowBackIcon
                            onClick={props.closePlayerTable}
                            fontSize="large"
                        />
                    </div>
                    <div className={props.styles.inputWrapper}>
                        <TextInput
                            value={searchByName}
                            onChange={setSearchByName}
                            styles={inputStyles}
                            icon={textInputConstants.textInputIcons.search}
                            iconColor="primary"
                        />
                    </div>
                    <div className={props.styles.editColumns}>
                        {`£${(props.remainingBudget + (props.playerToRemove.price || 0))} mil`}
                    </div>
                </div>
                <div>
                    {props.playerToRemove.name && (
                        <div className={props.styles.playerRemoved}>
                            <div className={props.styles.playerRemovedText}>
                        Player Removed
                            </div>
                            <div className={props.styles.playerInfo}>
                                <div>
                                    {props.playerToRemove.name}
                                </div>
                                <div>
                                    {props.playerToRemove.position}
                                </div>
                                <div>
                                    {`£${props.playerToRemove.price} mil`}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={classNames({
                        [props.styles.bigMarginTop]: props.playerToRemove.name,
                        [props.styles.smallMarginTop]: !props.playerToRemove.name
                    })}
                    >
                        <Grid
                            columns={myColumns.filter(x => x.active)}
                            loading={props.fetchingAllPlayers}
                            onRowClick={props.onTransfersRequest}
                            rows={filterPlayers(props.allPlayers).map(x => ({
                                ...x,
                                position: x.position.charAt(0) + x.position.slice(1).toLowerCase()
                            }))}
                            rowsPerPageOptions={[50]}
                        />
                    </div>
                </div>

            </div>
            <SuccessModal
                backdrop
                closeModal={() => setColumnModalOpen(false)}
                isOpen={columnModalOpen}
                headerMessage="Select Columns (3 Max)"
            >
                <TableModal
                    activeColumns={myColumns.filter(x => x.active)}
                    columnOptions={myColumns}
                    setSortBy={props.setSortBy}
                    sortBy={props.sortBy}
                    sortingComponent={_.get(findSortingComponent(myColumns
                        .find(x => x.id === props.sortBy)), 'id') || ''}
                    toggleColumns={toggleColumns}
                />
            </SuccessModal>
        </>
    );
};

Table.defaultProps = {
    activeTeam: [],
    allPlayers: [],
    allTeams: [],
    closePlayerTable: noop,
    fetchingAllPlayers: false,
    onTransfersRequest: noop,
    remainingBudget: 0,
    positionFilter: '',
    setPositionFilter: noop,
    setSortBy: noop,
    sortBy: '',
    styles: defaultStyles,
    playerToRemove: {},
    stateObj: {
        myColumns: [],
        setMyColumns: noop,
        columnModalOpen: false,
        setColumnModalOpen: noop,
        nameFilter: '',
        setNameFilter: noop,
        searchByName: '',
        setSearchByName: noop,
        pointsFilter: 'Desc',
        setPointsFilter: noop,
        teamFilter: '',
        setTeamFilter: noop,
        goalFilter: 'Desc',
        setGoalFilter: noop,
        assistsFilter: 'Desc',
        setAssistsFilter: noop,
        minPrice: 0,
        setMinPrice: noop,
        maxPrice: 0,
        setMaxPrice: noop,
        priceFilter: 'Desc',
        setPriceFilter: noop,
        previousScoreFilter: 'Desc',
        setPreviousScoreFilter: noop
    }
};

Table.propTypes = {
    activeTeam: PropTypes.arrayOf(PropTypes.shape({})),
    allPlayers: PropTypes.arrayOf(PropTypes.shape({})),
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    closePlayerTable: PropTypes.func,
    fetchingAllPlayers: PropTypes.bool,
    onTransfersRequest: PropTypes.func,
    playerToRemove: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string,
            position: PropTypes.string,
            price: PropTypes.number
        })
    ]),
    positionFilter: PropTypes.string,
    remainingBudget: PropTypes.number,
    setPositionFilter: PropTypes.func,
    setSortBy: PropTypes.func,
    sortBy: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),

    stateObj: PropTypes.shape({
        myColumns: PropTypes.arrayOf(PropTypes.shape({})),
        setMyColumns: PropTypes.func,
        columnModalOpen: PropTypes.bool,
        setColumnModalOpen: PropTypes.func,
        nameFilter: PropTypes.string,
        setNameFilter: PropTypes.func,
        searchByName: PropTypes.string,
        setSearchByName: PropTypes.func,
        pointsFilter: PropTypes.string,
        setPointsFilter: PropTypes.func,
        teamFilter: PropTypes.string,
        setTeamFilter: PropTypes.func,
        goalFilter: PropTypes.string,
        setGoalFilter: PropTypes.func,
        assistsFilter: PropTypes.string,
        setAssistsFilter: PropTypes.func,
        minPrice: PropTypes.number,
        setMinPrice: PropTypes.func,
        maxPrice: PropTypes.number,
        setMaxPrice: PropTypes.func,
        priceFilter: PropTypes.string,
        setPriceFilter: PropTypes.func,
        previousScoreFilter: PropTypes.string,
        setPreviousScoreFilter: PropTypes.func
    })
};

export default Table;
