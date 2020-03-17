
import React from 'react';
import { shallow } from '../../enzyme';
import Update from './Update';

describe('Profile - Update', () => {
    it('The Update component renders without crashing', () => {
        const wrapper = shallow(<Update />);
        expect(() => wrapper).not.toThrow();
    });
});
