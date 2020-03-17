
import React from 'react';
import { shallow } from '../../enzyme';
import Spinner from './Spinner';

describe('Common - Spinner', () => {
    it('The Spinner component renders without crashing', () => {
        const wrapper = shallow(<Spinner />);
        expect(() => wrapper).not.toThrow();
    });
});
