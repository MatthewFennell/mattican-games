
import React from 'react';
import { shallow } from '../../enzyme';
import YouTube from './YouTube';

describe('Common - YouTube', () => {
    it('The YouTube component renders without crashing', () => {
        const wrapper = shallow(<YouTube />);
        expect(() => wrapper).not.toThrow();
    });
});
