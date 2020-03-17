
import React from 'react';
import { shallow } from '../../enzyme';
import FeatureRequest from './FeatureRequest';

describe('Common - FeatureRequest', () => {
    it('The FeatureRequest component renders without crashing', () => {
        const wrapper = shallow(<FeatureRequest />);
        expect(() => wrapper).not.toThrow();
    });
});
