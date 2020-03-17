
import React from 'react';
import { shallow } from '../../enzyme';
import PointsTable from './PointsTable';

describe('Points - PointsTable', () => {
    it('The PointsTable component renders without crashing', () => {
        const wrapper = shallow(<PointsTable />);
        expect(() => wrapper).not.toThrow();
    });
});
