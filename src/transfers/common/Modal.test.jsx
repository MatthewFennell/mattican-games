
import React from 'react';
import { shallow } from '../../enzyme';
import Modals from './Modals';

describe('Transfers - Modals', () => {
    it('The Modals component renders without crashing', () => {
        const wrapper = shallow(<Modals />);
        expect(() => wrapper).not.toThrow();
    });
});
