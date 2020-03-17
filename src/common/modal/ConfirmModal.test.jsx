
import React from 'react';
import { shallow } from '../../enzyme';
import ConfirmModal from './ConfirmModal';

describe('Common - ConfirmModal', () => {
    it('The ConfirmModal component renders without crashing', () => {
        const wrapper = shallow(<ConfirmModal />);
        expect(() => wrapper).not.toThrow();
    });
});
