const pre = 'ADMIN/';

export const FETCH_TEAMS_REQUEST = `${pre}FETCH_TEAMS_REQUEST`;
export const FETCH_TEAMS_SUCCESS = `${pre}FETCH_TEAMS_SUCCESS`;

export const CREATE_PLAYER_REQUEST = `${pre}CREATE_PLAYER_REQUEST`;
export const CREATE_PLAYER_SUCCESS = `${pre}CREATE_PLAYER_SUCCESS`;

export const CREATE_TEAM_REQUEST = `${pre}CREATE_TEAM_REQUEST`;
export const CREATE_TEAM_SUCCESS = `${pre}CREATE_TEAM_SUCCESS`;

export const SUBMIT_RESULT_REQUEST = `${pre}SUBMIT_RESULT_REQUEST`;
export const SUBMIT_RESULT_SUCCESS = `${pre}SUBMIT_RESULT_SUCCESS`;

export const FETCH_PLAYERS_FOR_TEAM_REQUEST = `${pre}FETCH_PLAYERS_FOR_TEAM_REQUEST`;
export const FETCH_PLAYERS_FOR_TEAM_SUCCESS = `${pre}FETCH_PLAYERS_FOR_TEAM_SUCCESS`;

export const DELETE_PLAYER_REQUEST = `${pre}DELETE_PLAYER_REQUEST`;
export const DELETE_PLAYER_SUCCESS = `${pre}DELETE_PLAYER_SUCCESS`;

export const DELETE_TEAM_REQUEST = `${pre}DELETE_TEAM_REQUEST`;
export const DELETE_TEAM_SUCCESS = `${pre}DELETE_TEAM_SUCCESS`;

export const TRIGGER_WEEK_REQUEST = `${pre}TRIGGER_WEEK_REQUEST`;
export const TRIGGER_WEEK_SUCCESS = `${pre}TRIGGER_WEEK_SUCCESS`;

export const FETCH_PLAYER_STATS_REQUEST = `${pre}FETCH_PLAYER_STATS_REQUEST`;
export const FETCH_PLAYER_STATS_SUCCESS = `${pre}FETCH_PLAYER_STATS_SUCCESS`;

export const EDIT_PLAYER_STATS_REQUEST = `${pre}EDIT_PLAYER_STATS_REQUEST`;
export const EDIT_PLAYER_STATS_SUCCESS = `${pre}EDIT_PLAYER_STATS_SUCCESS`;

export const FETCH_USERS_WITH_EXTRA_ROLES_REQUEST = `${pre}FETCH_USERS_WITH_EXTRA_ROLES_REQUEST`;
export const FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS = `${pre}FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS`;
export const LOAD_USERS_WITH_EXTRA_ROLES = `${pre}LOAD_USERS_WITH_EXTRA_ROLES`;
export const ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES = `${pre}ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES`;

export const FETCH_INITIAL_USERS_REQUEST = `${pre}FETCH_INITIAL_USERS_REQUEST`;
export const FETCH_INITIAL_USERS_SUCCESS = `${pre}FETCH_INITIAL_USERS_SUCCESS`;

export const ADD_USER_ROLE_REQUEST = `${pre}ADD_USER_ROLE_REQUEST`;
export const REMOVE_USER_ROLE_REQUEST = `${pre}REMOVE_USER_ROLE_REQUEST`;

export const CLEAR_DATABASE_REQUEST = `${pre}CLEAR_DATABASE_REQUEST`;

export const ROLL_OVER_TO_NEXT_YEAR_REQUEST = `${pre}ROLL_OVER_TO_NEXT_YEAR_REQUEST`;

export const DELETE_ALL_OLD_USERS_REQUEST = `${pre}DELETE_ALL_OLD_USERS_REQUEST`;

export const FETCH_HIGHLIGHTS_FOR_APPROVAL_REQUEST = `${pre}FETCH_HIGHLIGHTS_FOR_APPROVAL_REQUEST`;
export const FETCH_HIGHLIGHTS_FOR_APPROVAL_SUCCESS = `${pre}FETCH_HIGHLIGHTS_FOR_APPROVAL_SUCCESS`;
export const ALREADY_FETCHED_HIGHLIGHTS_FOR_APPROVAL = `${pre}ALREADY_FETCHED_HIGHLIGHTS_FOR_APPROVAL`;

export const APPROVE_HIGHLIGHT_REQUEST = `${pre}APPROVE_HIGHLIGHT_REQUEST`;
export const APPROVE_HIGHLIGHT_SUCCESS = `${pre}APPROVE_HIGHLIGHT_SUCCESS`;

export const REJECT_HIGHLIGHT_REQUEST = `${pre}REJECT_HIGHLIGHT_REQUEST`;
export const REJECT_HIGHLIGHT_SUCCESS = `${pre}REJECT_HIGHLIGHT_SUCCESS`;

