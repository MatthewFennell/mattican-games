import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as constants from '../../constants';

const AuthenticatedRoute = ({
    component: Component, auth, loadedPermissions, gameId, ...rest
}) => {
    if (!auth.uid) {
        return <Redirect to={constants.URL.SIGN_IN} />;
    }
    if (!loadedPermissions) {
        return null;
    }
    // if (gameId) {
    //     return <Redirect to={`${constants.URL.GAME}/${gameId}`} />;
    // }
    return (
        <Route
            {...rest}
            render={props => <Component {...props} />}
        />
    );
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    loadedPermissions: state.auth.loadedPermissions
});

AuthenticatedRoute.defaultProps = {
    auth: {},
    component: {},
    gameId: null,
    loadedPermissions: false
};

AuthenticatedRoute.propTypes = {
    auth: PropTypes.PropTypes.shape({
        emailVerified: PropTypes.bool,
        uid: PropTypes.string
    }),
    component: PropTypes.elementType,
    gameId: PropTypes.string,
    loadedPermissions: PropTypes.bool
};

export default connect(mapStateToProps)(AuthenticatedRoute);

export { AuthenticatedRoute as AuthenticatedRouteUnconnected };
