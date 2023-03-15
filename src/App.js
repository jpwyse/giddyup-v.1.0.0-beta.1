import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { authenticate } from './redux/actions/auth';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMsg from './segments/ErrorMsg';
import routes from './routes/routes';

const App = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const routing = useRoutes(routes(isAuth));

  useEffect(() => {
    if (location.pathname === '/') {
      navigate("../dashboard/zerodte", { replace: true });
    }
  }, [location]);

  useEffect(() => {
    dispatch(authenticate());
  }, []);

  return (
    <React.Fragment>
      <SnackbarProvider hideIconVariant>
        <ErrorBoundary FallbackComponent={ErrorMsg}>
          {routing}
        </ErrorBoundary>
      </SnackbarProvider>
    </React.Fragment>
  );
};

export default App;
