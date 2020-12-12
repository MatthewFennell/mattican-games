import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import defaultStyles from './ErrorBoundary.module.scss';
import * as selectors from './selectors';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });
        Sentry.withScope(scope => {
            scope.setUser({
                email: this.props.email,
                id: this.props.uid,
                username: this.props.displayName
            });
            scope.setContext();
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={this.props.styles.errorMessageWrapper}>
                    <div className={this.props.styles.errorHeader}>
                        {`There was an error in the ${this.props.moduleName} module. This error has been reported to Matt.`}
                    </div>

                    <ul className={this.props.styles.options}>
                        <li>
                            Try loading
                            {' '}
                            <a
                                className={this.props.styles.linkColor}
                                href={`/${process.env.REACT_APP_AUTH_DOMAIN}`}
                            >
                                {`https://${process.env.REACT_APP_AUTH_DOMAIN}`}

                            </a>
                        </li>

                        <li>
                            If the error persists,
                            let Matt know (and which module)
                        </li>
                    </ul>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    displayName: PropTypes.string,
    email: PropTypes.string,
    moduleName: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.string),
    uid: PropTypes.string
};

ErrorBoundary.defaultProps = {
    children: null,
    displayName: '',
    email: '',
    moduleName: '',
    styles: defaultStyles,
    uid: ''
};

const mapStateToProps = state => ({
    email: selectors.getAuthField(state, 'email'),
    uid: selectors.getAuthField(state, 'uid'),
    displayName: selectors.getAuthField(state, 'displayName')
});

export default connect(mapStateToProps, null)(ErrorBoundary);

export { ErrorBoundary as ErrorBoundaryUnconnected };
