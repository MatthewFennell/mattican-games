
import React from 'react';
import { shallow } from '../../enzyme';
import Comments from './Comments';

describe('Common - Comments', () => {
    it('The Comments component renders without crashing', () => {
        const wrapper = shallow(<Comments />);
        expect(() => wrapper).not.toThrow();
    });
});
