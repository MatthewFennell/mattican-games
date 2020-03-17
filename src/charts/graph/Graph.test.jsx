
import React from 'react';
import { shallow } from '../../enzyme';
import Graph from './Graph';

describe('Charts - Graph', () => {
    it('The Graph component renders without crashing', () => {
        const wrapper = shallow(<Graph />);
        expect(() => wrapper).not.toThrow();
    });
});
