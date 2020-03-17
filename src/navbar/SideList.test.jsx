
import React from 'react';
import { shallow } from '../enzyme';
import SideList from './SideList';

describe('Navbar - SideList', () => {
    it('The SideList component renders without crashing', () => {
        const wrapper = shallow(<SideList />);
        expect(() => wrapper).not.toThrow();
    });
});
