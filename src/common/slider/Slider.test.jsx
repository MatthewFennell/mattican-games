
import React from 'react';
import { shallow } from '../../enzyme';
import Slider from './Slider';

describe('Common - Slider', () => {
    it('The Slider component renders without crashing', () => {
        const wrapper = shallow(<Slider />);
        expect(() => wrapper).not.toThrow();
    });
});
