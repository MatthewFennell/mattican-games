
import React from 'react';
import { shallow } from '../../enzyme';
import YouTubeItemClosed from './YouTubeItemClosed';

describe('Common - YouTubeItemClosed', () => {
    it('The YouTubeItemClosed component renders without crashing', () => {
        const wrapper = shallow(<YouTubeItemClosed />);
        expect(() => wrapper).not.toThrow();
    });
});
