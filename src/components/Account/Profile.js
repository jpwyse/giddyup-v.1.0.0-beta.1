import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { authenticate } from '../../redux/actions/auth';
import api from '../../axios/api';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChangePassword from '../Account/ChangePassword';


const Profile = ({user, ...props}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [editProfile, setEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);  
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      first_name: null,
      last_name: null,
      email: null,
      username: null,
      dob: null,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
  });



  const handleSubmit = () => {
    console.log(formik.values);
    api.post(`api/auth/edit_profile/${user?.id}`, formik.values)
    .then((response) => {
      console.log(response);
      dispatch(authenticate());
      enqueueSnackbar("Profile has been successfully updated.", {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
      setTimeout(() => {
        setEditProfile(false);
        formik.resetForm(formik.initialValues);
      }, 500);
    })
    .catch((error) => {
      console.log(error.response);
      formik.resetForm(formik.initialValues);
      enqueueSnackbar("Error updating profile.", {
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


  const handleDeleteAccount = () => {
    api.get(`api/auth/delete_account/${user?.id}`)
    .then((response) => {
      console.log(response);
      navigate("/signup", { replace: true });
      formik.resetForm(formik.initialValues);
      enqueueSnackbar("Account has been successfully deleted. Ciao bella!", {
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
      enqueueSnackbar("Unable to delete account at this time. Please try again later.", {
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

  const deleteNotice = (
    <Dialog open={deleteAlert} onClose={() => setDeleteAlert(false)}>
      <DialogTitle sx={{ bgcolor: '#2D3436' }}>{deleteMsg}</DialogTitle>
      <DialogActions sx={{ bgcolor: '#2D3436' }}>
        <Button 
          variant="contained" 
          onClick={() => setDeleteAlert(false)}
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#A8E4A0',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #A8E4A0',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            mr: 1.5,
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
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleDeleteAccount}
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#DC143C',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #DC143C',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            mr: 1.5,
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#DC143C', 
              background: 'none',
              border: '3px solid #DC143C',
              transform: 'scale(1.05)',
              boxShadow: 'rgba(220, 20, 60, 0.19) 0px 10px 20px, rgba(220, 20, 60, 0.23) 0px 6px 6px;',
            }
          }}
        >
          Delete Account 
        </Button>
      </DialogActions>
    </Dialog>
  );


  return (
    <Card sx={{ width: '100%', height: '100%', background: 'linear-gradient(315deg, #2d3436 0%, #000000 74%);', mt: -1  }}>
      {deleteNotice}
      <CardContent>
        { !changePassword ?
          <Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={4}>
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ mb: editProfile ? -2 : 0 }}>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', textShadow: '3px 2px 2px rgba(245,245,245,0.5)' }}>
                Name:
              </Typography>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 1px 1px rgba(245,245,245,0.5)' }}>
                {user?.first_name} {user?.last_name}
              </Typography>
            </Stack>
            { editProfile ?
              <Stack direction="row" alignItems="baseline" justifyContent="flex-start" spacing={2}>
                <TextField
                  id="first_name"
                  name="first_name"
                  label="New First Name"
                  required
                  fullWidth
                  size="small"
                  variant="filled"
                  margin="dense"
                  value={formik.values.first_name}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  InputProps={{
                    disableUnderline: true,
                    sx: {font: '20px VT323', fontWeight: 'bold',  color: '#A8E4A0'},
                  }}
                  InputLabelProps={{ 
                    sx: {font: '20px VT323', fontWeight: 'bold', color: '#8B8589', "&.Mui-focused": { color: '#DBD7D2' }},
                    margin: 'dense',
                    shrink: true,
                  }}
                  sx={{ border: '1px solid #F8F8FF', width: 250 }}
                />
                <TextField
                  id="last_name"
                  name="last_name"
                  label="New Last Name"
                  required
                  fullWidth
                  size="small"
                  variant="filled"
                  margin="dense"
                  value={formik.values.last_name}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  InputProps={{
                    disableUnderline: true,
                    sx: {font: '20px VT323', fontWeight: 'bold',  color: '#A8E4A0'},
                  }}
                  InputLabelProps={{ 
                    sx: {font: '20px VT323', fontWeight: 'bold', color: '#8B8589', "&.Mui-focused": { color: '#DBD7D2' }},
                    margin: 'dense',
                    shrink: true,
                  }}
                  sx={{ border: '1px solid #F8F8FF', width: 250 }}
                />
              </Stack>
            : null }
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', textShadow: '3px 2px 2px rgba(245,245,245,0.5)' }}>
                Email:
              </Typography>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 1px 1px rgba(245,245,245,0.5)' }}>
                {user?.email}
              </Typography>
            </Stack>
            { editProfile ?
              <Stack direction="row" alignItems="baseline" justifyContent="flex-start" spacing={2}>
                <TextField
                  id="email"
                  name="email"
                  label="New Email"
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
                  sx={{ border: '1px solid #F8F8FF', width: 250, mt: -1 }}
                />
              </Stack>
            : null }
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', textShadow: '3px 2px 2px rgba(245,245,245,0.5)' }}>
                Username:
              </Typography>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 1px 1px rgba(245,245,245,0.5)' }}>
                {user?.username}
              </Typography>
            </Stack>
            { editProfile ?
              <Stack direction="row" alignItems="baseline" justifyContent="flex-start" spacing={2}>
                <TextField
                  id="username"
                  name="username"
                  label="New Username"
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
                  sx={{ border: '1px solid #F8F8FF', width: 250, mt: -1 }}
                />
              </Stack>
            : null }
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', textShadow: '3px 2px 2px rgba(245,245,245,0.5)' }}>
                Date of Birth:
              </Typography>
              <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 1px 1px rgba(245,245,245,0.5)' }}>
                {user?.dob}
              </Typography>
            </Stack>
            { editProfile ?
              <Stack direction="row" alignItems="baseline" justifyContent="flex-start" spacing={2}>
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
                  sx={{ border: '1px solid #F8F8FF', width: 250, mt: -1 }}
                />
              </Stack>
            : null }
            { !editProfile ?
              <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', textShadow: '3px 2px 2px rgba(245,245,245,0.5)' }}>
                  Date Joined: 
                </Typography>
                 <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 1px 1px rgba(245,245,245,0.5)' }}>
                  {user?.date_joined} 
                </Typography>
              </Stack>
            : null }
            { editProfile ?
              <Stack direction="row" alignItems="baseline" justifyContent="flex-start" spacing={3}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit}
                  disabled={ !formik.isValid || formik.isSubmitting || !formik.dirty }
                  sx={{  
                    font: '22px Aldrich',
                    fontWeight: 'bold',
                    color: '#A8E4A0',
                    textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                    height: '45px',
                    background: 'none',
                    border: '3px solid #A8E4A0',
                    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                    m: "auto",
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
                  Update Profile
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setEditProfile(false)}
                  sx={{  
                    font: '22px Aldrich',
                    fontWeight: 'bold',
                    color: '#F0E130',
                    textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                    height: '45px',
                    background: 'none',
                    border: '3px solid #F0E130',
                    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                    m: "auto",
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
            : null }
          </Stack>
        : 
          <ChangePassword user={user} setChangePassword={setChangePassword} />
        }
        <Divider sx={{ bgcolor: '#F8F8FF', mt: 3 }} />
      </CardContent>
      <CardActions>
        <Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={2.5} sx={{ my: 1, mx: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setEditProfile(!editProfile)}
            sx={{  
              font: '22px Aldrich',
              fontWeight: 'bold',
              color: '#F8F8FF',
              textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
              height: '40px',
              background: 'none',
              border: '2px solid #F8F8FF',
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
              pt: 1,
              '&:hover': { 
                fontWeight: 'bold',
                color: '#F0E130', 
                background: 'none',
                border: '3px solid #F0E130',
                transform: 'scale(1.03)',
                boxShadow: 'rgba(248, 248, 255, 0.19) 0px 10px 20px, rgba(248, 248, 255, 0.23) 0px 6px 6px;',
              }
            }}
          >
           Edit Profile
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setChangePassword(!changePassword)}
            sx={{  
              font: '22px Aldrich',
              fontWeight: 'bold',
              color: '#F8F8FF',
              textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
              height: '40px',
              background: 'none',
              border: '2px solid #F8F8FF',
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
              pt: 1,
              '&:hover': { 
                fontWeight: 'bold',
                color: '#FFA500', 
                background: 'none',
                border: '3px solid #FFA500',
                transform: 'scale(1.03)',
                boxShadow: 'rgba(248, 248, 255, 0.19) 0px 10px 20px, rgba(248, 248, 255, 0.23) 0px 6px 6px;',
              }
            }}
          >
           Change Password
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setDeleteAlert(true)}
            sx={{  
              font: '22px Aldrich',
              fontWeight: 'bold',
              color: '#F8F8FF',
              textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
              height: '40px',
              background: 'none',
              border: '2px solid #F8F8FF',
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
              pt: 1.25,
              '&:hover': { 
                fontWeight: 'bold',
                color: '#DC143C', 
                background: 'none',
                border: '3px solid #DC143C',
                transform: 'scale(1.03)',
                boxShadow: 'rgba(248, 248, 255, 0.19) 0px 10px 20px, rgba(248, 248, 255, 0.23) 0px 6px 6px;',
              }
            }}
          >
           Delete Account
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default Profile;

const deleteMsg = (
  <React.Fragment>
    <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#DC143C', lineHeight: 1.25, mb: 2 }}>
      ALERT:
    </Typography>
    <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', lineHeight: 1.25, mb: 2 }}>
      Are you sure you wish to delete your account? This action cannot be undone no takebacks.
    </Typography>
  </React.Fragment>
);


const validationSchema = yup.object().shape({
  firstname: yup
    .string('Enter your first name.')
    .matches(/^[aA-zZ\s]+$/, "First name cannot contain spaces or special characters.")
    .nullable(),
  lastname: yup
    .string('Enter your last name.')
    .matches(/^[aA-zZ\s]+$/, "Last name cannot contain spaces or special characters.")
    .nullable(),
  username: yup
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .nullable(),
  email: yup
    .string('Enter your email.')
    .email('Enter a valid email.')
    .nullable(),
});