import React from "react";
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import ZeroDte from '../pages/ZeroDte';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Account from '../pages/Account';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';


const routes = () => [
  { 
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        path: "dashboard", 
        element: <Dashboard />, 
        children : [
          { path: 'zerodte', element: <ZeroDte /> },
          { path: 'account', element: <Account /> },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];


export default routes;