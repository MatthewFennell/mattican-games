
import React from 'react';
import { shallow } from '../../enzyme';
import Table from './Table';

describe('Transfers - Mobile - Table', () => {
    it('The Table component renders without crashing', () => {
        const wrapper = shallow(<Table />);
        expect(() => wrapper).not.toThrow();
    });
});
