import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAllTeamsRequest } from './actions';
import Graph from './graph/Graph';
import LeagueTable from './leaguetable/LeagueTable';
import WithCollapsable from '../common/collapsableHOC/WithCollapsable';
import mobileCollapsableStyles from './MobileGraphStyles.module.scss';
import { fetchFixturesRequest } from '../fixtures/actions';

const Charts = props => {
    useEffect(() => {
        props.fetchAllTeamsRequest();
        props.fetchFixturesRequest();
        // eslint-disable-next-line
    }, [props.fetchAllTeamsRequest]);

    const [graphOpen, setGraphOpen] = useState(true);
    const [leagueTableOpen, setLeagueTableOpen] = useState(true);

    const setOpen = useCallback(open => {
        setLeagueTableOpen(open);
    }, [setLeagueTableOpen]);

    const GraphSection = WithCollapsable(Graph);
    const LeagueTableSection = WithCollapsable(LeagueTable);

    const filterFixtures = useCallback(() => props.fixtures
        .filter(x => x.teamOne.includes('Collingwood') || x.teamTwo.includes('Collingwood'))
        .filter(x => x.completed)
        .filter(x => !x.isCup),
    [props.fixtures]);

    return (
        <>
            <GraphSection
                isOpen={graphOpen}
                fixtures={props.fixtures.filter(x => x.completed && !x.isCup)}
                loadingFixtures={props.loadingFixtures}
                toggle={setGraphOpen}
                title="Graphs"
                styles={mobileCollapsableStyles}
            />
            <LeagueTableSection
                allTeams={props.allTeams}
                fixtures={filterFixtures()}
                loadingFixtures={props.loadingFixtures}
                isOpen={leagueTableOpen}
                toggle={setOpen}
                title="LeagueTable"
                styles={mobileCollapsableStyles}
            />
        </>
    );
};

Charts.defaultProps = {
    allTeams: [],
    // fetchingAllTeams: false,
    fixtures: [],
    loadingFixtures: false
    // maxGameweek: 0
};

Charts.propTypes = {
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    fetchAllTeamsRequest: PropTypes.func.isRequired,
    // fetchingAllTeams: PropTypes.bool,
    fetchFixturesRequest: PropTypes.func.isRequired,
    fixtures: PropTypes.arrayOf(PropTypes.shape({
        teamOne: PropTypes.string,
        result: PropTypes.string,
        teamTwo: PropTypes.string,
        location: PropTypes.string,
        time: PropTypes.string,
        completed: PropTypes.bool,
        league: PropTypes.string
    })),
    loadingFixtures: PropTypes.bool
    // maxGameweek: PropTypes.number
};

const mapDispatchToProps = {
    fetchAllTeamsRequest,
    fetchFixturesRequest
};

const mapStateToProps = state => ({
    allTeams: state.charts.allTeams,
    fetchingAllTeams: state.charts.fetchingAllTeams,
    fixtures: state.fixtures.fixtures,
    loadingFixtures: state.fixtures.loadingFixtures,
    maxGameweek: state.overview.maxGameWeek
});

export default connect(mapStateToProps, mapDispatchToProps)(Charts);

export { Charts as ChartsUnconnected };
