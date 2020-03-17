import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as constants from '../../constants';

const AdminRoute = ({
    component: Component, auth, permissionRequired, userPermissions, loadedPermissions,
    ...rest
}) => {
    if (!loadedPermissions && (auth.uid && auth.emailVerified)) {
        return null;
    }
    return (
        <Route
            {...rest}
            render={props => (auth.uid && auth.emailVerified
                && userPermissions.includes(permissionRequired)
                ? <Component {...props} /> : <Redirect to={constants.URL.OVERVIEW} />)}
        />
    );
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    loadedPermissions: state.auth.loadedPermissions,
    userPermissions: state.auth.userPermissions
});

AdminRoute.defaultProps = {
    component: {},
    auth: {},
    loadedPermissions: false,
    permissionRequired: '',
    userPermissions: []
};

AdminRoute.propTypes = {
    component: PropTypes.elementType,
    auth: PropTypes.PropTypes.shape({
        emailVerified: PropTypes.bool,
        uid: PropTypes.string
    }),
    loadedPermissions: PropTypes.bool,
    permissionRequired: PropTypes.string,
    userPermissions: PropTypes.arrayOf(PropTypes.string)
};

export default connect(mapStateToProps)(AdminRoute);

export { AdminRoute as AdminRouteUnconnected };
