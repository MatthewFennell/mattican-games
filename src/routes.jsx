import React from 'react';

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import ManageUsers from './admin/manageusers/ManageUsers';
import * as rootComponents from './rootComponents';
import * as constants from './constants';

export const adminLinks = [
    {
        title: 'Manage Users',
        icon: <SupervisorAccountIcon color="primary" />,
        component: ManageUsers,
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
        renderPath: `${constants.URL.OVERVIEW}`,
        urlIncludes: constants.URL.OVERVIEW,
        canToggle: false,
        showInSideBar: true
    },
    {
        title: 'Game',
        icon: <HomeIcon color="primary" />,
        component: rootComponents.Game,
        addUserId: false,
        path: () => `${constants.URL.GAME}`,
        renderPath: `${constants.URL.GAME}`,
        urlIncludes: constants.URL.GAME,
        showInSideBar: false
    }
];
