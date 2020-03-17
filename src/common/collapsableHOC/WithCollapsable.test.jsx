
import React from 'react';
import { shallow } from '../../enzyme';
import WithCollapsable from './WithCollapsable';

const dummyComponent = () => <div>Test</div>;
const HOC = WithCollapsable(dummyComponent);


describe('Common - WithCollapsable', () => {
    it('The WithCollapsable component renders without crashing - isOpen = false', () => {
        const wrapper = shallow(<HOC isOpen={false} />);
        expect(() => wrapper).not.toThrow();
    });

    it('The WithCollapsable component renders without crashing - isOpen = true', () => {
        const wrapper = shallow(<HOC isOpen />);
        expect(() => wrapper).not.toThrow();
    });
});
