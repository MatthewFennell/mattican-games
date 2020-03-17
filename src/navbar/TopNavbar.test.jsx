
import React from 'react';
import { shallow } from '../enzyme';
import TopNavbar from './TopNavbar';

describe('Navbar - TopNavbar', () => {
    it('The TopNavbar component renders without crashing', () => {
        const wrapper = shallow(<TopNavbar />);
        expect(() => wrapper).not.toThrow();
    });
});
