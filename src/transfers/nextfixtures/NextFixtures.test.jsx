
import React from 'react';
import { shallow } from '../../enzyme';
import NextFixtures from './NextFixtures';

describe('NextFixtures - NextFixtures', () => {
    it('The NextFixtures component renders without crashing', () => {
        const wrapper = shallow(<NextFixtures />);
        expect(() => wrapper).not.toThrow();
    });
});
