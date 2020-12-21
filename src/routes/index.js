import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../containers/Dashboard';
import SignIn from '../containers/SignIn';
import Users from '../containers/Users';

const publicRoutes = [
  { key: 'sign-in', path: '/sign-in', exact: true, component: SignIn },
];

const providerRoutes = [
  {
    key: 'home',
    path: '/dashboard',
    exact: true,
    component: Dashboard,
  },
  {
    key: 'staffs',
    path: '/staffs',
    exact: true,
    component: Users,
  },
  {
    key: 'technicians',
    path: '/technicians',
    exact: true,
    component: Users,
  },
  {
    key: 'customers',
    path: '/customers',
    exact: true,
    component: Users,
  },
];

const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...providerRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute
      roles={['MANAGER']}
      key={key}
      exact={exact}
      path={path}
      component={component}
    />
  )),
];

export default routes;
