import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './EditFilter.module.scss';
import Slider from '../../common/slider/Slider';
import StyledButton from '../../common/StyledButton/StyledButton';
import { marks } from '../helpers';
import Switch from '../../common/Switch/Switch';

const EditFilter = props => {
    const [minWeek, setMinWeek] = useState(props.minWeek);
    const [maxWeek, setMaxWeek] = useState(props.maxWeek);
    const [activeColumns, setActiveColumns] = useState(props.activeColumns);

    const toggle = useCallback(item => {
        if (activeColumns.some(x => x.id === item.id)) {
            setActiveColumns(activeColumns.filter(x => x !== item));
        } else {
            setActiveColumns(activeColumns.concat([item]));
        }
    }, [activeColumns]);

    const confirm = useCallback(() => {
        props.confirmFilter(minWeek, maxWeek, activeColumns);
        // eslint-disable-next-line
    }, [props.confirmFilter, minWeek, maxWeek, activeColumns]);

    return (
        <div className={props.styles.editFilterWrapper}>
            <Slider
                marks={marks(props.maxGameWeek)}
                min={1}
                max={props.maxGameWeek}
                step={1}
                text="From Week"
                onChange={setMinWeek}
                value={minWeek}
            />
            <Slider
                marks={marks(props.maxGameWeek)}
                min={1}
                max={props.maxGameWeek}
                step={1}
                text="To Week"
                onChange={setMaxWeek}
                value={maxWeek}
            />
            <div className={props.styles.togglesWrapper}>
                {props.allColumns.map(x => (
                    <div key={x.id}>
                        <div className={props.styles.columnName}>
                            {x.label}
                        </div>
                        <div>
                            <Switch
                                color="primary"
                                checked={activeColumns.some(y => y.id === x.id)}
                                onChange={() => toggle(x)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className={props.styles.confirmButton}>
                <StyledButton text="Confirm" onClick={confirm} />
            </div>
        </div>
    );
};

EditFilter.defaultProps = {
    activeColumns: [],
    allColumns: [],
    confirmFilter: noop,
    maxGameWeek: 0,
    maxWeek: 0,
    minWeek: 0,
    styles: defaultStyles
};

EditFilter.propTypes = {
    activeColumns: PropTypes.arrayOf(PropTypes.shape({})),
    allColumns: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string
    })),
    confirmFilter: PropTypes.func,
    maxGameWeek: PropTypes.number,
    maxWeek: PropTypes.number,
    minWeek: PropTypes.number,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default EditFilter;
