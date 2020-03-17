
import React from 'react';
import { shallow } from '../../enzyme';
import LinkAccounts from './LinkAccounts';

describe('Profile - LinkAccounts', () => {
    it('The LinkAccounts component renders without crashing', () => {
        const wrapper = shallow(<LinkAccounts />);
        expect(() => wrapper).not.toThrow();
    });
});
