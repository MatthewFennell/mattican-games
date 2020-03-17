
import React from 'react';
import { shallow } from '../../enzyme';
import StyledButton from './StyledButton';

describe('Common - StyledButton', () => {
    it('The StyledButton component renders without crashing', () => {
        const wrapper = shallow(<StyledButton />);
        expect(() => wrapper).not.toThrow();
    });
});
