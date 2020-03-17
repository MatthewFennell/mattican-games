import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fp from 'lodash/fp';
import { withRouter } from 'react-router-dom';
import { noop } from 'lodash';
import defaultStyles from './EditPlayer.module.scss';
import {
    fetchTeamsRequest, fetchPlayersForTeamRequest, fetchPlayerStatsRequest, editPlayerStatsRequest,
    closeSuccessMessage, closeAdminError
} from '../actions';
import Dropdown from '../../common/dropdown/Dropdown';
import Grid from '../../common/grid/Grid';
import StyledButton from '../../common/StyledButton/StyledButton';
import Spinner from '../../common/spinner/Spinner';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import TextInput from '../../common/TextInput/TextInput';

const generateWeekOptions = maxGameWeek => {
    const options = [];
    for (let x = 1; x < maxGameWeek + 1; x += 1) {
        options.push({
            id: x,
            text: x,
            value: x
        });
    }
    return options;
};

const columns = [
    {
        id: 'stat',
        label: 'Stat',
        align: 'center'
    },
    {
        id: 'oldValue',
        label: 'Old Value',
        align: 'center'
    },
    {
        id: 'newValue',
        label: 'New Value',
        align: 'center',
        renderCell: true
    }
];

const WithSmallDiv = Component => {
    const DivWrapper = props => (
        <div
            className={props.styles.divWrapper}
            style={{
                marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'
            }}
        >
            <Component {...props} />
        </div>
    );

    DivWrapper.defaultProps = {
        styles: {}
    };

    DivWrapper.propTypes = {
        styles: PropTypes.objectOf(PropTypes.string)
    };

    return DivWrapper;
};

const SmallerInput = WithSmallDiv(TextInput);
const SmallerDropdown = WithSmallDiv(Dropdown);

const booleanOptions = [
    {
        id: 'false',
        value: 'false',
        text: 'false'
    },
    {
        id: 'true',
        value: 'true',
        text: 'true'
    }
];