export const DELETE_HIGHLIGHT_REQUEST = `${pre}DELETE_HIGHLIGHT_REQUEST`;
export const DELETE_HIGHLIGHT_SUCCESS = `${pre}DELETE_HIGHLIGHT_SUCCESS`;

export const FETCH_ALL_REJECTED_HIGHLIGHTS_REQUEST = `${pre}FETCH_ALL_REJECTED_HIGHLIGHTS_REQUEST`;
export const FETCH_ALL_REJECTED_HIGHLIGHTS_SUCCESS = `${pre}FETCH_ALL_REJECTED_HIGHLIGHTS_SUCCESS`;
export const ALREADY_FETCHED_REJECTED_HIGHLIGHTS = `${pre}ALREADY_FETCHED_REJECTED_HIGHLIGHTS`;

export const REAPPROVE_REJECTED_HIGHLIGHT_REQUEST = `${pre}REAPPROVE_REJECTED_HIGHLIGHT_REQUEST`;
export const REAPPROVE_REJECTED_HIGHLIGHT_SUCCESS = `${pre}REAPPROVE_REJECTED_HIGHLIGHT_SUCCESS`;

export const SUBMIT_EXTRA_STATS_REQUEST = `${pre}SUBMIT_EXTRA_STATS_REQUEST`;
export const SUBMIT_EXTRA_STATS_SUCCESS = `${pre}SUBMIT_EXTRA_STATS_SUCCESS`;

export const SET_SUCCESS_MESSAGE = `${pre}SET_SUCCESS_MESSAGE`;
export const CLOSE_SUCCESS_MESSAGE = `${pre}CLOSE_SUCCESS_MESSAGE`;

export const SET_ADMIN_ERROR = `${pre}SET_ADMIN_ERROR`;
export const CLOSE_ADMIN_ERROR = `${pre}CLOSE_ADMIN_ERROR`;

export const SET_HAS_PAID_SUBS_REQUEST = `${pre}SET_HAS_PAID_SUBS_REQUEST`;
export const SET_HAS_PAID_SUBS_SUCCESS = `${pre}SET_HAS_PAID_SUBS_SUCCESS`;

export const setHasPaidSubsSuccess = changes => ({
    type: SET_HAS_PAID_SUBS_SUCCESS,
    changes
});

export const setHasPaidSubsRequest = changes => ({
    type: SET_HAS_PAID_SUBS_REQUEST,
    changes
});

export const setAdminError = (error, header) => ({
    type: SET_ADMIN_ERROR,
    error,
    header
});

export const closeAdminError = () => ({
    type: CLOSE_ADMIN_ERROR
});

export const setSuccessMessage = message => ({
    type: SET_SUCCESS_MESSAGE,
    message
});

export const closeSuccessMessage = () => ({
    type: CLOSE_SUCCESS_MESSAGE
});

export const submitExtraStatsRequest = (
    gameWeek, yellowCard, redCard, penaltySaved, penaltyMissed, ownGoal
) => ({
    type: SUBMIT_EXTRA_STATS_REQUEST,
    gameWeek,
    yellowCard,
    redCard,
    penaltySaved,
    penaltyMissed,
    ownGoal
});

export const submitExtraStatsSuccess = () => ({
    type: SUBMIT_EXTRA_STATS_SUCCESS
});

export const reapproveRejectedHighlightRequest = highlightId => ({
    type: REAPPROVE_REJECTED_HIGHLIGHT_REQUEST,
    highlightId
});

export const reapproveRejectedHighlightSuccess = highlight => ({
    type: REAPPROVE_REJECTED_HIGHLIGHT_SUCCESS,
    highlight
});

export const fetchAllRejectedHighlightsRequest = () => ({
    type: FETCH_ALL_REJECTED_HIGHLIGHTS_REQUEST
});

export const fetchAllRejectedHighlightsSuccess = highlights => ({
    type: FETCH_ALL_REJECTED_HIGHLIGHTS_SUCCESS,
    highlights
});

export const alreadyFetchedRejectedHighlights = () => ({
    type: ALREADY_FETCHED_REJECTED_HIGHLIGHTS
});

export const deleteHighlightRequest = (highlightId, reason) => ({
    type: DELETE_HIGHLIGHT_REQUEST,
    highlightId,
    reason
});

export const deleteHighlightSuccess = highlight => ({
    type: DELETE_HIGHLIGHT_SUCCESS,
    highlight
});

export const alreadyFetchedHighlightsForApproval = () => ({
    type: ALREADY_FETCHED_HIGHLIGHTS_FOR_APPROVAL
});

export const approveHighlightRequest = highlightId => ({
    type: APPROVE_HIGHLIGHT_REQUEST,
    highlightId
});

export const approveHighlightSuccess = highlight => ({
    type: APPROVE_HIGHLIGHT_SUCCESS,
    highlight
});

export const rejectHighlightRequest = (highlightId, reason) => ({
    type: REJECT_HIGHLIGHT_REQUEST,
    highlightId,
    reason
});

