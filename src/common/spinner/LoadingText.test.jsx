
import React from 'react';
import { shallow } from '../../enzyme';
import LoadingText from './LoadingText';

describe('Common - LoadingText', () => {
    it('The LoadingText component renders without crashing', () => {
        const wrapper = shallow(<LoadingText />);
        expect(() => wrapper).not.toThrow();
    });
});
