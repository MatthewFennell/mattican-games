import fp from 'lodash/fp';

export const getCurrentMinWeek = props => parseInt(fp.flow(fp.get('match'), fp.get('params'), fp.get('minWeek'))(props), 10);
export const getCurrentMaxWeek = props => parseInt(fp.flow(fp.get('match'), fp.get('params'), fp.get('maxWeek'))(props), 10);
export const getCurrentTeam = props => fp.flow(fp.get('match'), fp.get('params'), fp.get('teamId'))(props);

export const getProperty = (state, props, property) => fp.flow(
    fp.get(getCurrentTeam(props)),
    fp.get(property)
)(state.stats.teamStatsByWeek);
