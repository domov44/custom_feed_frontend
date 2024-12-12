import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

const CustomMenuItem = ({ to, onClick, ...props }) => {
  const navigate = useNavigate();

  const handleMenuItemClick = () => {
    navigate(to);
    if (onClick) {
      onClick();
    }
  };

  return <MenuItem {...props} onClick={handleMenuItemClick} />;
};

export default CustomMenuItem;

