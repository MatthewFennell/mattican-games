import React, { useEffect, useCallback, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchUsersInLeagueRequest, leaveLeagueRequest, closeLeaveLeagueError } from './actions';
import * as selectors from './selectors';
import Grid from '../common/grid/Grid';
import defaultStyles from './styles/Leagues.module.scss';
import * as constants from '../constants';
import StyledButton from '../common/StyledButton/StyledButton';
import Spinner from '../common/spinner/Spinner';
import ErrorModal from '../common/modal/ErrorModal';
import { generatePointsRoute } from '../helperFunctions';
import ConfirmModal from '../common/modal/ConfirmModal';

const columns = gameWeek => [
    {
        id: 'username',
        label: 'Username',
        align: 'center'
    },
    {
        id: 'position',
        label: 'Position',
        align: 'center'
    },
    {
        id: 'weekPoints',
        label: `Week ${gameWeek}`,
        align: 'center'
    },
    {
        id: 'userPoints',
        label: 'Total',
        align: 'center'
    }
];

const INITIAL_ROWS_PER_PAGE = 2;
const INITIAL_NUMBER_OF_PAGES_TO_LOAD = 3;

const UsersInLeague = props => {
    const generateRows = rows => rows.map(row => ({
        ...row,
        username:
    <div className={props.styles.userWrapper}>
        <div className={props.styles.miniText}>
            {row.teamName}
        </div>
        <div>{row.username}</div>
    </div>
    }));

    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        if (props.maxGameWeek || props.maxGameWeek === 0) {
            props.fetchUsersInLeagueRequest(props.leagueId,
                props.maxGameWeek,
                INITIAL_ROWS_PER_PAGE * INITIAL_NUMBER_OF_PAGES_TO_LOAD,
                pageNumber + 1,
                rowsPerPage);
        }
        // eslint-disable-next-line
    }, [props.fetchUsersInLeagueRequest, props.maxGameWeek, rowsPerPage, pageNumber]);

    const [leaveLeagueOpen, setLeaveLeagueOpen] = useState(false);

    const redirect = useCallback(() => {
        props.history.push(constants.URL.LEAGUES);
    }, [props.history]);

    const leaveLeague = useCallback(() => {
        setLeaveLeagueOpen(false);
        props.leaveLeagueRequest(props.leagueId);
        // eslint-disable-next-line
    }, [props.leaveLeagueRequest, props.leagueId, setLeaveLeagueOpen]);

    const loadUserPage = useCallback(user => {
        props.history.push(generatePointsRoute(user.userId, props.maxGameWeek));
    }, [props.maxGameWeek, props.history]);

    const setEntriesPerPage = useCallback((setRows, rows) => {
        setRowsPerPage(rows);
        setRows(rows);
    }, [setRowsPerPage]);

    const setCurrentPageNumber = useCallback((setPage, page) => {
        setPageNumber(page);
        setPage(page);
    }, [setPageNumber]);

    return (
        <div className={props.styles.leaguesWrapper}>
            <div className={props.styles.myLeaguesWrapper}>
                <div className={props.styles.myLeaguesTable}>
                    <Grid
                        activeRow={row => row.userId === props.auth.uid}
                        backButtonLink={redirect}
                        columns={columns(props.maxGameWeek)}
                        controlPagination
                        gridHeader={props.leagueName}
                        loading={props.fetchingUsersInLeague}
                        numberOfUsersInLeague={props.numberOfUsersInLeague}
                        setPage={setCurrentPageNumber}
                        setRowsPerPage={setEntriesPerPage}
                        onRowClick={loadUserPage}
                        renderBackButton
                        rows={generateRows(props.usersInLeague)}
                        rowsPerPageOptions={[INITIAL_ROWS_PER_PAGE]}
                    />
                </div>
            </div>
            <div className={props.styles.leagueButtonsWrapper}>
                <StyledButton
                    color="primary"
                    onClick={() => setLeaveLeagueOpen(true)}
                    text="Leave league"
                />
            </div>
            <ConfirmModal
                cancel={() => setLeaveLeagueOpen(false)}
                closeModal={() => setLeaveLeagueOpen(false)}
                isOpen={leaveLeagueOpen}
                submit={leaveLeague}
            />
            <ErrorModal
                closeModal={props.closeLeaveLeagueError}
                headerMessage="Error leaving league"
                isOpen={props.leaveLeagueError.length > 0}
                errorCode={props.leaveLeagueErrorCode}
                errorMessage={props.leaveLeagueError}
            />
            {props.leavingLeague
                && (
                    <div className={props.styles.spinnerWrapper}>
                        <Spinner color="secondary" />
                    </div>
                )}
        </div>
    );
};

const mapDispatchToProps = {
    closeLeaveLeagueError,
    fetchUsersInLeagueRequest,
    leaveLeagueRequest
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    fetchingUsersInLeague: selectors.getCurrentLeagueProperty(state, props, 'fetching'),
    leagueId: selectors.getLeagueId(props),
    leagueName: selectors.getCurrentLeagueProperty(state, props, 'leagueName'),
    leavingLeague: state.leagues.leavingLeague,
    leaveLeagueError: state.leagues.leaveLeagueError,
    leaveLeagueErrorCode: state.leagues.leaveLeagueErrorCode,
    maxGameWeek: state.overview.maxGameWeek,
    numberOfUsersInLeague: selectors.getCurrentLeagueProperty(state, props, 'numberOfUsers'),
    usersInLeague: selectors.getCurrentLeagueProperty(state, props, 'users')
});

UsersInLeague.defaultProps = {
    auth: {},
    fetchingUsersInLeague: false,
    leagueId: '',
    leagueName: '',
    leaveLeagueError: '',
    leaveLeagueErrorCode: '',
    leavingLeague: false,
    maxGameWeek: null,
    numberOfUsersInLeague: 0,
    styles: defaultStyles,
    usersInLeague: []
};

UsersInLeague.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string,
        emailVerified: PropTypes.bool
    }),
    closeLeaveLeagueError: PropTypes.func.isRequired,
    fetchingUsersInLeague: PropTypes.bool,
    fetchUsersInLeagueRequest: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    leagueId: PropTypes.string,
    leagueName: PropTypes.string,
    leaveLeagueRequest: PropTypes.func.isRequired,
    leaveLeagueError: PropTypes.string,
    leaveLeagueErrorCode: PropTypes.string,
    leavingLeague: PropTypes.bool,
    maxGameWeek: PropTypes.number,
    numberOfUsersInLeague: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string),
    usersInLeague: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        position: PropTypes.number,
        userPoints: PropTypes.number,
        username: PropTypes.string
    }))
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersInLeague));
