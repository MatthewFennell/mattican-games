
import React from 'react';
import { noop } from 'lodash';
import { shallow } from '../enzyme';
import { FeatureRequestUnconnected } from './FeatureRequest';

describe('FeatureRequest', () => {
    it('The FeatureRequest component renders without crashing', () => {
        const wrapper = shallow(<FeatureRequestUnconnected
            closeFeatureRequestError={noop}
            deleteCommentRequest={noop}
            deleteReplyRequest={noop}
        />);
        expect(() => wrapper).not.toThrow();
    });
});
