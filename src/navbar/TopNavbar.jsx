import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import * as constants from '../constants';
import defaultStyles from './TopNavbar.module.scss';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
        '&:focus': {
            background: 'none',
            outline: '0px'
        },
        '&:hover': {
            backgroundColor: '#5c6bc0'
        }
    },
    title: {
        flexGrow: 1
    },
    userProfile: {
        '&:focus': {
            backgroundColor: 'transparent',
            outline: '0px'
        },
        '&:hover': {
            backgroundColor: '#5c6bc0'
        }
    }
}));

const TopNavbar = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const redirectOnClick = useCallback(val => {
        setAnchorEl(null);
        props.redirect(val);
        // eslint-disable-next-line
    }, [props.redirect, setAnchorEl, anchorEl]);

    return (
        <AppBar
            className={props.styles.topNavbar}
        >
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.toggleNavbar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                        Collingwood Footy
                </Typography>
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        className={classes.userProfile}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={open}
                        onClose={handleClose}
                    >

                        {props.auth.uid ? (
                            <div>
                                <MenuItem onClick={() => redirectOnClick(
                                    constants.URL.PROFILE
                                )}
                                >
                                    My account
                                </MenuItem>
                                <MenuItem onClick={props.signOut}>Sign out</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <MenuItem onClick={() => redirectOnClick(constants.URL.SIGN_IN)}>
                                    Sign in
                                </MenuItem>
                                <MenuItem onClick={() => redirectOnClick(
                                    constants.URL.SIGN_UP
                                )}
                                >
                                    Sign up
                                </MenuItem>
                                <MenuItem onClick={() => redirectOnClick(
                                    constants.URL.RESET_PASSWORD
                                )}
                                >
                                    Forgot password?
                                </MenuItem>
                            </div>
                        )}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

TopNavbar.defaultProps = {
    auth: {},
    redirect: noop,
    signOut: noop,
    styles: defaultStyles,
    toggleNavbar: noop
};

TopNavbar.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string,
        emailVerified: PropTypes.bool
    }),
    redirect: PropTypes.func,
    signOut: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    toggleNavbar: PropTypes.func
};

export default TopNavbar;
