
import React from 'react';
import { shallow } from '../../enzyme';
import SelectProfilePicture from './SelectProfilePicture';

describe('Profile - SelectProfilePicture', () => {
    it('The SelectProfilePicture component renders without crashing', () => {
        const wrapper = shallow(<SelectProfilePicture />);
        expect(() => wrapper).not.toThrow();
    });
});
