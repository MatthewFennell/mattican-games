import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { noop } from 'lodash';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import classNames from 'classnames';
import defaultStyles from './Grid.module.scss';
import Linear from '../spinner/LinearSpinner';

const defaultGridStyles = {
    root: {
        width: '100%'
    },
    tableWrapper: {
        // maxHeight: 440,
        overflow: 'auto'
    },
    maxHeightSet: {
        maxHeight: 400
    }
};

const Grid = props => {
    const classes = makeStyles(props.gridStyles)();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPageOptions[0] || 5);

    const handleChangePage = (event, newPage) => {
        if (props.controlPagination) {
            props.setPage(setPage, newPage);
        } else {
            setPage(newPage);
        }
    };

    const handleChangeRowsPerPage = event => {
        if (props.controlPagination) {
            props.setRowsPerPage(setRowsPerPage, event.target.value);
        } else {
            setRowsPerPage(event.target.value);
        }
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <div className={classNames({
                [classes.tableWrapper]: true,
                [classes.maxHeightSet]: props.maxHeightGrid,
                [props.styles.tableWrap]: true
            })}
            >

                <div id="tableTitle" className={props.styles.gridHeader}>
                    {props.renderBackButton
                            && (
                                <div className={props.styles.backButton}>
                                    <ArrowBackIcon onClick={props.backButtonLink} />
                                </div>
                            )}

                    <div className={props.styles.gridHeaderText}>
                        {props.gridHeader ? props.gridHeader : ''}
                    </div>
                </div>
                {props.loading && <Linear color={props.loadingColor} />}
                <Table stickyHeader aria-label="sticky table">
                    {/* <Table stickyHeader> */}
                    <TableHead>
                        <TableRow>
                            {props.columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(row => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    onClick={() => props.onRowClick(row)}
                                    className={classNames({
                                        [props.styles.active]: props.activeRow(row)
                                    })}
                                >
                                    {props.columns.map(column => {
                                        const value = row[column.id];

                                        if (column.renderCell) {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {row[column.id]}
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
            {props.showPagination
            && (
                <TablePagination
                    rowsPerPageOptions={props.rowsPerPageOptions}
                    component="div"
                    count={props.numberOfUsersInLeague || props.rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page'
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page'
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
};

Grid.defaultProps = {
    activeRow: () => false,
    backButtonLink: noop,
    columns: [],
    controlPagination: false,
    gridHeader: '',
    gridStyles: defaultGridStyles,
    loading: false,
    loadingColor: 'primary',
    maxHeightGrid: false,
    numberOfUsersInLeague: 0,
    setPage: noop,
    setRowsPerPage: noop,
    onRowClick: noop,
    renderBackButton: false,
    rows: [],
    rowsPerPageOptions: [5, 10],
    showPagination: true,
    styles: defaultStyles
};

Grid.propTypes = {
    activeRow: PropTypes.func,
    backButtonLink: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.shape({
        align: PropTypes.string,
        format: PropTypes.func,
        key: PropTypes.string,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.node),
                PropTypes.node
            ])]),
        minWidth: PropTypes.number,
        style: PropTypes.objectOf(PropTypes.string)
    })),
    controlPagination: PropTypes.bool,
    gridHeader: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    gridStyles: PropTypes.objectOf(PropTypes.shape({})),
    loading: PropTypes.bool,
    loadingColor: PropTypes.string,
    maxHeightGrid: PropTypes.bool,
    setPage: PropTypes.func,
    setRowsPerPage: PropTypes.func,
    onRowClick: PropTypes.func,
    numberOfUsersInLeague: PropTypes.number,
    renderBackButton: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.shape({})),
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    showPagination: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Grid;
