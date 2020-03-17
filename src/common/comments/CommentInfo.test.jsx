
import React from 'react';
import { shallow } from '../../enzyme';
import CommentInfo from './CommentInfo';

describe('Common - CommentInfo', () => {
    it('The CommentInfo component renders without crashing', () => {
        const wrapper = shallow(<CommentInfo />);
        expect(() => wrapper).not.toThrow();
    });
});
