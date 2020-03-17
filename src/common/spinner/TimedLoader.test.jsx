
import React from 'react';
import { shallow } from '../../enzyme';
import TimedLoader from './TimedLoader';

describe('Common - TimedLoader', () => {
    it('The TimedLoader component renders without crashing', () => {
        const wrapper = shallow(<TimedLoader />);
        expect(() => wrapper).not.toThrow();
    });
});
