import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const CustomButton = ({ to, onClick, ...props }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(to);
    if (onClick) {
      onClick();
    }
  };

  return <Button {...props} onClick={handleButtonClick} />;
};

export default CustomButton;
