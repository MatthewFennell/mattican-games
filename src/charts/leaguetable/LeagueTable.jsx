import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './LeagueTable.module.scss';
import Grid from '../../common/grid/Grid';
import * as helpers from '../helpers';

const LeagueTable = props => {
    const leagueTable = useCallback(() => helpers.generateNewTable(props.fixtures),
        [props.fixtures]);
    return (
        <div className={props.styles.leagueTableWrapper}>
            <Grid
                columns={helpers.columns}
                gridHeader="League Table"
                loading={props.loadingFixtures}
                maxHeightGrid
                rows={leagueTable()}
                rowsPerPageOptions={[20]}
                showPagination={false}
            />
        </div>
    );
};

LeagueTable.defaultProps = {
    fixtures: [],
    loadingFixtures: false,
    styles: defaultStyles
};

LeagueTable.propTypes = {
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
    styles: PropTypes.objectOf(PropTypes.string)
};

export default LeagueTable;
