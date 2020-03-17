import _ from 'lodash';

export const filterPlayers = (allPlayers, team, havePaid, name) => {
    const teamFilter = team === 'All' ? () => true : x => x.team === team;
    let havePaidFilter = () => true;
    if (havePaid === 'paid') {
        havePaidFilter = x => x.hasPaidSubs;
    } else if (havePaid === 'notPaid') {
        havePaidFilter = x => !x.hasPaidSubs;
    }
    const nameFilter = x => x.name.includes(name);

    return allPlayers
        .filter(teamFilter)
        .filter(havePaidFilter)
        .filter(nameFilter);
};

export const generateTeams = allPlayers => [{
    value: 'All',
    text: 'All teams',
    id: 'All'
}].concat(_.uniq(_.map(allPlayers, 'team')).map(team => ({
    value: team,
    text: team,
    id: team
})));
