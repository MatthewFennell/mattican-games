import React from 'react';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import GradeIcon from '@material-ui/icons/Grade';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteIcon from '@material-ui/icons/Delete';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import EditIcon from '@material-ui/icons/Edit';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import WavesIcon from '@material-ui/icons/Waves';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import DehazeIcon from '@material-ui/icons/Dehaze';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import fp from 'lodash/fp';
import * as adminComponents from './adminComponents';
import * as rootComponents from './rootComponents';
import * as constants from './constants';

export const adminLinks = [
    {
        title: 'Create Player',
        icon: <PersonAddIcon color="primary" />,
        component: adminComponents.CreatePlayer,
        path: () => constants.URL.CREATE_PLAYER,
        urlIncludes: constants.URL.CREATE_PLAYER,
        permissionRequired: constants.PERMISSIONS.CREATE_PLAYER
    },
    {
        title: 'Delete Player',
        icon: <DeleteIcon color="primary" />,
        component: adminComponents.DeletePlayer,
        path: () => constants.URL.DELETE_PLAYER,
        urlIncludes: constants.URL.DELETE_PLAYER,
        permissionRequired: constants.PERMISSIONS.DELETE_PLAYER
    },
    {
        title: 'Create Team',
        icon: <PersonAddIcon color="primary" />,
        component: adminComponents.CreateTeam,
        path: () => constants.URL.CREATE_TEAM,
        urlIncludes: constants.URL.CREATE_TEAM,
        permissionRequired: constants.PERMISSIONS.CREATE_TEAM
    },
    {
        title: 'Delete Team',
        icon: <DeleteIcon color="primary" />,
        component: adminComponents.DeleteTeam,
        path: () => constants.URL.DELETE_TEAM,
        urlIncludes: constants.URL.DELETE_TEAM,
        permissionRequired: constants.PERMISSIONS.DELETE_TEAM
    },
    {
        title: 'Submit Result',
        icon: <PersonAddIcon color="primary" />,
        component: adminComponents.SubmitResult,
        path: () => constants.URL.SUBMIT_RESULT,
        urlIncludes: constants.URL.SUBMIT_RESULT,
        permissionRequired: constants.PERMISSIONS.SUBMIT_RESULT
    },
    {
        title: 'Trigger Week',
        icon: <WhatshotIcon color="primary" />,
        component: adminComponents.TriggerWeek,
        path: () => constants.URL.TRIGGER_WEEK,
        urlIncludes: constants.URL.TRIGGER_WEEK,
        permissionRequired: constants.PERMISSIONS.TRIGGER_WEEK
    },
    {
        title: 'Edit Player',
        icon: <EditIcon color="primary" />,
        component: adminComponents.EditPlayer,
        path: () => constants.URL.EDIT_PLAYER,
        urlIncludes: constants.URL.EDIT_PLAYER,
        permissionRequired: constants.PERMISSIONS.EDIT_PLAYER
    },
    {
        title: 'Approve Highlights',
        icon: <VideoLabelIcon color="primary" />,
        component: adminComponents.ApproveHighlights,
        addUserId: false,
        path: () => constants.URL.APPROVE_HIGHLIGHTS,
        urlIncludes: constants.URL.APPROVE_HIGHLIGHTS,
        permissionRequired: constants.PERMISSIONS.APPROVE_HIGHLIGHTS
    },
    {
        title: 'Manage Subs',
        icon: <AttachMoneyIcon color="primary" />,
        component: adminComponents.ManageSubs,
        addUserId: false,
        path: () => constants.URL.MANAGE_SUBS,
        urlIncludes: constants.URL.MANAGE_SUBS,
        permissionRequired: constants.PERMISSIONS.MANAGE_SUBS
    },
    {
        title: 'Toggle Pages',
        icon: <SupervisorAccountIcon color="primary" />,
        component: adminComponents.TogglePages,
        addUserId: false,
        path: () => constants.URL.TOGGLE_PAGES,
        urlIncludes: constants.URL.TOGGLE_PAGES,
        permissionRequired: constants.PERMISSIONS.TOGGLE_PAGES
    },
    {
        title: 'Manage Users',
        icon: <SupervisorAccountIcon color="primary" />,
        component: adminComponents.ManageUsers,
        addUserId: false,
        path: () => constants.URL.MANAGE_USERS,
        urlIncludes: constants.URL.MANAGE_USERS,
        permissionRequired: constants.PERMISSIONS.MANAGE_USERS
    }
];

