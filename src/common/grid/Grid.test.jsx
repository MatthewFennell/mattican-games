
import React from 'react';
import { shallow } from '../../enzyme';
import Grid from './Grid';

describe('Common - Grid', () => {
    it('The Grid component renders without crashing', () => {
        const wrapper = shallow(<Grid />);
        expect(() => wrapper).not.toThrow();
    });
});
