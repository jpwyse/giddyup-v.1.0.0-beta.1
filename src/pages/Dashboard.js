import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logout } from '../redux/actions/auth';
import { useSnackbar } from 'notistack';
import Clock from 'react-live-clock';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactComponent as GiddyIconSideBar } from '../design/icons/GiddyIconSideBar.svg';
import { ReactComponent as AccountIcon } from '../design/icons/AccountIcon.svg';
import { ReactComponent as AccountIconActive } from '../design/icons/AccountIconActive.svg';
import { ReactComponent as LogoutIcon } from '../design/icons/LogoutIcon.svg';
import { ReactComponent as LogoutIconActive } from '../design/icons/LogoutIconActive.svg';
import { ReactComponent as LoginIcon } from '../design/icons/LoginIcon.svg';
import { ReactComponent as LoginIconActive } from '../design/icons/LoginIconActive.svg';
import { ReactComponent as SignUpIcon } from '../design/icons/SignUpIcon.svg';
import { ReactComponent as SignUpIconActive } from '../design/icons/SignUpIconActive.svg';
import OptionsIcon from '../design/icons/OptionsIcon';
import OptionsIconActive from '../design/icons/OptionsIconActive';
import ZeroDteIcon from '../design/icons/ZeroDteIcon';
import ZeroDteIconActive from '../design/icons/ZeroDteIconActive';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const drawerWidth = 245;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Dashboard = () => {
  const theme = useTheme();
  const isAuth = useSelector(state => state.auth.isAuth);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(["options"]);
  const [selected, setSelected] = useState("zerodte");
  const [hoverLink, setHoverLink] = useState(null);

  useEffect(() => {
    if (location?.pathname === "/dashboard/zerodte") {
      setSelected("zerodte");
    } 
    if (location?.pathname === "/dashboard/account") {
      setSelected("account");
    }
    if (location?.pathname === "/login") {
      setSelected("login");
    }
    if (location?.pathname === "/signup") {
      setSelected("signup");
    }
  }, [location]);



  const logoutUser = () => {
    dispatch(logout());
    setLogoutAlert(false);
    navigate("../login", { replace: true });
    setTimeout(() => {
      enqueueSnackbar(logoutSuccess, {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    }, 500);
  };


  const handleDrawer = () => {
    setOpen(!open);
  };

  
  const handleExpanded = (event, tab) => {
    if (!open) {
      setOpen(true);
    }
  };



  const userDash = (
    <React.Fragment>
      <ListItemButton alignItems='center' onClick={() => navigate("../dashboard/account")} onMouseOver={() => setHoverLink("account")} onMouseLeave={() => setHoverLink(null)} sx={{ position: 'fixed', bottom: open ? 152 : 70, width: open ? null : 66, borderTop: !open ? '1px solid rgba(248, 248, 255, 0.25)' : null, "&:hover": {transform: 'scale(1.05)'} }}>
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ ml: !open ? -1 : null }}>
          {hoverLink === "account" ? <AccountIconActive /> : <AccountIcon />}
          <Typography hidden={!open} sx={{ font: '18px Aldrich', fontWeight: 'bold', color: hoverLink === "account" ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', pt: 0.25 }}>
            {user?.username}
          </Typography>
        </Stack> 
      </ListItemButton>
      <ListItemButton onClick={() => setLogoutAlert(true)} onMouseOver={() => setHoverLink("logout")} onMouseLeave={() => setHoverLink(null)} alignItems='center' sx={{ position: 'fixed', bottom: open ? 65 : 10, "&:hover": {transform: 'scale(1.05)'} }}>
        <Stack direction="column" alignItems="center" justifyContent="center">
          {hoverLink === "logout" ? <LogoutIconActive /> : <LogoutIcon />}
          <Typography hidden={!open} sx={{ font: '18px Aldrich', fontWeight: 'bold', color: hoverLink === "logout" ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', pt: 0.25 }}>
            LOGOUT
          </Typography>
       </Stack> 
      </ListItemButton>
    </React.Fragment>
  );


  const guestDash = (
    <React.Fragment>
      <ListItemButton alignItems='center' onClick={() => navigate("../login")} onMouseOver={() => setHoverLink("login")} onMouseLeave={() => setHoverLink(null)} sx={{ position: 'fixed', bottom: open ? 150 : 70, width: open ? null : 66, borderTop: !open ? '1px solid rgba(248, 248, 255, 0.25)' : null, "&:hover": {transform: 'scale(1.05)'} }}>
        <Stack direction="column" alignItems="center" sx={{ ml: !open ? -1.5 : null }}>
          {hoverLink === "login" ? <LoginIconActive /> : <LoginIcon />}
          <Typography hidden={!open} sx={{ font: '18px Aldrich', fontWeight: 'bold', color: hoverLink === "login" ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', pt: 0.25 }}>
            LOGIN
          </Typography>
       </Stack> 
      </ListItemButton>
      <ListItemButton alignItems='center' onClick={() => navigate("../signup")} onMouseOver={() => setHoverLink("signup")} onMouseLeave={() => setHoverLink(null)} sx={{ position: 'fixed', bottom: open ? 62 : 12, "&:hover": {transform: 'scale(1.05)'} }}>
        <Stack direction="column" alignItems="center">
          {hoverLink === "signup" ? <SignUpIconActive /> : <SignUpIcon />}
          <Typography hidden={!open} sx={{ font: '18px Aldrich', fontWeight: 'bold', color: hoverLink === "signup" ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', pt: 1 }}>
            SIGNUP
          </Typography>
       </Stack> 
      </ListItemButton>
    </React.Fragment>
  );


  const logoutNotice = (
    <Dialog open={logoutAlert} onClose={() => setLogoutAlert(false)}>
      <DialogTitle sx={{ bgcolor: '#2D3436' }}>{logoutMsg}</DialogTitle>
      <DialogActions sx={{ bgcolor: '#2D3436' }}>
        <Button 
          variant="contained" 
          onClick={logoutUser} 
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#F8F8FF',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #F8F8FF',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#D0F0C0', 
              background: 'none',
              border: '3px solid #D0F0C0',
              transform: 'scale(1.05)',
              boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
            }
          }}
        >
          Yes
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setLogoutAlert(false)} 
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#F8F8FF',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #F8F8FF',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#D0F0C0', 
              background: 'none',
              border: '3px solid #D0F0C0',
              transform: 'scale(1.05)',
              boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
            }
          }}
        >
          Nevermind
        </Button>
      </DialogActions>
    </Dialog>
  );

  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {logoutNotice}
      <Drawer variant="permanent" open={open} sx={{ [`& .MuiDrawer-paper`]: {background: 'linear-gradient(315deg, #2d3436 0%, #000000 74%);'} }}>
        <Toolbar />
        <List component="nav" sx={{ width: '100%', maxWidth: 245 }}>
          <ListItemButton onClick={handleDrawer} sx={{ zIndex: 2 }}>
            <ListItemText>
              <Typography style={{ font: '18px Aldrich', fontWeight: 'bold', fontStyle: 'italic', color: '#F8F8FF', opacity: open ? '0.6' : '0', marginTop: 5 }} >
                Dashboard Data
              </Typography>
            </ListItemText>
            <ListItemIcon>
              {open ? <MenuOpenIcon sx={{ color: '#F8F8FF', height: 35, width: 35, ml: 20, "&:hover": {transform: 'scale(1.1)', color: '#A8E4A0'} }} /> : <MenuIcon sx={{ color: '#F8F8FF', height: 35, width: 35, ml: 0, "&:hover": {transform: 'scale(1.1)', color: '#A8E4A0'} }} />}
            </ListItemIcon>
          </ListItemButton>
          <Divider sx={{ bgcolor: '#F8F8FF', opacity: '0.5' }} />
          <ListItemButton onClick={(event) => handleExpanded(event, 'options')} onMouseOver={() => setHoverLink("options")} onMouseLeave={() => setHoverLink(null)} sx={{ ml: open ? -1 : -0.5 }} >
            <ListItemIcon sx={{ "&:hover": !open ? {transform: 'scale(1.1)'} : null }}>
              {hoverLink === 'options' ? <OptionsIconActive/> : <OptionsIcon />}
            </ListItemIcon>
            { open ? 
              <ListItemText>
                <Typography sx={{ font: '22px Aldrich', fontWeight: 'bold', color: hoverLink === 'options' ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', ml: -0.5, pt: 1 }}>
                  OPTIONS
                </Typography>
              </ListItemText>
            : null }
            {expanded.includes('options') ? <ExpandLess sx={{ color: hoverLink === 'options' ? '#A8E4A0' : '#F8F8FF' }} /> : <ExpandMore sx={{ color: hoverLink === 'options' ? '#A8E4A0' : '#F8F8FF' }} />}
          </ListItemButton>
          <Divider sx={{ bgcolor: '#F8F8FF', opacity: '0.25' }} />
          <Collapse in={expanded.includes('options')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding  sx={{ bgcolor: selected === "zerodte" ? '#1B1B1B' : null, transform: hoverLink === 'zerodte' ? 'scale(1.02)' : null }}>
              <ListItemButton selected={selected === 'zerodte'} onClick={() => navigate("../dashboard/zerodte")} onMouseOver={() => setHoverLink("zerodte")} onMouseLeave={() => setHoverLink(null)} sx={{ pl: 2 }}>
                <ListItemIcon sx={{ ml: -0.5 }}>
                  {selected === 'zerodte' || hoverLink === 'zerodte' ? <ZeroDteIconActive /> : <ZeroDteIcon /> }
                </ListItemIcon>
                <ListItemText>
                  <Typography hidden={!open} sx={{ font: '19px Aldrich', fontWeight: 'bold', color: selected === 'zerodte' || hoverLink === 'zerodte' ? '#A8E4A0' : '#F8F8FF', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', ml: -1.5, pt: 0.5, transform: hoverLink === '0dte' ?'scale(1.05)' : null }}>
                    0DTE
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ bgcolor: '#F8F8FF', opacity: '0.25' }} />
          <Stack direction="column" alignItems="center" justifyContent="center" spacing={0}>
            <ListItemIcon sx={{ width: 250, mt: 0, mb: 0 }}>
              {open ? <GiddyIconSideBar /> : null}
            </ListItemIcon>
          </Stack>
          <Divider sx={{ bgcolor: '#F8F8FF', opacity: '0.25' }} />
          <Stack direction="column" alignItems="center" justifyContent="center" spacing={0}>
            {isAuth ? userDash : guestDash }
          </Stack>
          <ListItemButton alignItems='center' sx={{ mt: 'calc(10% + 60px)', position: 'fixed', bottom: 0, width: open ? drawerWidth : 65, borderTop: open ? '1px solid rgba(248, 248, 255, 0.25)' : null }}>
            <ListItemText sx={{ ml: 6 }}>
              <Typography sx={{ font: '20px Aldrich', fontWeight: 'bold', color: '#F8F8FF', lineHeight: '1.5', textShadow: '2px 3px 5px rgba(0,0,0,0.5)', "&:hover": { color: '#A8E4A0' } }}>
                {open ? <Clock format={'hh:mm:ss A'} ticking={true} blinking={false} timezone={null} /> : null}
              </Typography>
            </ListItemText>
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" sx={{ width: '90vw', overflow: 'hidden', flexWrap: 'nowrap', p: 5, mx: "auto" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;



const logoutMsg = (
  <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF' }}>
    Are you sure you want to logout?
  </Typography>
);

const logoutSuccess = (
  <Typography sx={{ font: '22px VT323', color: '#F8F8FF', fontWeight: 'bold' }}>
    You have been successfully logged out. 
  </Typography>
);
