
import React from 'react';
import { noop } from 'lodash';
import { shallow, mount } from '../../enzyme';
import Dropdown from './Dropdown';

describe('Common - Dropdown', () => {
    it('The Dropdown component renders without crashing', () => {
        const wrapper = shallow(<Dropdown />);
        expect(() => wrapper).not.toThrow();
    });

    it('Clicking a dropdown component fires the props action', () => {
        const options = [
            { value: 'goalkeeper', text: 'goalkeeper', id: 'goalkeeper' },
            { value: 'defender', text: 'defender', id: 'defender' },
            { value: 'midfielder', text: 'midfielder', id: 'midfielder' },
            { value: 'attacker', text: 'attacker', id: 'attacker' }
        ];

        const mockCallback = jest.fn(noop);

        const wrapper = mount(<Dropdown options={options} value="midfielder" onChange={mockCallback} />);
        wrapper.find('.MuiInputBase-inputSelect').at(0).simulate('click');
        wrapper.find('ul').childAt(2).simulate('click');
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe('defender');
        expect(() => wrapper).not.toThrow();
    });
});
