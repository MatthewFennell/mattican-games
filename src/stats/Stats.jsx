import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fp from 'lodash/fp';
import EditIcon from '@material-ui/icons/Edit';
import defaultStyles from './Stats.module.scss';
import { fetchTeamsRequest } from '../admin/actions';
import Dropdown from '../common/dropdown/Dropdown';
import * as selectors from './selectors';
import * as constants from '../constants';
import { fetchTeamStatsByWeekRequest } from './actions';
import SuccessModal from '../common/modal/SuccessModal';
import EditFilter from './editfilter/EditFilter';
import { columns, weeksToRequest, combinePlayers } from './helpers';
import WeekStats from './weekstats/WeekStats';
import Switch from '../common/Switch/Switch';

const Stats = props => {
    useEffect(() => {
        props.fetchTeamsRequest();
        // eslint-disable-next-line
    }, [props.fetchTeamsRequest]);

    useEffect(() => {
        if (props.currentTeam !== 'none') {
            const weeksToFetch = weeksToRequest(props.minWeek, props.maxWeek, props.weeksFetched);
            weeksToFetch.forEach(x => {
                props.fetchTeamStatsByWeekRequest(props.currentTeam, x.min, x.max);
            });
        }
        // eslint-disable-next-line
    }, [props.currentTeam, props.minWeek, props.maxWeek, props.fetchTeamStatsByWeekRequest, props.weeksFetched]);

    const [editFilterModalOpen, setEditFilterModalOpen] = useState(false);
    const [activeColumns, setActiveColumns] = useState(columns
        .filter(x => x.initialActive));

    const loadNewTeam = useCallback(team => {
        const id = fp.get('id')(props.allTeams.find(x => x.text === team));
        props.history.push(`${constants.URL.STATS}/${id}/${props.minWeek}/${props.maxWeek}`);
    }, [props.allTeams,
        props.history, props.maxWeek, props.minWeek]);

    const confirmFilter = useCallback((minWeek, maxWeek, active) => {
        setActiveColumns(active);
        props.history.push(`${constants.URL.STATS}/${props.currentTeam}/${minWeek}/${maxWeek}`);
        setEditFilterModalOpen(false);
    }, [props.currentTeam, props.history]);

    const weekRange = fp.range(props.minWeek, props.maxWeek + 1);
    const [combineWeeks, setCombineWeeks] = useState(false);

    return (
        <>
            <div className={props.styles.statsWrapper}>
                <div className={props.styles.statsHeader}>
                    <div className={props.styles.dropdownWrapper}>
                        <Dropdown
                            value={fp.getOr('', 'text')(props.allTeams.find(x => x.id === props.currentTeam))}
                            onChange={loadNewTeam}
                            options={props.allTeams}
                            title="Team"
                        />
                        <div className={props.styles.toggleWrapper}>
                            <div className={props.styles.combineWeeksText}>
                                Combine weeks
                            </div>
                            <div>
                                <Switch
                                    checked={combineWeeks}
                                    color="primary"
                                    onChange={() => setCombineWeeks(!combineWeeks)}
                                />
                            </div>

                        </div>
                    </div>
                    <div
                        className={props.styles.editFiltersWrapper}
                        role="button"
                        tabIndex={0}
                        onClick={() => setEditFilterModalOpen(true)}
                    >
                        <div className={props.styles.editFilter}>
                        Edit Filters
                        </div>
                        <EditIcon color="primary" />
                    </div>
                </div>
                {combineWeeks ? (
                    <WeekStats
                        activeColumns={activeColumns}
                        loading={props.fetching && props.fetching.length > 0}
                        stats={combinePlayers(props.stats, props.minWeek, props.maxWeek)}
                        title={`Weeks ${props.minWeek}-${props.maxWeek}`}
                    />
                ) : weekRange.reverse().map(week => (
                    <WeekStats
                        activeColumns={activeColumns}
                        key={week}
                        loading={props.fetching && props.fetching.includes(week)}
                        stats={props.stats.filter(x => x.week === week)}
                        title={`Week ${week}`}
                    />
                ))}


            </div>
            <SuccessModal
                backdrop
                closeModal={() => setEditFilterModalOpen(false)}
                isOpen={editFilterModalOpen}
                headerMessage="Edit Filters"
            >
                <EditFilter
                    activeColumns={activeColumns}
                    allColumns={columns}
                    confirmFilter={confirmFilter}
                    maxGameWeek={props.maxGameWeek}
                    maxWeek={props.maxWeek}
                    minWeek={props.minWeek}
                />
            </SuccessModal>
        </>
    );
};


Stats.defaultProps = {
    allTeams: [],
    currentTeam: '',
    fetching: [],
    maxGameWeek: 0,
    maxWeek: 0,
    minWeek: 0,
    stats: [],
    styles: defaultStyles,
    weeksFetched: []
};

Stats.propTypes = {
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    currentTeam: PropTypes.string,
    fetching: PropTypes.arrayOf(PropTypes.number),
    fetchTeamStatsByWeekRequest: PropTypes.func.isRequired,
    fetchTeamsRequest: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    maxGameWeek: PropTypes.number,
    maxWeek: PropTypes.number,
    minWeek: PropTypes.number,
    stats: PropTypes.arrayOf(PropTypes.shape({})),
    styles: PropTypes.objectOf(PropTypes.string),
    weeksFetched: PropTypes.arrayOf(PropTypes.number)
};

const mapDispatchToProps = {
    fetchTeamsRequest,
    fetchTeamStatsByWeekRequest
};

const mapStateToProps = (state, props) => ({
    allTeams: state.admin.allTeams,
    minWeek: selectors.getCurrentMinWeek(props),
    maxWeek: selectors.getCurrentMaxWeek(props),
    fetching: selectors.getProperty(state, props, 'fetching'),
    currentTeam: selectors.getCurrentTeam(props),
    maxGameWeek: state.overview.maxGameWeek,
    stats: selectors.getProperty(state, props, 'stats'),
    weeksFetched: selectors.getProperty(state, props, 'weeksFetched')
});

export default connect(mapStateToProps, mapDispatchToProps)(Stats);

export { Stats as StatsUnconnected };