const EditPlayer = props => {
    const [playerTeam, setPlayerTeam] = useState('');
    const [playerToEdit, setPlayerToEdit] = useState('');
    const [week, setWeek] = useState('');
    const [goals, setGoals] = useState('');
    const [assists, setAssists] = useState('');
    const [cleanSheet, setCleanSheet] = useState('');
    const [yellowCard, setYellowCard] = useState('');
    const [redCard, setRedCard] = useState('');
    const [motm, setMotm] = useState('');
    const [dotd, setDotd] = useState('');
    const [ownGoals, setOwnGoals] = useState('');
    const [penaltyMisses, setPenaltyMisses] = useState('');
    const [penaltySaves, setPenaltySaves] = useState('');

    const generateRows = (playerStats, fetching) => {
        const renderOldValue = (oldVal, loading) => {
            if (loading) {
                return <Spinner color="secondary" />;
            }

            return oldVal !== undefined ? oldVal.toString() : '';
        };

        const rows = [
            {
                id: 'goals',
                stat: 'Goals',
                oldValue: renderOldValue(playerStats.goals, fetching),
                newValue: <SmallerInput
                    label="Goals"
                    onChange={setGoals}
                    value={goals}
                    type="number"
                    centerText
                    styles={props.styles}
                />
            },
            {
                id: 'assists',
                stat: 'Assists',
                oldValue: renderOldValue(playerStats.assists, fetching),
                newValue: <SmallerInput
                    label="Assists"
                    onChange={setAssists}
                    value={assists}
                    type="number"
                    centerText
                    styles={props.styles}
                />
            },
            {
                id: 'cleanSheet',
                stat: 'Clean Sheet',
                oldValue: renderOldValue(playerStats.cleanSheet, fetching),
                newValue: <SmallerDropdown
                    onChange={setCleanSheet}
                    options={booleanOptions}
                    value={cleanSheet}
                    styles={props.styles}
                />
            },
            {
                id: 'yellowCard',
                stat: 'Yellow Card',
                oldValue: renderOldValue(playerStats.yellowCard, fetching),
                newValue: <SmallerDropdown
                    onChange={setYellowCard}
                    options={booleanOptions}
                    value={yellowCard}
                    styles={props.styles}
                />
            },
            {
                id: 'redCard',
                stat: 'Red Card',
                oldValue: renderOldValue(playerStats.redCard, fetching),
                newValue: <SmallerDropdown
                    onChange={setRedCard}
                    options={booleanOptions}
                    value={redCard}
                    styles={props.styles}
                />
            },
            {
                id: 'motm',
                stat: 'MOTM',
                oldValue: renderOldValue(playerStats.manOfTheMatch, fetching),
                newValue: <SmallerDropdown
                    onChange={setMotm}
                    options={booleanOptions}
                    value={motm}
                    styles={props.styles}
                />
            },
            {
                id: 'dotd',
                stat: 'DOTD',
                oldValue: renderOldValue(playerStats.dickOfTheDay, fetching),
                newValue: <SmallerDropdown
                    onChange={setDotd}
                    options={booleanOptions}
                    value={dotd}
                    styles={props.styles}
                />
            },
            {
                id: 'ownGoals',
                stat: 'Own Goals',
                oldValue: renderOldValue(playerStats.ownGoals, fetching),
                newValue: <SmallerInput
                    label="Own Goals"
                    onChange={setOwnGoals}
                    value={ownGoals}
                    type="number"
                    centerText
                    styles={props.styles}
                />
            },
            {
                id: 'penaltySaves',
                stat: 'Penalty Saves',
                oldValue: renderOldValue(playerStats.penaltySaves, fetching),
                newValue: <SmallerInput
                    label="Penalty Saves"
                    onChange={setPenaltySaves}
                    value={penaltySaves}
                    type="number"
                    centerText
                    styles={props.styles}
                />
            },
            {
                id: 'penaltyMisses',
                stat: 'Penalty Misses',
                oldValue: renderOldValue(playerStats.penaltyMisses, fetching),
                newValue: <SmallerInput
                    label="Penalty Misses"
                    onChange={setPenaltyMisses}
                    value={penaltyMisses}
                    type="number"
                    centerText
                    styles={props.styles}
                />
            }
        ];
        return rows;
    };

    useEffect(() => {
        if (playerTeam && playerToEdit && week) {
            const playerId = fp.get('id')(props.teamsWithPlayers[playerTeam].find(x => x.value === playerToEdit));
            if (playerId) {
                props.fetchPlayerStatsRequest(playerId, week);
            }
        }
        // eslint-disable-next-line
    }, [playerTeam, playerToEdit, week, props.teamsWithPlayers, props.fetchPlayerStatsRequest]);

    useEffect(() => {
        props.fetchTeamsRequest();
        // eslint-disable-next-line
    }, [props.fetchTeamsRequest]);

    const setPlayer = useCallback(p => {
        setPlayerToEdit(p);
    }, [setPlayerToEdit]);

    const setTeam = useCallback(name => {
        setPlayerTeam(name);
        setPlayerToEdit('');
        props.fetchPlayersForTeamRequest(name);
        // eslint-disable-next-line
    }, [props.fetchPlayersForTeamRequest, playerTeam, setPlayerTeam]);

    const setWeekToEdit = useCallback(w => {
        setWeek(w);
    }, [setWeek]);

    const playersForActiveTeam = fp.getOr([], playerTeam)(props.teamsWithPlayers);

    const getInteger = value => (Number.isInteger(value) && value >= 0 ? value : '');

    const getBooleanVal = val => {
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }
        return '';
    };

    const editPlayer = useCallback(() => {
        const isDifferent = (key, valBefore, valAfter) => {
            if (valAfter !== '' && valBefore.toString() !== valAfter.toString()) {
                return fp.set(key, valAfter);
            }
            return fp.identity;
        };
        const difference = fp.flow(
            isDifferent('goals', props.playerStats.goals, getInteger(parseFloat(goals))),
            isDifferent('assists', props.playerStats.assists, getInteger(parseFloat(assists))),
            isDifferent('ownGoals', props.playerStats.ownGoals, getInteger(parseFloat(ownGoals))),
            isDifferent('penaltyMisses', props.playerStats.penaltyMisses, getInteger(parseFloat(penaltyMisses))),
            isDifferent('penaltySaves', props.playerStats.penaltySaves, getInteger(parseFloat(penaltySaves))),
            isDifferent('cleanSheet', props.playerStats.cleanSheet, getBooleanVal(cleanSheet)),
            isDifferent('redCard', props.playerStats.redCard, getBooleanVal(redCard)),
            isDifferent('yellowCard', props.playerStats.yellowCard, getBooleanVal(yellowCard)),
            isDifferent('manOfTheMatch', props.playerStats.manOfTheMatch, getBooleanVal(motm)),
            isDifferent('dickOfTheDay', props.playerStats.dickOfTheDay, getBooleanVal(dotd))
        )({});

        const playerId = fp.flow(
            fp.get(playerTeam),
            fp.find(x => x.value === playerToEdit),
            fp.get('id')
        )(props.teamsWithPlayers);

        setGoals('');
        setAssists('');
        setCleanSheet('');
        setRedCard('');
        setYellowCard('');
        setMotm('');
        setDotd('');
        setOwnGoals('');
        setPenaltyMisses('');
        setPenaltySaves('');

        props.editPlayerStatsRequest(playerId, week, difference);
        // eslint-disable-next-line
    }, [goals, assists, cleanSheet, redCard, yellowCard, motm,
        props.teamsWithPlayers, props.editPlayerStatsRequest, dotd,
        ownGoals, playerTeam, playerToEdit, week, penaltyMisses, penaltySaves]);

    const rowsToUse = generateRows(props.playerStats,
        props.fetchingPlayerStats || props.editingStats);

    console.log('player to edit', playerToEdit);

    return (
        <>
            <div className={props.styles.findPlayerDropdowns}>
                <div className={props.styles.teamDropdown}>
                    <Dropdown
                        value={playerTeam}
                        onChange={setTeam}
                        options={props.allTeams}
                        title="Team"
                    />
                </div>
                <div className={props.styles.playerDropdown}>
                    <Dropdown
                        value={playerToEdit}
                        onChange={setPlayer}
                        options={playersForActiveTeam}
                        title="Player to edit"
                    />
                </div>
                <div>
                    <Dropdown
                        value={week}
                        onChange={setWeekToEdit}
                        options={generateWeekOptions(props.maxGameWeek)}
                        title="Week"
                    />
                </div>
            </div>
            <div className={props.styles.oldStatsWrapper}>
                <Grid
                    columns={columns}
                    rows={rowsToUse}
                    showPagination={false}
                    rowsPerPageOptions={[rowsToUse.length]}
                />
                <div className={props.styles.buttonWrapper}>
                    <StyledButton
                        color="primary"
                        onClick={editPlayer}
                        text="Edit Stats"
                        disabled={!playerTeam || !playerToEdit || !week}
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

EditPlayer.defaultProps = {
    allTeams: [],
    errorMessage: '',
    errorCode: '',
    errorHeader: '',
    fetchingPlayerStats: false,
    maxGameWeek: null,
    playerStats: {},
    successMessage: '',
    styles: defaultStyles,
    teamsWithPlayers: {}
};

EditPlayer.propTypes = {
    allTeams: PropTypes.arrayOf(PropTypes.shape({})),
    closeAdminError: PropTypes.func.isRequired,
    closeSuccessMessage: PropTypes.func.isRequired,
    editingStats: PropTypes.bool.isRequired,
    editPlayerStatsRequest: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string,
    errorHeader: PropTypes.string,
    fetchingPlayerStats: PropTypes.bool,
    fetchPlayerStatsRequest: PropTypes.func.isRequired,
    fetchPlayersForTeamRequest: PropTypes.func.isRequired,
    fetchTeamsRequest: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    maxGameWeek: PropTypes.number,
    playerStats: PropTypes.shape({
        fetching: PropTypes.bool,
        assists: PropTypes.number,
        cleanSheet: PropTypes.bool,
        goals: PropTypes.number,
        redCard: PropTypes.bool,
        yellowCard: PropTypes.bool,
        manOfTheMatch: PropTypes.bool,
        dickOfTheDay: PropTypes.bool,
        ownGoals: PropTypes.number,
        penaltyMisses: PropTypes.number,
        penaltySaves: PropTypes.number
    }),
    successMessage: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    teamsWithPlayers: PropTypes.objectOf(PropTypes.array)
};

const mapDispatchToProps = {
    closeAdminError,
    closeSuccessMessage,
    editPlayerStatsRequest,
    fetchPlayersForTeamRequest,
    fetchPlayerStatsRequest,
    fetchTeamsRequest
};

const mapStateToProps = state => ({
    allTeams: state.admin.allTeams,
    editingStats: state.admin.editingStats,
    errorMessage: state.admin.errorMessage,
    errorCode: state.admin.errorCode,
    errorHeader: state.admin.errorHeader,
    fetchingPlayerStats: state.admin.fetchingPlayerStats,
    maxGameWeek: state.overview.maxGameWeek,
    playerStats: state.admin.playerStats,
    successMessage: state.admin.successMessage,
    teamsWithPlayers: state.admin.teamsWithPlayers
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPlayer));

export { EditPlayer as EditPlayerUnconnected };
