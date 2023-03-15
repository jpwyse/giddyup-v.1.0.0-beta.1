import React, { useState } from "react";
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import "@fontsource/vt323";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import api from '../../axios/api';


const ChangePassword = ({ user, setChangePassword, ...props }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      oldpassword: '',
      newpassword: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
  });


  const handleSubmit = () => {
    api.post(`api/auth/change_password/${user?.username}`, formik.values)
    .then((response) => {
      console.log(response);
      setChangePassword(false);
      formik.resetForm(formik.initialValues);
      enqueueSnackbar("Password has been successfully changed.", {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    })
    .catch((error) => {
      console.log(error.response);
      formik.resetForm(formik.initialValues);
      enqueueSnackbar("Unable to change password at this time.", {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      }); 
    });
  };



  const handleChange = (event) => {
    const {name,value} = event.target;
    formik.setFieldValue(name,value);
    formik.setFieldTouched(name);
  };

  const handleFocus = (event) => {
    const {name,value} = event.target;
    formik.setFieldValue(name,value);
    formik.setFieldTouched(name);
  };

  const handleBlur = (event) => {
    const {name,value} = event.target;
    formik.setFieldValue(name,value);
  };


 
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: '100%', bgcolor: '#2D3436', boxShadow: 'none', pb: 2 }}>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: "90%", mt: 5, mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                OLD PASSWORD
              </Typography>
              <TextField
                id="oldpassword"
                name="oldpassword"
                label="Old Password"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                type="password"
                value={formik.values.oldpassword}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.oldpassword && Boolean(formik.errors.oldpassword)}
                helperText={formik.touched.oldpassword && formik.errors.oldpassword}
                InputProps={{
                  disableUnderline: true,
                  sx: {font: '20px VT323', fontWeight: 'bold',  color: '#A8E4A0'},
                }}
                InputLabelProps={{ 
                  sx: {font: '20px VT323', fontWeight: 'bold', color: '#8B8589', "&.Mui-focused": { color: '#DBD7D2' }},
                  margin: 'dense',
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                NEW PASSWORD
              </Typography>
              <TextField
                id="newpassword"
                name="newpassword"
                label="New Password"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                type="password"
                value={formik.values.newpassword}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.newpassword && Boolean(formik.errors.newpassword)}
                helperText={formik.touched.newpassword && formik.errors.newpassword}
                InputProps={{
                  disableUnderline: true,
                  sx: {font: '20px VT323', fontWeight: 'bold',  color: '#A8E4A0'},
                }}
                InputLabelProps={{ 
                  sx: {font: '20px VT323', fontWeight: 'bold', color: '#8B8589', "&.Mui-focused": { color: '#DBD7D2' }},
                  margin: 'dense',
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Stack direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={ !formik.isValid || formik.isSubmitting || !formik.dirty }
              sx={{  
                font: '24px Aldrich',
                fontWeight: 'bold',
                color: '#A8E4A0',
                textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                height: '45px',
                background: 'none',
                border: '3px solid #A8E4A0',
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
              Submit
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setChangePassword(false)}
              sx={{  
                font: '24px Aldrich',
                fontWeight: 'bold',
                color: '#F0E130',
                textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                height: '45px',
                background: 'none',
                border: '3px solid #F0E130',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                pt: 1,
                '&:hover': { 
                  fontWeight: 'bold',
                  color: '#F0E130', 
                  background: 'none',
                  border: '3px solid #F0E130',
                  transform: 'scale(1.05)',
                  boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </React.Fragment>
  );
};


export default ChangePassword;


const validationSchema = yup.object().shape({
  oldpassword: yup
    .string()
    .required('Old Password is required.'),
  newpassword: yup
    .string()
    .required('New Password is required.')
    .min(8, 'Password must be at least 8 characters.')
});


const loginFailMsg = (
  <Typography sx={{ font: '22px VT323' }}>
    Invalid username or password. Please try again.
  </Typography>
);