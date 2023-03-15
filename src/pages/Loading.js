import React from "react";
import { useSpring, animated } from 'react-spring';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactComponent as GiddyIconLoading } from '../design/icons/GiddyIconLoading.svg';
import Ellipsis from '../segments/Ellipsis';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const Loading = () => {
  const loadLogo = useSpring({ 
    loop: true,
    to: [
      { opacity: 0.99, scale: 1.5}, 
      { opacity: 0.8, scale: 1}
    ], 
    from: { opacity: 0, scale: 1 }, 
  });

  
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <animated.div style={loadLogo}>
          <Typography align='center' gutterBottom sx={{ mt: 5, ml: -10 }}>
            <GiddyIconLoading sx={{  zIndex: 5, position: 'static' }} />
          </Typography>
        </animated.div>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="center" alignItems="center" spacing={2} sx={{ mx: "auto" }}>
          <Typography align="center" sx={{ font: '150px vt323', color: '#8884D8', textShadow: '5px 7px 0px rgba(0, 0, 0, 0.5)', textTransform: 'uppercase'}}>
            LOADING
          </Typography>
          <div>
            <Ellipsis />
          </div>
        </Stack>
      </Container>
    </React.Fragment>
  );
};


export default Loading;

