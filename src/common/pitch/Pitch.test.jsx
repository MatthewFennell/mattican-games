
import React from 'react';
import { shallow } from '../../enzyme';
import Pitch from './Pitch';

describe('Common - Pitch', () => {
    it('The Pitch component renders without crashing', () => {
        const wrapper = shallow(<Pitch />);
        expect(() => wrapper).not.toThrow();
    });
});
