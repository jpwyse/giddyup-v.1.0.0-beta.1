import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import api from '../axios/api';
import { signup } from '../redux/actions/auth';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const SignUp = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      dob: '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
  });


  useEffect(() => {
    if (isAuth && user) {
      setSubmitting(false);
      navigate("../dashboard/zerodte", { replace: true });
      setTimeout(() => {
        enqueueSnackbar(signUpSuccess, {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 4000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      }, 500);
    }
  }, [isAuth, user]);


  const handleSubmit = () => {
    dispatch(signup(formik.values));
    setSubmitting(true);
    setTimeout(() => {
      if (!isAuth && !user) {
        formik.resetForm(formik.initialValues);
        enqueueSnackbar(signUpErrorMsg, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 4000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        setSubmitting(false);
      }
    }, 5000);
  };


  const checkDuplicates = async (value, name) => {
    const { response } = await api.get(`api/auth/unique/${value}`)
    .then((response) => {
      const data = response.data;
      if (!data) {
        formik.setFieldError(name, `This ${name} is already registered.`);
      } 
      return data;
    });
  };

  const handleChange = (event) => {
    const {name,value} = event.target;
    formik.setFieldValue(name,value);
    formik.setFieldTouched(name);

    if (value) {
      if (name === 'username' || name === 'email') {
        checkDuplicates(value, name);
      }
    }
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: formik.isValid ? 600 : 680, width: { xs: 325, md: '22%' }, bgcolor: '#2D3436', boxShadow: 'rgba(200, 200, 200, 0.16) 0px 3px 6px, rgba(200, 200, 200, 0.23) 0px 3px 6px;', borderRadius: '12px', border: '4px solid #555555', mt: 20, p: 2 }}>
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ my: 3 }}>
          <Typography sx={{ font: '58px Aldrich', color: '#8884D8', textShadow: '2px 4px 4px rgba(0,0,0,0.9)', my: 1 }}>
            SIGN UP
          </Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 2, width: "90%" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                FIRST NAME
              </Typography>
              <TextField
                id="firstname"
                name="firstname"
                label="First Name"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                value={formik.values.firstname}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                helperText={formik.touched.firstname && formik.errors.firstname}
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
            <Grid item xs={6}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                LAST NAME
              </Typography>
              <TextField
                id="lastname"
                name="lastname"
                label="Last Name"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                value={formik.values.lastname}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                helperText={formik.touched.lastname && formik.errors.lastname}
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
                EMAIL
              </Typography>
              <TextField
                id="email"
                name="email"
                label="Email"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                value={formik.values.email}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
            <Grid item xs={6}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                USERNAME
              </Typography>
              <TextField
                id="username"
                name="username"
                label="Username"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
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
            <Grid item xs={6}>
              <Typography sx={{ font: '16px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '4px 3px 4px rgba(0,0,0,0.5)' }}>
                DATE OF BIRTH
              </Typography>
              <TextField
                id="dob"
                name="dob"
                label="DOB"
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                type="date"
                value={formik.values.dob}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formik.touched.dob && Boolean(formik.errors.dob )}
                helperText={formik.touched.dob  && formik.errors.dob }
                InputProps={{
                  disableUnderline: true,
                  sx: {font: '20px VT323', fontWeight: 'bold',  color: formik.values.dob !== '' ? '#A8E4A0' : '#8B8589'},
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
                id="password"
                name="password"
                label="Password"
                required
                fullWidth
                size="small"
                variant="filled"
                margin="dense"
                type="password"
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
              SignUp
            </Button>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};


export default SignUp;


const validationSchema = yup.object().shape({
  firstname: yup
    .string('Enter your first name.')
    .matches(/^[aA-zZ\s]+$/, "First name cannot contain spaces or special characters.")
    .required('First name is required.'),
  lastname: yup
    .string('Enter your last name.')
    .matches(/^[aA-zZ\s]+$/, "Last name cannot contain spaces or special characters.")
    .required('Last name is required.'),
  username: yup
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .required('Username is required.'),
  email: yup
    .string('Enter your email.')
    .email('Enter a valid email.')
    .required('Email is required.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
});


const signUpErrorMsg = (
  <Typography sx={{ font: '22px VT323' }}>
    Error with signup form. Please check fields and try again.
  </Typography>
);

const signUpSuccess = (
  <Typography sx={{ font: '22px VT323', color: '#F8F8FF', fontWeight: 'bold' }}>
    Your account has been successfully created. 
  </Typography>
);