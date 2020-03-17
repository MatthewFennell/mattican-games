
import React from 'react';
import { shallow } from '../enzyme';
import JoinLeagueForm from './JoinLeagueForm';

describe('Leagues - JoinLeagueForm', () => {
    it('The JoinLeagueForm component renders without crashing', () => {
        const wrapper = shallow(<JoinLeagueForm />);
        expect(() => wrapper).not.toThrow();
    });
});
