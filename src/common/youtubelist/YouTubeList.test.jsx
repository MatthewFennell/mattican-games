
import React from 'react';
import { shallow } from '../../enzyme';
import YouTubeList from './YouTubeList';

describe('Common - YouTubeList', () => {
    it('The YouTubeList component renders without crashing', () => {
        const wrapper = shallow(<YouTubeList />);
        expect(() => wrapper).not.toThrow();
    });
});
