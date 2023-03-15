import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const NavBar = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location?.pathname;
  const [urlPath, setUrlPath] = useState(path);
  const [dashRoute, setDashRoute] = useState(null);

  useEffect(() => {
    const getUrlPath = async () => {
      const path = location?.pathname;
      setUrlPath(path); 
    };
    if (location) {
      getUrlPath();
    }
  }, [location]);


  useEffect(() => {
    if (urlPath.includes('/dashboard')) {
      setDashRoute(true);
    } else {
      setDashRoute(false);
    }
  }, [urlPath]);

  

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ height: 70, zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(15deg, #2D3436 0%, #000000 74%);' }}>
        <Toolbar sx={{ mt: 1 }}>
          <Typography component='button' noWrap onClick={() => navigate("../dashboard/zerodte")} sx={{ font: '36px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 3px 4px rgba(245,245,245,0.5)', background: 'none', boxShadow: 'none', border: 'none' }} >
            GiddyUp Analytics
          </Typography>
          <Button onClick={() => navigate("../dashboard/zerodte")} sx={{ font: '22px Aldrich', fontWeight: 'bold', color: dashRoute ? '#A8E4A0' : '#8884D8', textShadow: '2px 3px 4px rgba(245,245,245,0.5)', ml: "auto", textDecoration: dashRoute ? 'underline' : null, textDecorationThickness: dashRoute ? '4px' : null, "&:hover": { color: '#A8E4A0', transform: 'scale(1.03)', textDecoration: 'underline', textDecorationThickness: '4px' } }}>
            Dashboard
          </Button>
          <Button onClick={() => navigate("../contact")} sx={{ font: '22px Aldrich', fontWeight: 'bold', color: urlPath === "/contact" ? '#A8E4A0' : '#8884D8', textShadow: '2px 3px 4px rgba(245,245,245,0.5)', textDecoration: urlPath === "/contact" ? 'underline' : null, textDecorationThickness: urlPath === "/contact" ? '4px' : null, "&:hover": { color: '#A8E4A0', transform: 'scale(1.03)', textDecoration: 'underline', textDecorationThickness: '4px'} }}>
            Contact
          </Button>
          {!dashRoute && !isAuth ?
            <React.Fragment>
              <Button hidden={dashRoute} variant='outlined' onClick={() => navigate("../login")} sx={{ font: '20px Aldrich', fontWeight: 'bold', color: urlPath === "/login" ? '#A8E4A0' : '#8884D8', textShadow: '2px 3px 4px rgba(245,245,245,0.5)', border: '3px solid', ml: 5, mt: -0.5, pt: 1, "&:hover": { color: '#A8E4A0', transform: 'scale(1.03)', border: '3px solid' } }}>
                Login
              </Button>
              <Button variant='outlined' onClick={() => navigate("../signup")} sx={{ font: '20px Aldrich', fontWeight: 'bold', color: urlPath === "/signup" ? '#A8E4A0' : '#8884D8', textShadow: '2px 3px 4px rgba(245,245,245,0.5)', border: '3px solid', ml: 1, mt: -0.5, pt: 1, "&:hover": { color: '#A8E4A0', transform: 'scale(1.03)', border: '3px solid' } }}>
                Signup
              </Button>
            </React.Fragment>
          : null }
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default NavBar;



