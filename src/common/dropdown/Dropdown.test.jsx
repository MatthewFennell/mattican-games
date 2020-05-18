
import React from 'react';
import { shallow } from '../../enzyme';
import Dropdown from './Dropdown';

describe('Common - Dropdown', () => {
    it('The Dropdown component renders without crashing', () => {
        const wrapper = shallow(<Dropdown />);
        expect(() => wrapper).not.toThrow();
    });
});
