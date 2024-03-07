import React from 'react';
import MUIButton from '@mui/material/Button';
import CircularProgess from '@mui/material/CircularProgress';

function Button(props) {

  const { children, isLoading, ...rest } = props;

  return (
    <MUIButton {...rest}>
      {!isLoading && children}
      {isLoading && <CircularProgess color="secondary"/>}
    </MUIButton>
  );
}

export default Button;