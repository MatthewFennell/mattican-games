import React, { Suspense } from 'react';

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import ManageUsers from './admin/manageusers/ManageUsers';
import * as rootComponents from './rootComponents';
import * as constants from './constants';
import Spinner from './common/spinner/Spinner';

import ErrorBoundary from './errorboundary/ErrorBoundary';

const generateLazyComponent = (Component, moduleName) => () => (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '30px' }}><Spinner /></div>}>
        <ErrorBoundary moduleName={moduleName}>
            <Component />
        </ErrorBoundary>
    </Suspense>
);

export const adminLinks = [
    {
        title: 'Manage Users',
        icon: <SupervisorAccountIcon color="primary" />,
        component: generateLazyComponent(ManageUsers, 'Manage Users'),
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
        component: generateLazyComponent(rootComponents.SignIn, 'Sign In'),
        path: () => constants.URL.SIGN_IN,
        urlIncludes: constants.URL.SIGN_IN,
        showInSideBar: true
    },
    {
        title: 'Sign Up',
        icon: <AccountBoxIcon color="primary" />,
        component: generateLazyComponent(rootComponents.SignUp, 'Sign Up'),
        path: () => constants.URL.SIGN_UP,
        urlIncludes: constants.URL.SIGN_UP,
        showInSideBar: true
    }
];

export const signedInLinks = [
    {
        title: 'Overview',
        icon: <HomeIcon color="primary" />,
        component: generateLazyComponent(rootComponents.Overview, 'Overview'),
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
        component: generateLazyComponent(rootComponents.Game, 'Game'),
        addUserId: false,
        path: () => `${constants.URL.GAME}`,
        renderPath: `${constants.URL.GAME}`,
        urlIncludes: constants.URL.GAME,
        showInSideBar: false
    }
];