export const rejectHighlightSuccess = highlight => ({
    type: REJECT_HIGHLIGHT_SUCCESS,
    highlight
});

export const fetchHighlightsForApprovalSuccess = highlights => ({
    type: FETCH_HIGHLIGHTS_FOR_APPROVAL_SUCCESS,
    highlights
});

export const fetchHighlightsForApprovalRequest = () => ({
    type: FETCH_HIGHLIGHTS_FOR_APPROVAL_REQUEST
});

export const deleteAllOldUsersRequest = () => ({
    type: DELETE_ALL_OLD_USERS_REQUEST
});

export const rollOverToNextYearRequest = () => ({
    type: ROLL_OVER_TO_NEXT_YEAR_REQUEST
});

export const clearDatabaseRequest = () => ({
    type: CLEAR_DATABASE_REQUEST
});

export const alreadyFetchedUsersWithExtraRoles = () => ({
    type: ALREADY_FETCHED_USERS_WITH_EXTRA_ROLES
});

export const loadUsersWithExtraRoles = () => ({
    type: LOAD_USERS_WITH_EXTRA_ROLES
});

export const addUserRoleRequest = (email, role) => ({
    type: ADD_USER_ROLE_REQUEST,
    email,
    role
});

export const removeUserRoleRequest = (email, role) => ({
    type: REMOVE_USER_ROLE_REQUEST,
    email,
    role
});

export const fetchUsersWithExtraRolesRequest = () => ({
    type: FETCH_USERS_WITH_EXTRA_ROLES_REQUEST
});

export const fetchUsersWithExtraRolesSuccess = usersWithExtraRoles => ({
    type: FETCH_USERS_WITH_EXTRA_ROLES_SUCCESS,
    usersWithExtraRoles
});

// -------------------------------------------------------------------- \\

export const editPlayerStatsRequest = (playerId, week, difference) => ({
    type: EDIT_PLAYER_STATS_REQUEST,
    playerId,
    week,
    difference
});

export const editPlayerStatsSuccess = () => ({
    type: EDIT_PLAYER_STATS_SUCCESS
});

// -------------------------------------------------------------------- \\

export const fetchPlayerStatsRequest = (playerId, week) => ({
    type: FETCH_PLAYER_STATS_REQUEST,
    playerId,
    week
});

export const fetchPlayerStatsSuccess = playerStats => ({
    type: FETCH_PLAYER_STATS_SUCCESS,
    playerStats
});

// -------------------------------------------------------------------- \\

export const triggerWeekRequest = week => ({
    type: TRIGGER_WEEK_REQUEST,
    week
});

export const triggerWeekSuccess = () => ({
    type: TRIGGER_WEEK_SUCCESS
});

// -------------------------------------------------------------------- \\

export const fetchTeamsRequest = () => ({
    type: FETCH_TEAMS_REQUEST
});

export const fetchTeamsSuccess = teams => ({
    type: FETCH_TEAMS_SUCCESS,
    teams
});

// -------------------------------------------------------------------- \\

export const createPlayerRequest = (name, position, price, team, previousScore) => ({
    type: CREATE_PLAYER_REQUEST,
    name,
    position,
    price,
    team,
    previousScore
});

export const createPlayerSuccess = () => ({
    type: CREATE_PLAYER_SUCCESS
});

// -------------------------------------------------------------------- \\

export const createTeamRequest = teamName => ({
    type: CREATE_TEAM_REQUEST,
    teamName
});

export const createTeamSuccess = () => ({
    type: CREATE_TEAM_SUCCESS
});

// -------------------------------------------------------------------- \\

export const submitResultRequest = (teamId, goalsFor, goalsAgainst, week, players) => ({
    type: SUBMIT_RESULT_REQUEST,
    teamId,
    goalsFor,
    goalsAgainst,
    week,
    players
});

export const submitResultSuccess = () => ({
    type: SUBMIT_RESULT_SUCCESS
});

// -------------------------------------------------------------------- \\

export const fetchPlayersForTeamRequest = teamName => ({
    type: FETCH_PLAYERS_FOR_TEAM_REQUEST,
    teamName
});

export const fetchPlayersForTeamSuccess = (teamName, players) => ({
    type: FETCH_PLAYERS_FOR_TEAM_SUCCESS,
    teamName,
    players
});

// -------------------------------------------------------------------- \\

export const deletePlayerRequest = playerId => ({
    type: DELETE_PLAYER_REQUEST,
    playerId
});

export const deletePlayerSuccess = () => ({
    type: DELETE_PLAYER_SUCCESS
});

// -------------------------------------------------------------------- \\

export const deleteTeamRequest = (teamId, teamName) => ({
    type: DELETE_TEAM_REQUEST,
    teamId,
    teamName
});

export const deleteTeamSuccess = () => ({
    type: DELETE_TEAM_SUCCESS
});

// -------------------------------------------------------------------- \\
