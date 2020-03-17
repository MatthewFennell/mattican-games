import React from 'react';
import PropTypes from 'prop-types';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import * as constants from '../../constants';
import Grid from '../../common/grid/Grid';

const columns = allRoles => [{
    id: 'permission',
    label: '',
    align: 'center'
}].concat(allRoles.map(role => ({
    id: role,
    label: role,
    align: 'center'
})));

const generateRows = permissions => {
    const generateRow = permission => {
        const rowToReturn = {
            id: permission,
            permission
        };
        Object.keys(permissions).forEach(p => {
            if (permissions[p].includes(permission)) {
                rowToReturn[p] = <FiberManualRecordIcon color="primary" />;
            }
        });
        return rowToReturn;
    };
    return Object.keys(constants.PERMISSIONS).map(permission => generateRow(permission));
};

const RolesToPermissions = props => (
    <Grid
        columns={columns(props.allRoles)}
        gridHeader="Rules"
        rows={generateRows(props.permissionMappings)}
        rowsPerPageOptions={[25]}
    />
);

RolesToPermissions.defaultProps = {
    allRoles: [],
    permissionMappings: {}
};

RolesToPermissions.propTypes = {
    allRoles: PropTypes.arrayOf(PropTypes.string),
    permissionMappings: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
};

export default RolesToPermissions;
