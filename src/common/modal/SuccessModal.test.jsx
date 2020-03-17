
import React from 'react';
import { shallow } from '../../enzyme';
import SuccessModal from './SuccessModal';

describe('Common - SuccessModal', () => {
    it('The SuccessModal component renders without crashing', () => {
        const wrapper = shallow(<SuccessModal />);
        expect(() => wrapper).not.toThrow();
    });
});
