import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import defaultStyles from './WithCollapsable.module.scss';

const WithCollapsable = Component => {
    const NormalComponent = props => {
        const { styles, ...args } = props; // Need to not pass down styles

        const toggleClose = useCallback(() => {
            if (props.id) {
                props.toggle(false, props.id);
            } else {
                props.toggle(false);
            }
            // eslint-disable-next-line
        }, [props.id, props.toggle]);

        const toggleOpen = useCallback(() => {
            if (props.id) {
                props.toggle(true, props.id);
            } else {
                props.toggle(true);
            }
            // eslint-disable-next-line
        }, [props.id, props.toggle]);

        if (props.isOpen) {
            return (
                <div className={props.styles.collapsableWrapper}>
                    <div className={props.styles.expandLess}>
                        <ExpandLessIcon onClick={toggleClose} />
                    </div>
                    <Component {...args} />
                </div>
            );
        }
        return (
            <div className={props.styles.expandWrapper}>
                <div className={props.styles.iconWrapper}>
                    <div
                        onClick={() => props.toggle(true, props.id)}
                        role="button"
                        tabIndex={0}
                        className={props.styles.collapsedTitle}
                    >
                        {`${props.title} (Click to expand)`}
                    </div>
                    <div className={props.styles.expandIcon}>
                        <ExpandMoreIcon onClick={toggleOpen} />
                    </div>
                </div>
            </div>
        );
    };

    NormalComponent.defaultProps = {
        id: null,
        isOpen: false,
        styles: defaultStyles,
        title: '',
        toggle: noop
    };

    NormalComponent.propTypes = {
        id: PropTypes.string,
        isOpen: PropTypes.bool,
        styles: PropTypes.objectOf(PropTypes.string),
        title: PropTypes.string,
        toggle: PropTypes.func
    };

    return NormalComponent;
};

export default WithCollapsable;
