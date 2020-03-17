import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import _ from 'lodash';
import defaultStyles from './Graph.module.scss';
import Spinner from '../../common/spinner/Spinner';
import * as helpers from '../helpers';
import Autocompletecheckbox from '../../common/Autocomplete/AutocompleteCheckbox';
import RadioButton from '../../common/radio/RadioButton';

const graphTitle = {
    goalsFor: 'Goals Scored Per Week',
    goalsAgainst: 'Goals Conceded Per Week',
    totalPoints: 'Total Points'
};

const Graph = props => {
    const [graphMode, setGraphMode] = useState(helpers.graphModes.totalPoints);
    const [graphData, setGraphData] = useState([]);
    const [allDays, setAllDays] = useState([]);
    const [accumulation, setAccumulation] = useState({});
    const [weekIntervals, setWeekIntervals] = useState([]);
    const [activeTeams, setActiveTeams] = useState([]);

    // Load the graph data - main one
    useEffect(() => {
        const nonCwoodTeams = activeTeams.map(x => x.text);
        const newGraphData = helpers.combineData(nonCwoodTeams,
            allDays, accumulation, graphMode);
        setGraphData(newGraphData);
    }, [props.fixtures, graphMode, accumulation, allDays, activeTeams]);

    // Find all the days from start -> end of fixtures
    useEffect(() => {
        setAllDays(helpers.generateAllDays(props.fixtures));
    }, [props.fixtures]);

    useEffect(() => {
        const nonCwoodTeams = activeTeams.map(x => x.text);
        const newAccumulation = helpers.makeGraphAccumulation(accumulation,
            props.fixtures, weekIntervals, nonCwoodTeams);

        if (!_.isEqual(newAccumulation, accumulation)) {
            setAccumulation(newAccumulation);
        }
    }, [props.fixtures, allDays, weekIntervals, accumulation, activeTeams]);

    useEffect(() => {
        const weeks = helpers.generateWeekTicks(props.fixtures);
        setWeekIntervals(weeks);
    }, [props.fixtures]);

    const uniqueTeams = useCallback(() => helpers.generateUniqueTeams(
        props.fixtures
    ),
    [props.fixtures]);


    return (
        <>
            <div className={props.styles.graphChoiceWrapper}>
                <Autocompletecheckbox
                    label="Select Teams"
                    loading={props.loadingFixtures}
                    options={uniqueTeams()}
                    onChange={setActiveTeams}
                    placeholder="Add more teams"
                    value={activeTeams}
                    withPadding
                />
                <div className={props.styles.radioWrapper}>
                    <RadioButton
                        title="Graph Choice"
                        key="Graph Choice"
                        onChange={setGraphMode}
                        options={[
                            {
                                text: 'Total points',
                                id: helpers.graphModes.totalPoints,
                                value: helpers.graphModes.totalPoints
                            },
                            {
                                text: 'Total Goals Scored',
                                id: helpers.graphModes.totalGoalsFor,
                                value: helpers.graphModes.totalGoalsFor
                            },
                            {
                                text: 'Total Goals Conceded',
                                id: helpers.graphModes.totalGoalsAgainst,
                                value: helpers.graphModes.totalGoalsAgainst
                            }
                        ]}
                        value={graphMode}
                    />
                </div>
            </div>


            {activeTeams.length > 0 ? (
                <Chart
                    height="500px"
                    chartType="LineChart"
                    loader={(
                        <div className={props.styles.graphSpinner}>
                            <Spinner color="secondary" />
                        </div>
                    )}
                    data={graphData}
                    options={{
                        hAxis: {
                            title: 'Date'
                        },
                        vAxis: {
                            title: graphTitle[graphMode],
                            viewWindow: { min: 0 }
                        },
                        series: {
                            1: { curveType: 'function' }
                        }
                    }}
                    rootProps={{ 'data-testid': '2' }}
                />
            ) : (
                <div className={props.styles.selectTeamsMessage}>
                  Please select some teams
                </div>
            )}
        </>
    );
};

Graph.propTypes = {
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
    styles: PropTypes.objectOf(PropTypes.string)
};

Graph.defaultProps = {
    fixtures: [],
    loadingFixtures: false,
    styles: defaultStyles
};

export default Graph;
