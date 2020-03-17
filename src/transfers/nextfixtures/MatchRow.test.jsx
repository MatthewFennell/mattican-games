
import React from 'react';
import { shallow } from '../../enzyme';
import MatchRow from './MatchRow';

describe('Next Fixtures - MatchRow', () => {
    it('The MatchRow component renders without crashing', () => {
        const wrapper = shallow(<MatchRow />);
        expect(() => wrapper).not.toThrow();
    });
});
