
import React from 'react';
import { shallow } from '../../enzyme';
import Menu from './Menu';

describe('Common - Menu', () => {
    it('The Menu component renders without crashing', () => {
        const wrapper = shallow(<Menu />);
        expect(() => wrapper).not.toThrow();
    });
});
