import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './TableModal.module.scss';
import Switch from '../../common/Switch/Switch';
import Dropdown from '../../common/dropdown/Dropdown';

const TableModal = props => (
    <div className={props.styles.tableModalWrapper}>
        <div className={props.styles.columnToggles}>
            {props.columnOptions.filter(x => !x.fixed).map(x => (
                <div key={x.id}>
                    <div className={props.styles.columnName}>
                        {x.name}
                    </div>
                    <div>
                        <Switch
                            color="primary"
                            checked={props.activeColumns.some(y => x.id === y.id)}
                            disabled={(!props.activeColumns.some(y => x.id === y.id)
                                && props.activeColumns.length >= 4)
                                  || (props.activeColumns.some(y => x.id === y.id)
                                  && props.activeColumns.length <= 2)}
                            onChange={() => props.toggleColumns(x.id)}
                        />
                    </div>
                </div>
            ))}
        </div>
        <div className={props.styles.sortingWrapper}>
            <Dropdown
                title="Sort By"
                key="Sort By"
                onChange={props.setSortBy}
                options={props.activeColumns.map(x => ({
                    ...x, text: x.name, value: x.id, id: x.id
                }))}
                value={props.sortBy}
            />
            {props.sortingComponent}
        </div>
    </div>
);

TableModal.defaultProps = {
    activeColumns: [],
    columnOptions: [],
    setSortBy: noop,
    sortBy: '',
    sortingComponent: '',
    styles: defaultStyles,
    toggleColumns: noop
};

TableModal.propTypes = {
    activeColumns: PropTypes.arrayOf(PropTypes.shape({})),
    columnOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string
    })),
    setSortBy: PropTypes.func,
    sortBy: PropTypes.string,
    sortingComponent: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    styles: PropTypes.objectOf(PropTypes.string),
    toggleColumns: PropTypes.func
};

export default TableModal;
