import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "@fontsource/vt323";


const ErrorMsg = ({error, resetErrorBoundary}) => {
  console.log(error);
  return (
   <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', background: 'linear-gradient(15deg, #2D3436 0%, #000000 74%);' }}>
        <Typography align='center' sx={{ font: '128px vt323', fontWeight: 'bold', color: '#8884D8', textShadow: '3px 3px 0px rgba(55, 22, 73, 0.9)', mt: 15, width: '70%' }}>
          No idea what happened, but something has gone wrong...
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={resetErrorBoundary}
          sx={{  
            font: '85px vt323',
            fontWeight: 'bold',
            color: '#8884D8',
            textShadow: '3px 3px 0px rgba(55, 22, 73, 0.9)',
            background: 'none',
            border: '5px solid #8884D8',
            boxShadow: 'rgba(248, 248, 255, 0.3) 0px 1px 2px 0px, rgba(248, 248, 255, 0.15) 0px 2px 6px 2px;',
            mt: 10,
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
          Go Back
        </Button>
        <Typography align='center' sx={{ font: '26px vt323', fontWeight: 'bold', color: '#FFDEAD', textShadow: '3px 3px 0px rgba(55, 22, 73, 0.9)', mt: 25, width: '50%' }}>
          "Man's vanity may well approach the infinite in capacity but his knowledge remains imperfect and howevermuch he comes to value his judgments ultimately he must submit them before a higher court."
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default ErrorMsg;
