
import React from 'react';
import { shallow } from '../../enzyme';
import YouTubeItemOpen from './YouTubeItemOpen';

describe('Common - YouTubeItemOpen', () => {
    it('The YouTubeItemOpen component renders without crashing', () => {
        const wrapper = shallow(<YouTubeItemOpen />);
        expect(() => wrapper).not.toThrow();
    });
});
