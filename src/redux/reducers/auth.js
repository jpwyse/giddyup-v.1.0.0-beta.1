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

const initialState = {
  isLoading: false,
  isAuth: false,
  user: null,
  token: localStorage.getItem('token'),
};


export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.data.token_key);
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        user: action.payload.data.user,
        token: action.payload.data.token_key, 
      };
    case AUTH_FAIL:
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuth: false,
        user: null,
        token: null,
      };
    case LOADING:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}