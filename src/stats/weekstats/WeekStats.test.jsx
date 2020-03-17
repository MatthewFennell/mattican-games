
import React from 'react';
import { shallow } from '../../enzyme';
import WeekStats from './WeekStats';

describe('Stats - WeekStats', () => {
    it('The WeekStats component renders without crashing', () => {
        const wrapper = shallow(<WeekStats />);
        expect(() => wrapper).not.toThrow();
    });
});
