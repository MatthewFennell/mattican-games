
import React from 'react';
import { shallow } from '../enzyme';
import CreateLeagueForm from './CreateLeagueForm';

describe('Leagues - CreateLeagueForm', () => {
    it('The CreateLeagueForm component renders without crashing', () => {
        const wrapper = shallow(<CreateLeagueForm />);
        expect(() => wrapper).not.toThrow();
    });
});
