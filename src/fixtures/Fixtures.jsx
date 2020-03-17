import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import defaultStyles from './Fixtures.module.scss';
import {
    fetchFixturesRequest, setMyTeamRequest, fetchMyTeamRequest,
    closeFixturesError, closeSuccessMessage
} from './actions';
import Grid from '../common/grid/Grid';
import FixtureFilter from './view/FixtureFilters';
import SetTeam from './view/SetTeam';
import {
    generateCollingwoodTeams, gridStyles, fixturesFilters, columns, filterFixtures
} from './helpers';
import ErrorModal from '../common/modal/ErrorModal';
import SuccessModal from '../common/modal/SuccessModal';
import Fade from '../common/Fade/Fade';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: theme.spacing(4)
    }
}));

const Fixtures = props => {
    const classes = useStyles();
    const [myTeam, setMyTeam] = useState('');
    const [radioValue, setRadioValue] = useState('All');
    const [collingwoodOnly, setCollingwoodOnly] = useState(false);
    const [upcomingMatchesOnly, setUpcomingMatchesOnly] = useState(false);
    const [teamNameFilter, setTeamNameFilter] = useState('');

    useEffect(() => {
        props.fetchFixturesRequest();
        props.fetchMyTeamRequest();
        // eslint-disable-next-line
    }, [props.fetchMyTeamRequest]);

    useEffect(() => {
        if (props.myTeam !== 'No team set') {
            setRadioValue(props.myTeam);
        } else {
            setRadioValue('All');
        }
    }, [props.myTeam]);


    const updateMyTeam = useCallback(() => {
        props.setMyTeamRequest(myTeam);
        // eslint-disable-next-line
    }, [props.setMyTeamRequest, props.myTeam, myTeam]);

    const searchByTeamName = useCallback(teamName => {
        setTeamNameFilter(teamName);
        setCollingwoodOnly(false);
    }, [setTeamNameFilter, setCollingwoodOnly]);

    const toggleCollingwoodOnly = useCallback(() => {
        setCollingwoodOnly(!collingwoodOnly);
    }, [collingwoodOnly, setCollingwoodOnly]);

    const toggleUpcomingOnly = useCallback(() => {
        setUpcomingMatchesOnly(!upcomingMatchesOnly);
    }, [setUpcomingMatchesOnly, upcomingMatchesOnly]);

    const [editingFilters, setEditingFilters] = useState(false);

    const toggleFilters = useCallback(() => {
        setEditingFilters(!editingFilters);
    }, [setEditingFilters, editingFilters]);

    return (
        <>
            <div>
                <Paper elevation={4} className={classes.paper}>
                    <SetTeam
                        activeTeam={myTeam}
                        loadingMyTeam={props.loadingMyTeam}
                        myTeam={props.myTeam}
                        setActiveTeam={setMyTeam}
                        teamOptions={generateCollingwoodTeams(props.fixtures)}
                        updateMyTeam={updateMyTeam}
                    />
                    <div className={props.styles.editFiltersWrapper}>
                        <Fade
                            checked={editingFilters}
                            label="Edit filters"
                            includeCheckbox
                            onChange={toggleFilters}
                        >
                            <FixtureFilter
                                collingwoodOnly={collingwoodOnly}
                                radioOptions={fixturesFilters(props.myTeam, props.fixtures)}
                                radioValue={radioValue}
                                searchByTeamName={searchByTeamName}
                                setRadioValue={setRadioValue}
                                teamNameFilter={teamNameFilter}
                                toggleCollingwoodOnly={toggleCollingwoodOnly}
                                toggleUpcomingOnly={toggleUpcomingOnly}
                                upcomingMatchesOnly={upcomingMatchesOnly}
                            />
                        </Fade>
                    </div>
                </Paper>
                <div className={props.styles.gridWrapper}>
                    <Grid
                        columns={columns}
                        gridHeader="Fixtures"
                        loading={props.loadingFixtures}
                        onRowClick={noop}
                        rows={filterFixtures(
                            props.fixtures,
                            radioValue,
                            collingwoodOnly,
                            upcomingMatchesOnly,
                            teamNameFilter
                        )}
                        showPagination={false}
                        rowsPerPageOptions={[100000]}
                        maxHeightGrid
                        gridStyles={gridStyles}
                    />
                </div>
            </div>
            <ErrorModal
                closeModal={props.closeFixturesError}
                headerMessage={props.errorHeader}
                isOpen={props.errorMessage.length > 0}
                errorCode={props.errorCode}
                errorMessage={props.errorMessage}
            />
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

Fixtures.defaultProps = {
    closeFixturesError: noop,
    closeSuccessMessage: noop,
    errorMessage: '',
    errorCode: '',
    errorHeader: '',
    fetchFixturesRequest: noop,
    fetchMyTeamRequest: noop,
    fixtures: [],
    loadingFixtures: false,
    loadingMyTeam: false,
    myTeam: '',
    setMyTeamRequest: noop,
    styles: defaultStyles,
    successMessage: ''
};

Fixtures.propTypes = {
    closeFixturesError: PropTypes.func,
    closeSuccessMessage: PropTypes.func,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    errorHeader: PropTypes.string,
    fetchFixturesRequest: PropTypes.func,
    fetchMyTeamRequest: PropTypes.func,
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
    loadingMyTeam: PropTypes.bool,
    myTeam: PropTypes.string,
    setMyTeamRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    successMessage: PropTypes.string
};

const mapStateToProps = state => ({
    errorMessage: state.fixtures.errorMessage,
    errorCode: state.fixtures.errorCode,
    errorHeader: state.fixtures.errorHeader,
    fixtures: state.fixtures.fixtures,
    loadingFixtures: state.fixtures.loadingFixtures,
    loadingMyTeam: state.fixtures.loadingMyTeam,
    myTeam: state.fixtures.myTeam,
    successMessage: state.fixtures.successMessage
});

const mapDispatchToProps = {
    closeFixturesError,
    closeSuccessMessage,
    fetchFixturesRequest,
    fetchMyTeamRequest,
    setMyTeamRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(Fixtures);

export { Fixtures as FixturesUnconnected };
