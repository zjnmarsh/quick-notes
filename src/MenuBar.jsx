import React, {useState, useEffect } from 'react';
import { Button, Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


const MenuBar = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label={"more"}
                id={"long-button"}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup={"true"}
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                >
                <MenuIcon />
            </IconButton>
            <Menu
                id={"basic-menu"}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
        </div>
    )

}

export default MenuBar