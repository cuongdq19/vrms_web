import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Contracts from '../containers/Contracts';
import Dashboard from '../containers/Dashboard';
import Parts from '../containers/Parts';
import Services from '../containers/Services';
import SignIn from '../containers/SignIn';
import Users from '../containers/Users';
import _404 from '../containers/_404';

const publicRoutes = [
  { key: 'sign-in', path: '/sign-in', exact: true, component: SignIn },
];

const adminRoutes = [
  {
    key: 'contracts',
    path: '/contracts',
    exact: true,
    component: Contracts,
  },
];

const providerRoutes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard,
  },
  {
    key: 'services',
    path: '/services',
    exact: true,
    component: Services,
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
  {
    key: 'parts',
    path: '/parts',
    exact: true,
    component: Parts,
  },
];

const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...adminRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute
      roles={['ADMIN']}
      key={key}
      exact={exact}
      path={path}
      component={component}
    />
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
  <Route key="_404" component={_404} />,
];

export default routes;
