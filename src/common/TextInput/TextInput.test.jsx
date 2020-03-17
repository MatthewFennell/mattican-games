
import React from 'react';
import { shallow } from '../../enzyme';
import TextInput from './TextInput';

describe('Common - TextInput', () => {
    it('The TextInput component renders without crashing', () => {
        const wrapper = shallow(<TextInput />);
        expect(() => wrapper).not.toThrow();
    });
});
