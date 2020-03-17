
import React from 'react';
import { shallow } from '../enzyme';
import SubmitVideo from './SubmitVideo';

describe('Highlights - SubmitVideo', () => {
    it('The SubmitVideo component renders without crashing', () => {
        const wrapper = shallow(<SubmitVideo />);
        expect(() => wrapper).not.toThrow();
    });
});
