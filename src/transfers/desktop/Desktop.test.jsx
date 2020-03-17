
import React from 'react';
import { shallow } from '../../enzyme';
import Desktop from './Desktop';

describe('Transfers - Desktop', () => {
    it('The Desktop component renders without crashing', () => {
        const wrapper = shallow(<Desktop />);
        expect(() => wrapper).not.toThrow();
    });
});
