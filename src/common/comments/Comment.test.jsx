
import React from 'react';
import { shallow } from '../../enzyme';
import Comment from './Comment';

describe('Common - Comment', () => {
    it('The Comment component renders without crashing', () => {
        const wrapper = shallow(<Comment />);
        expect(() => wrapper).not.toThrow();
    });
});
