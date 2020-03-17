import React from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';
import defaultStyles from './WeekStats.module.scss';
import Spinner from '../../common/spinner/Spinner';

const WeekStats = props => {
    const renderList = (key, title, stats) => (stats.filter(stat => stat[key]).length ? (
        <div key={key}>
            <div className={props.styles.statTitle}>
                {title}
            </div>
            {fp.orderBy(key, 'desc')(stats).filter(stat => stat[key]).map(stat => (
                <div className={props.styles.stat} key={`${key}-${stat.name}`}>
                    {stat.name + (stat[key] > 1 ? ` (${stat[key]})` : '')}
                </div>
            ))}
        </div>
    ) : null);

    return (
        props.loading
            ? (
                <div className={props.styles.spinnerWrapper}>
                    <Spinner color="primary" />
                </div>
            ) : (
                <div className={props.styles.weekStatsWrapper}>
                    <div className={props.styles.weekStatsHeader}>
                        {props.title}
                    </div>
                    <div className={props.styles.statsWrapper}>
                        {props.activeColumns.map(x => renderList(x.id, x.label, props.stats))}
                    </div>
                </div>
            )
    );
};

WeekStats.defaultProps = {
    activeColumns: [],
    loading: false,
    stats: [],
    styles: defaultStyles,
    title: ''
};

WeekStats.propTypes = {
    activeColumns: PropTypes.arrayOf(PropTypes.shape({})),
    loading: PropTypes.bool,
    stats: PropTypes.arrayOf(PropTypes.shape({})),
    styles: PropTypes.objectOf(PropTypes.string),
    title: PropTypes.string
};

export default WeekStats;
