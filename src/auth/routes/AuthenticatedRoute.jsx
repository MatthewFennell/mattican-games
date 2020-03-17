import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as constants from '../../constants';

const AuthenticatedRoute = ({
    component: Component, auth, loadedPermissions, ...rest
}) => {
    if (!auth.uid || !auth.emailVerified) {
        return <Redirect to={constants.URL.VERIFY_EMAIL} />;
    }
    if (!loadedPermissions) {
        return null;
    }
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
    loadedPermissions: false
};

AuthenticatedRoute.propTypes = {
    auth: PropTypes.PropTypes.shape({
        emailVerified: PropTypes.bool,
        uid: PropTypes.string
    }),
    component: PropTypes.elementType,
    loadedPermissions: PropTypes.bool
};

export default connect(mapStateToProps)(AuthenticatedRoute);

export { AuthenticatedRoute as AuthenticatedRouteUnconnected };
