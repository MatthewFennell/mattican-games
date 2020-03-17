
import React from 'react';
import { shallow } from '../../enzyme';
import LeagueTable from './LeagueTable';

describe('Charts - LeagueTable', () => {
    it('The LeagueTable component renders without crashing', () => {
        const wrapper = shallow(<LeagueTable />);
        expect(() => wrapper).not.toThrow();
    });
});
