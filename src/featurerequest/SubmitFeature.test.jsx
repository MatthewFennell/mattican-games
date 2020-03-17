
import React from 'react';
import { shallow } from '../enzyme';
import SubmitFeature from './SubmitFeature';

describe('Feature Requests - SubmitFeature', () => {
    it('The SubmitFeature component renders without crashing', () => {
        const wrapper = shallow(<SubmitFeature />);
        expect(() => wrapper).not.toThrow();
    });
});
