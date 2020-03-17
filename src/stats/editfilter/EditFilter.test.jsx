
import React from 'react';
import { shallow } from '../../enzyme';
import EditFilter from './EditFilter';

describe('Stats - EditFilter', () => {
    it('The EditFilter component renders without crashing', () => {
        const wrapper = shallow(<EditFilter />);
        expect(() => wrapper).not.toThrow();
    });
});
