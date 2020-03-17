
import React from 'react';
import { shallow } from '../../enzyme';
import Checkbox from './Checkbox';

describe('Common - Checkbox', () => {
    it('The Checkbox component renders without crashing', () => {
        const wrapper = shallow(<Checkbox />);
        expect(() => wrapper).not.toThrow();
    });
});
