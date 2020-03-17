
import React from 'react';
import { shallow } from '../../enzyme';
import LinearSpinner from './LinearSpinner';

describe('Common - LinearSpinner', () => {
    it('The LinearSpinner component renders without crashing', () => {
        const wrapper = shallow(<LinearSpinner />);
        expect(() => wrapper).not.toThrow();
    });
});
