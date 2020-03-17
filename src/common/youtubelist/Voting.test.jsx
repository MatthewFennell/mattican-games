
import React from 'react';
import { shallow } from '../../enzyme';
import Voting from './Voting';

describe('Common - Voting', () => {
    it('The Voting component renders without crashing', () => {
        const wrapper = shallow(<Voting />);
        expect(() => wrapper).not.toThrow();
    });
});
