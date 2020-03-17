import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import SideList from './SideList';

const SideNavbar = props => (
    <SwipeableDrawer
        open={props.isOpen}
        onClose={props.closeNavbar}
        onOpen={props.closeNavbar}
    >
        <SideList
            currentPath={props.currentPath}
            redirect={props.redirect}
            isSignedIn={props.isSignedIn}
            maxGameWeek={props.maxGameWeek}
            userId={props.userId}
            userPermissions={props.userPermissions}
        />
    </SwipeableDrawer>
);

SideNavbar.defaultProps = {
    closeNavbar: noop,
    currentPath: '',
    isOpen: false,
    isSignedIn: false,
    maxGameWeek: null,
    redirect: noop,
    userId: '',
    userPermissions: []
};

SideNavbar.propTypes = {
    closeNavbar: PropTypes.func,
    currentPath: PropTypes.string,
    isOpen: PropTypes.bool,
    isSignedIn: PropTypes.bool,
    maxGameWeek: PropTypes.number,
    redirect: PropTypes.func,
    userId: PropTypes.string,
    userPermissions: PropTypes.arrayOf(PropTypes.string)
};

export default SideNavbar;
