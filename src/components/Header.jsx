import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [logoutBtnClicked, setLogoutBtnClicked] = useState(false);
  const handleLogout = () => {
    setLogoutBtnClicked(true);
  };

useEffect(()=>{
  
  if(logoutBtnClicked){
    localStorage.removeItem("loggedInUser");
    setLogoutBtnClicked(false);
    setIsLoggedIn(false);
  }
},[logoutBtnClicked]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
           <Button color="inherit" component={Link} to="/" startIcon={<PlaylistAddCheckCircleIcon/>}>Expense Tracker</Button>
        </Typography>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>Log out</Button>
        ) : (
          <div>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">SignUp</Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
