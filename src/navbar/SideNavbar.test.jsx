
import React from 'react';
import { shallow } from '../enzyme';
import SideNavbar from './SideNavbar';

describe('Navbar - SideNavbar', () => {
    it('The SideNavbar component renders without crashing', () => {
        const wrapper = shallow(<SideNavbar />);
        expect(() => wrapper).not.toThrow();
    });
});
