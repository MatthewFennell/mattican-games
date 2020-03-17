
import React from 'react';
import { shallow } from '../../enzyme';
import ErrorModal from './ErrorModal';

describe('Common - ErrorModal', () => {
    it('The ErrorModal component renders without crashing', () => {
        const wrapper = shallow(<ErrorModal />);
        expect(() => wrapper).not.toThrow();
    });
});
