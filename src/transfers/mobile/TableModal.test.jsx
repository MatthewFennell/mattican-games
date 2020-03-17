
import React from 'react';
import { shallow } from '../../enzyme';
import TableModal from './TableModal';

describe('Transfers - Mobile - TableModal', () => {
    it('The TableModal component renders without crashing', () => {
        const wrapper = shallow(<TableModal sortingComponent="test" />);
        expect(() => wrapper).not.toThrow();
    });
});
