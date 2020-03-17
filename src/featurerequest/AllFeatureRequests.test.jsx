
import React from 'react';
import { shallow } from '../enzyme';
import AllFeatureRequests from './AllFeatureRequests';

describe('Feature Requests - AllFeatureRequests', () => {
    it('The AllFeatureRequests component renders without crashing', () => {
        const wrapper = shallow(<AllFeatureRequests />);
        expect(() => wrapper).not.toThrow();
    });
});
