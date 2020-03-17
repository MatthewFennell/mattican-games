
import React from 'react';
import { shallow } from '../../enzyme';
import RadioButton from './RadioButton';

describe('Common - RadioButton', () => {
    it('The RadioButton component renders without crashing', () => {
        const wrapper = shallow(<RadioButton />);
        expect(() => wrapper).not.toThrow();
    });
});
