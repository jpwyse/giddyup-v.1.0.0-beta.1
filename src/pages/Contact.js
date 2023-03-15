import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const Contact = () => {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <Container disableGutters maxWidth="md" component="main" sx={{ my: 4, pt: 8, pb: 6 }}>
        <Typography align="center" sx={{ font: '128px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 4px 4px rgba(245,245,245,0.5)', mb: 6 }}>
          Contact
        </Typography>
        <Typography component="p" align="center" sx={{ font: '32px Aldrich', fontWeight: 'bold', fontStyle: 'oblique', color: '#8884D8', textShadow: '2px 4px 4px rgba(245,245,245,0.5)', lineHeight: 1.5 }}>
          ~ giddyup.analytics@gmail.com ~
        </Typography>
      </Container>
    </React.Fragment>
  );
};

export default Contact;