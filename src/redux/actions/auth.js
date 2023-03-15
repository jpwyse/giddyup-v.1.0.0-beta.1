import api from '../../axios/api';
import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOADING,
} from '../actions/types';


// SIGNUP USER
export const signup = ({ firstname, lastname, email, username, dob, password }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ firstname, lastname, email, username, dob, password });

  api
    .post('/api/auth/signup', body, config)
    .then((response) => {
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: response,
      });
    })
    .catch((error) => {
      dispatch({
        type: SIGNUP_FAIL,
        payload: error.response,
      });
    });
};


// LOGIN USER
export const login = ({ username, password }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ username, password });

  api
    .post('/api/auth/login', body, config)
    .then((response) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response,
      });
    })
    .catch((error) => {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response,
      });
    });
};


// AUTHENTICATE USER
export const authenticate = () => (dispatch, getState) => {
  dispatch({ type: LOADING });

  api
    .get('/api/auth/user_auth', tokenConfig(getState))
    .then((response) => {
      dispatch({
        type: AUTH_SUCCESS,
        payload: response,
      });
    })
    .catch((error) => {
      dispatch({
        type: AUTH_FAIL,
        payload: error.response,
      });
    });
};



// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  api
    .get('/api/auth/logout', tokenConfig(getState))
    .then((response) => {
      dispatch({
        type: LOGOUT_SUCCESS,
        payload: response,
      });
    })
    .catch((error) => {
      dispatch({
        type: LOGOUT_SUCCESS,
        payload: error.response,
      });
    });
};



// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // Get token from state
  const token = getState().auth.token;
  
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  } 
  return config;
};