export const signedOutLinks = [
    {
        title: 'Sign In',
        icon: <DoubleArrowIcon color="primary" />,
        component: rootComponents.SignIn,
        path: () => constants.URL.SIGN_IN,
        urlIncludes: constants.URL.SIGN_IN
    },
    {
        title: 'Sign Up',
        icon: <AccountBoxIcon color="primary" />,
        component: rootComponents.SignUp,
        path: () => constants.URL.SIGN_UP,
        urlIncludes: constants.URL.SIGN_UP
    }
];

export const signedInLinks = [
    {
        title: 'Overview',
        icon: <HomeIcon color="primary" />,
        component: rootComponents.Overview,
        addUserId: false,
        path: () => `${constants.URL.OVERVIEW}`,
        renderPath: `${constants.URL.OVERVIEW}/:userId/:week`,
        urlIncludes: constants.URL.OVERVIEW,
        canToggle: false
    },
    {
        title: 'Current Team',
        icon: <PeopleAltIcon color="primary" />,
        component: rootComponents.CurrentTeam,
        addUserId: true,
        path: props => `${constants.URL.CURRENT_TEAM}/${fp.get('userId')(props)}`,
        renderPath: `${constants.URL.CURRENT_TEAM}/:userId`,
        urlIncludes: constants.URL.CURRENT_TEAM,
        canToggle: true
    },
    {
        title: 'Points',
        icon: <GradeIcon color="primary" />,
        component: rootComponents.Points,
        addUserId: false,
        path: props => `${constants.URL.POINTS}/${fp.get('userId')(props)}/${fp.get('maxGameWeek')(props)}`,
        renderPath: `${constants.URL.POINTS}/:userId/:week`,
        urlIncludes: constants.URL.POINTS,
        canToggle: true
    },
    {
        title: 'Leagues',
        icon: <LayersIcon color="primary" />,
        component: rootComponents.Leagues,
        addUserId: false,
        path: () => constants.URL.LEAGUES,
        renderPath: constants.URL.LEAGUES,
        urlIncludes: constants.URL.LEAGUES,
        canToggle: true
    },
    {
        title: 'Transfers',
        icon: <TransferWithinAStationIcon color="primary" />,
        component: rootComponents.Transfers,
        addUserId: false,
        path: () => constants.URL.TRANSFERS,
        renderPath: constants.URL.TRANSFERS,
        urlIncludes: constants.URL.TRANSFERS,
        canToggle: true
    },
    {
        title: 'Stats',
        icon: <WavesIcon color="primary" />,
        component: rootComponents.Stats,
        addUserId: false,
        path: props => `${constants.URL.STATS}/none/${fp.get('maxGameWeek')(props)}/${fp.get('maxGameWeek')(props)}`,
        renderPath: `${constants.URL.STATS}/:teamId/:minWeek/:maxWeek`,
        urlIncludes: constants.URL.STATS,
        canToggle: true
    },
    {
        title: 'Charts',
        icon: <EqualizerIcon color="primary" />,
        component: rootComponents.Charts,
        addUserId: false,
        path: () => constants.URL.CHARTS,
        renderPath: constants.URL.CHARTS,
        urlIncludes: constants.URL.CHARTS,
        canToggle: true
    },
    {
        title: 'Highlights',
        icon: <VideoLibraryIcon color="primary" />,
        component: rootComponents.Highlights,
        addUserId: false,
        path: () => constants.URL.HIGHLIGHTS,
        renderPath: constants.URL.HIGHLIGHTS,
        urlIncludes: constants.URL.HIGHLIGHTS,
        canToggle: true
    },
    {
        title: 'Fixtures',
        icon: <DehazeIcon color="primary" />,
        component: rootComponents.Fixtures,
        addUserId: false,
        path: () => constants.URL.FIXTURES,
        renderPath: constants.URL.FIXTURES,
        urlIncludes: constants.URL.FIXTURES,
        canToggle: true
    },
    {
        title: 'Feature Request',
        icon: <QuestionAnswerIcon color="primary" />,
        component: rootComponents.FeatureRequest,
        addUserId: false,
        path: () => constants.URL.FEATURE_REQUEST,
        renderPath: constants.URL.FEATURE_REQUEST,
        urlIncludes: constants.URL.FEATURE_REQUEST,
        canToggle: true
    }
];
