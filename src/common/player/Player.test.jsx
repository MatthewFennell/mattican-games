
import React from 'react';
import { shallow } from '../../enzyme';
import Player from './Player';

describe('Common - Player', () => {
    it('The Player component renders without crashing', () => {
        const wrapper = shallow(<Player />);
        expect(() => wrapper).not.toThrow();
    });
});
