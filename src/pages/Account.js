import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Profile from '../components/Account/Profile';
import '@fontsource/vt323';
import '@fontsource/aldrich';



const Account = () => {
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const [value, setValue] = useState('profile');
  const [selected, setSelected] = useState(null);
  const [hoverLink, setHoverLink] = useState(null);

  useEffect(() => {
    if (location?.pathname === "/account/profile") {
      setSelected("profile");
    } 
  }, [location]);

 
  const handleHover = (event, tab) => {
    if (tab === hoverLink) {
      setHoverLink(null);
    } else {
      setHoverLink(tab);
    }
  };

  const handleSelected = (event, value) => {
    setValue(value);
  };


  return (
    <Box sx={{ width: '80%', mx: 'auto', mt: 2, background: 'linear-gradient(315deg, #2d3436 0%, #000000 74%);', boxShadow: 'rgba(200, 200, 200, 0.16) 0px 3px 6px, rgba(200, 200, 200, 0.23) 0px 3px 6px;', border: '4px solid #C9C0BB', borderRadius: '12px' }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: '#F8F8FF' }}>
              <TabList onChange={handleSelected} TabIndicatorProps={{ style: { background: "none" } }}>
                <Tab label="PROFILE" value="profile" sx={{ font: '40px VT323', color: '#F8F8FF', fontWeight: 'bold', textShadow: '2px 4px 4px rgba(245,245,245,0.5)', "&.Mui-selected": { color: "#A8E4A0", fontWeight: 'bold', textDecoration: 'underline', textDecorationThickness: '4px' }, "&:hover": { transform: 'scale(1.03)', color: '#8884D8', textShadow: 'none' } }} />
              </TabList>
            </Box>
            <TabPanel value="profile"> 
              <Profile user={user} /> 
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Account;
