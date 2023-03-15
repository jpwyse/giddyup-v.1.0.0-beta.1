import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import "@fontsource/vt323";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { login } from '../redux/actions/auth';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const Login = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
  });

  useEffect(() => {
    if (formik.dirty && submitting && isAuth && user) {
      navigate("../dashboard/zerodte", { replace: true });
      setSubmitting(false);
    } else if (formik.dirty && submitting && !isAuth && !user) {
      formik.resetForm(formik.initialValues);
      enqueueSnackbar(loginFailMsg, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
      setSubmitting(false);
    } else {
      //pass
    }
  }, [submitting, isAuth, user]);


  const handleSubmit = () => {
    dispatch(login(formik.values));
    setTimeout(() => {
      setSubmitting(true);
    }, 500);
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: formik.isValid ? 460 : 480, width: { xs: 325, md: '21%' }, bgcolor: '#2D3436', boxShadow: 'rgba(200, 200, 200, 0.16) 0px 3px 6px, rgba(200, 200, 200, 0.23) 0px 3px 6px;', borderRadius: '12px', border: '4px solid #555555', mt: 20, p: 2 }}>
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ my: 3 }}>
          <Typography sx={{ font: '58px Aldrich', color: '#8884D8', textShadow: '2px 4px 4px rgba(0,0,0,0.9)', my: 1 }}>
            LOGIN
          </Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 2, width: "90%" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                USERNAME
              </Typography>
              <TextField
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
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
                PASSWORD
              </Typography>
              <TextField
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                type="password"
                id="password"
                name="password"
                label="Password"
                value={formik.values.password}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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
            <Button
              type="submit"
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={ !formik.isValid || formik.isSubmitting || submitting }
              sx={{  
                font: '24px Aldrich',
                fontWeight: 'bold',
                color: '#8884D8',
                textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                height: '45px',
                background: 'none',
                border: '3px solid #8884D8',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                m: "auto",
                mt: 5,
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
              Login
            </Button>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};


export default Login;


const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .required('Username is required.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
});


const loginFailMsg = (
  <Typography sx={{ font: '22px VT323' }}>
    Invalid username or password. Please try again.
  </Typography>
);