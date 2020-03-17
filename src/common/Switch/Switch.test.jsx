
import React from 'react';
import { shallow } from '../../enzyme';
import Switch from './Switch';

describe('Common - Switch', () => {
    it('The Switch component renders without crashing', () => {
        const wrapper = shallow(<Switch />);
        expect(() => wrapper).not.toThrow();
    });
});
