import React, { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './Menu.module.scss';

const ITEM_HEIGHT = 48;

const MenuComponent = props => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const select = useCallback(selected => {
        setAnchorEl(null);
        props.onClick(selected);
        // eslint-disable-next-line
    }, [props.onClick]);

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className={props.styles.menuIcon}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200
                    }
                }}
            >
                {props.options.map(option => (
                    <MenuItem key={option.id} selected={false} onClick={() => select(option)}>
                        {option.text}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

MenuComponent.defaultProps = {
    onClick: noop,
    options: [],
    styles: defaultStyles
};

MenuComponent.propTypes = {
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string
    })),
    styles: PropTypes.objectOf(PropTypes.string)
};

export default MenuComponent;
