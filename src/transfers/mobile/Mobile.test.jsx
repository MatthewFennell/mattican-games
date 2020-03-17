
import React from 'react';
import { shallow } from '../../enzyme';
import Mobile from './Mobile';

describe('Transfers - Mobile', () => {
    it('The Mobile component renders without crashing', () => {
        const wrapper = shallow(<Mobile />);
        expect(() => wrapper).not.toThrow();
    });
});
