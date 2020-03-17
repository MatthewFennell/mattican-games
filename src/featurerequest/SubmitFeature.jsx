import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import defaultStyles from './SubmitFeature.module.scss';
import StyledButton from '../common/StyledButton/StyledButton';

const maxLength = 256;
const charactersLeft = description => `${maxLength - (description.length || 0)} characters left`;

const SubmitFeature = props => (
    <SwipeableDrawer
        anchor="right"
        open={props.submitFeatureOpen}
        onClose={props.closeSubmitFeature}
        onOpen={noop}
    >
        <div className={props.styles.featureRequestWrapper}>
            <div className={props.styles.header}>
            Enter a description of the feature you would like to see added to the site
            </div>
            <textarea
                value={props.description}
                onChange={props.updateDescription}
            />
            <div className={props.styles.charactersRemaining}>
                {charactersLeft(props.description)}
            </div>

            <StyledButton
                onClick={props.submitRequest}
                color="primary"
                text="Submit feature request"
                disabled={!props.description}
            />
        </div>
    </SwipeableDrawer>
);

SubmitFeature.defaultProps = {
    closeSubmitFeature: noop,
    description: '',
    styles: defaultStyles,
    submitFeatureOpen: false,
    submitRequest: noop,
    updateDescription: noop
};

SubmitFeature.propTypes = {
    closeSubmitFeature: PropTypes.func,
    description: PropTypes.string,
    submitFeatureOpen: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string),
    submitRequest: PropTypes.func,
    updateDescription: PropTypes.func
};

export default SubmitFeature;
