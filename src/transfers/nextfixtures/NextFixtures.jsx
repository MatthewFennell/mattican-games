import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import defaultStyles from './NextFixtures.module.scss';
import MatchRow from './MatchRow';
import * as helpers from '../../helperFunctions';
import Spinner from '../../common/spinner/Spinner';

const convertToDay = d => moment(d, 'DD-MM-YYYY')
    .format('ddd, MMMM Do YYYY');

const NextFixtures = props => {
    const uniqueTeams = helpers.uniqueCollegeTeamsFromFixtures(props.fixtures, 'Collingwood');
    const futureMatches = helpers.filterFixturesByTime(props.fixtures, true);
    const sortedByDateFixtures = helpers.sortMatchesByDate(futureMatches, false);

    const nextMatchPerTeam = uniqueTeams.map(x => sortedByDateFixtures
        .find(y => y.teamOne === x || y.teamTwo === x))
        .filter(x => x !== undefined); // Some teams have no matches left

    const removedDuplicates = _.uniqBy(nextMatchPerTeam, x => x.teamOne + x.teamTwo);
    const removedDuplicatedSorted = helpers.sortMatchesByDate(removedDuplicates, false);
    const daysOfYear = _.uniq(removedDuplicates.map(x => convertToDay(x.time)));

    return (
        <div className={props.styles.nextFixturesWrapper}>
            <div className={props.styles.headerMessage}>
                Upcoming Fixtures
            </div>
            {props.loadingFixtures
                ? (
                    <div className={props.styles.loadingUpcomingMatches}>
                        <Spinner color="secondary" />
                    </div>
                ) : daysOfYear.map(x => (
                    <div className={props.styles.datesWrapper} key={x}>
                        <div className={props.styles.dateHeader}>
                            {x}
                        </div>
                        <div className={props.styles.setOfMatchesWrapper}>
                            {removedDuplicatedSorted.filter(match => convertToDay(match.time) === x)
                                .map(match => (
                                    <MatchRow
                                        match={match}
                                        showCollegeCrest={props.showCollegeCrest}
                                        key={`${match.teamOne}-${match.teamTwo}`}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};

NextFixtures.defaultProps = {
    fixtures: [],
    loadingFixtures: false,
    showCollegeCrest: false,
    styles: defaultStyles
};

NextFixtures.propTypes = {
    fixtures: PropTypes.arrayOf(PropTypes.shape({
        teamOne: PropTypes.string,
        result: PropTypes.string,
        teamTwo: PropTypes.string,
        location: PropTypes.string,
        time: PropTypes.string,
        completed: PropTypes.bool,
        league: PropTypes.string
    })),
    loadingFixtures: PropTypes.bool,
    showCollegeCrest: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default NextFixtures;
