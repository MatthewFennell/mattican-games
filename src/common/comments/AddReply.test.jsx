
import React from 'react';
import { shallow } from '../../enzyme';
import AddReply from './AddReply';

describe('Common - AddReply', () => {
    it('The AddReply component renders without crashing', () => {
        const wrapper = shallow(<AddReply />);
        expect(() => wrapper).not.toThrow();
    });
});
