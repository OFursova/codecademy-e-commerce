import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/system';

const Header = () => {

  const useStyles = styled('div')(({ theme }) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    header: {
      justifyContent: 'space-between'
    }
  }));

  const classes = useStyles();

  const { isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  return (
    <AppBar position="static">
      <Toolbar className={classes.header}>
        <Typography variant="h6" className={classes.title}>
          Codecademy Shop
        </Typography>
        <div>
          { !isAuthenticated &&
            <Button color="inherit" component={Link} to={`/login`}>Login</Button>
          }
          { isAuthenticated &&
            <Button color="inherit" component={Link} to={`/orders`}>My Orders</Button>
          }
          <IconButton aria-label="access shopping cart" color="inherit" component={Link} to="/cart">
            <Badge badgeContent={items?.length || 0} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;