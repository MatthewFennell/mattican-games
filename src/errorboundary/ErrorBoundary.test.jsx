import React from 'react';
import { Provider } from 'react-redux';
import { noop } from 'lodash';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import StyledButton from '../common/StyledButton/StyledButton';
import { shallow, mount } from '../enzyme';
import ErrorBoundary, { ErrorBoundaryUnconnected } from './ErrorBoundary';

describe('ErrorBoundary', () => {
    it('The ErrorBoundary component renders without crashing', () => {
        const wrapper = shallow(<ErrorBoundaryUnconnected />);
        expect(() => wrapper).not.toThrow();
    });

    it('ErrorBoundary renders children', () => {
        const children = (
            <StyledButton />
        );
        const moduleName = 'module';
        const wrapper = mount(
            <ErrorBoundaryUnconnected
                moduleName={moduleName}
            >
                {children}
            </ErrorBoundaryUnconnected>
        );

        expect(wrapper.find(StyledButton)).toHaveLength(1);
    });

    it('ErrorBoundary renders error', () => {
        const children = (
            <StyledButton />
        );
        const moduleName = 'module';
        const wrapper = mount(
            <ErrorBoundaryUnconnected
                moduleName={moduleName}
            >
                {children}
            </ErrorBoundaryUnconnected>
        );

        wrapper.setState({ hasError: true });
        expect(wrapper.find('.errorHeader')).toHaveLength(1);
        expect(wrapper.find('.errorHeader').text()).toBe(`There was an error in the ${moduleName} module. This error has been reported to the web developer.`);
    });
});

describe('ErrorBoundary connected', () => {
    const mockHistory = {
        location: {
            pathname: 'pathname'
        },
        push: noop
    };

    it('Connected error boundary', () => {
        const mockStore = configureMockStore([]);
        const mockStoreInitialized = mockStore({
            history: mockHistory
        });

        const wrapper = mount(
            <Provider store={mockStoreInitialized}>
                <Router>
                    <ErrorBoundary />
                </Router>
            </Provider>
        );

        expect(() => wrapper).not.toThrow();
    });
});
