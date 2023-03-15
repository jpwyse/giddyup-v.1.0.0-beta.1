import React from "react";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', background: 'none' }}>
      <Typography align='center' sx={{ font: '500px vt323', fontWeight: 'bold', textDecoration: 'underline', color: '#8884D8', textShadow: '5px 5px 0px rgba(208, 240, 192, 0.19)', mb: 3 }}>
        404
      </Typography>
      <Typography align='center' sx={{ font: '52px VT323', fontWeight: 'bold', color: '#D73B3E', textShadow: '4px 4px 0px rgba(0,0,0,0.2)', mb: 4 }}>
        Page not found. 
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate("../dashboard/zerodte", { replace: true })}
        sx={{  
          font: '65px vt323',
          fontWeight: 'bold',
          color: '#8884D8',
          textShadow: '3px 3px 0px rgba(55, 22, 73, 0.9)',
          background: 'none',
          border: '5px solid #8884D8',
          boxShadow: 'rgba(248, 248, 255, 0.3) 0px 1px 2px 0px, rgba(248, 248, 255, 0.15) 0px 2px 6px 2px;',
          mt: 2,
          '&:hover': { 
            fontWeight: 'bold',
            color: '#A8E4A0', 
            background: 'none',
            border: '5px solid #A8E4A0',
            transform: 'scale(1.05)',
            boxShadow: 'rgba(255, 222, 173, 0.8) 0px 10px 20px, rgba(255, 222, 173, 0.23) 0px 6px 6px;',
          }
        }}
      >
        Salvation
      </Button>
    </Box>
  );
};

export default NotFound;
