import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _, { noop } from 'lodash';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import * as routes from '../../routes';
import defaultStyles from './TogglePages.module.scss';
import Switch from '../../common/Switch/Switch';
import { editDisabledPageRequest } from '../../auth/actions';

const getDisabledPages = appInfo => _.head(_.map(appInfo, value => (value.disabledPages)));

const TogglePages = props => (
    <div className={props.styles.togglePagesWrapper}>
        <div className={props.styles.headerMessage}>
            These are the active pages
        </div>

        <div className={props.styles.routesWrapper}>
            {routes.signedInLinks.map(route => (
                <div className={props.styles.optionWrapper} key={route.title}>
                    <div>
                        {route.title}
                    </div>
                    <Switch
                        color="primary"
                        checked={!props.disabledPages.includes(route.title)}
                        onChange={() => props.editDisabledPageRequest(route.title,
                            !props.disabledPages.includes(route.title))}
                        disabled={!route.canToggle}
                    />
                </div>
            ))}
        </div>
    </div>
);

TogglePages.defaultProps = {
    disabledPages: [],
    editDisabledPageRequest: noop,
    styles: defaultStyles
};

TogglePages.propTypes = {
    disabledPages: PropTypes.arrayOf(PropTypes.string),
    editDisabledPageRequest: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    editDisabledPageRequest
};

const mapStateToProps = state => ({
    disabledPages: getDisabledPages(state.firestore.data.appInfo)
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'application-info',
            storeAs: 'appInfo'
        }
    ]),
)(TogglePages);

export { TogglePages as TogglePagesUnconnected };
