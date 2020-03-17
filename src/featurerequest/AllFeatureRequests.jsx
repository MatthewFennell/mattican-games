import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './AllFeatureRequests.module.scss';
import FeatureRequest from '../common/featurerequest/FeatureRequest';
import WithCollapsable from '../common/collapsableHOC/WithCollapsable';
import * as helpers from './helpers';
import StyledButton from '../common/StyledButton/StyledButton';
import TextInput from '../common/TextInput/TextInput';
import * as textInputConstants from '../common/TextInput/constants';
import Dropdown from '../common/dropdown/Dropdown';
import mobileStyles from './MobileWrapperStyles.module.scss';

const AllFeatureRequests = props => {
    const [filterBy, setFilterBy] = useState('allTime');
    const [sortBy, setSortBy] = useState('newestFirst');
    const [searchFilter, setSearchFilter] = useState('');

    const generateFilteredFeatures = useCallback(() => helpers
        .sortVideos(filterBy, sortBy, props.featureRequests, searchFilter),
    [filterBy, sortBy, searchFilter, props.featureRequests]);

    const Feature = WithCollapsable(FeatureRequest);

    return (
        <div className={props.styles.allFeatureRequests}>
            <div className={props.styles.featureRequestHeader}>
                <div className={props.styles.infoWrapper}>
                    <div className={props.styles.featureRequestMessage}>
                    Feature Requests
                    </div>
                    <div className={props.styles.openSubmitVideo}>
                        <StyledButton
                            onClick={() => props.setSubmitFeatureRequestOpen(true)}
                            text="Submit a Feature"
                            color="primary"
                        />
                    </div>
                    <div className={props.styles.searchFilter}>
                        <TextInput
                            label="Search features by author"
                            onChange={setSearchFilter}
                            value={searchFilter}
                            icon={textInputConstants.textInputIcons.user}
                            iconColor="primary"
                        />
                    </div>
                </div>
                <div className={props.styles.sortByWrapper}>
                    <Dropdown
                        title="Filter By Date"
                        key="Filter By Date"
                        onChange={setFilterBy}
                        options={Object.values(helpers.dateFilters).map(x => ({
                            text: x.label,
                            id: x.id,
                            value: x.id
                        }))}
                        value={filterBy}
                    />
                    <Dropdown
                        title="Sort By"
                        key="Sort By"
                        onChange={setSortBy}
                        options={Object.values(helpers.sortByFilters)
                            .map(x => ({
                                text: x.label,
                                id: x.id,
                                value: x.id
                            }))}
                        value={sortBy}
                    />
                </div>
            </div>
            <div className={props.styles.featuresWrapper}>
                {generateFilteredFeatures().map(x => (
                    <div className={props.styles.featureWrapper} key={x.id}>
                        <Feature
                            addNewComment={props.addNewComment(x.id)}
                            addNewReply={props.addNewReply(x.id)}
                            deleteComment={props.deleteComment(x.id)}
                            deleteReply={props.deleteReply(x.id)}
                            details={x}
                            showAuthor
                            id={x.id}
                            isOpen={props.featuresOpen.includes(x.id)}
                            title={`Feature Request by ${x.displayName}`}
                            toggle={props.toggleFeature}
                            loggedInUserId={props.loggedInUserId}
                            styles={mobileStyles}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

AllFeatureRequests.defaultProps = {
    addNewComment: noop,
    addNewReply: noop,
    deleteComment: noop,
    deleteReply: noop,
    featureRequests: [],
    featuresOpen: [],
    setSubmitFeatureRequestOpen: noop,
    styles: defaultStyles,
    toggleFeature: noop,
    loggedInUserId: ''
};

AllFeatureRequests.propTypes = {
    addNewComment: PropTypes.func,
    addNewReply: PropTypes.func,
    deleteComment: PropTypes.func,
    deleteReply: PropTypes.func,
    featureRequests: PropTypes.arrayOf(PropTypes.shape({
        description: PropTypes.string,
        id: PropTypes.string,
        userId: PropTypes.string
    })),
    featuresOpen: PropTypes.arrayOf(PropTypes.string),
    setSubmitFeatureRequestOpen: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    toggleFeature: PropTypes.func,
    loggedInUserId: PropTypes.string
};

export default AllFeatureRequests;
