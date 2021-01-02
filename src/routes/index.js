import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Contracts from '../containers/Contracts';
import Dashboard from '../containers/Dashboard';
import Packages from '../containers/Packages';
import Parts from '../containers/Parts';
import Register from '../containers/Register';
import Requests from '../containers/Requests';
import Services from '../containers/Services';
import SignIn from '../containers/SignIn';
import Users from '../containers/Users';
import _403 from '../containers/_403';
import _404 from '../containers/_404';

const publicRoutes = [
  { key: 'sign-in', path: '/sign-in', exact: true, component: SignIn },
  { key: 'sign-up', path: '/sign-up', exact: true, component: Register },
];

const adminRoutes = [
  {
    key: 'contracts',
    path: '/contracts',
    exact: true,
    component: Contracts,
  },
];

const adminManagerRoutes = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: Dashboard,
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard,
  },
];

const providerRoutes = [
  {
    key: 'services',
    path: '/services',
    exact: true,
    component: Services,
  },
  {
    key: 'packages',
    path: '/packages',
    exact: true,
    component: Packages,
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
  {
    key: 'requests',
    path: '/requests',
    exact: true,
    component: Requests,
  },
  {
    key: 'packages',
    path: '/packages',
    exact: true,
    component: Packages,
  },
];

const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...adminManagerRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute
      roles={['ADMIN', 'MANAGER']}
      key={key}
      exact={exact}
      path={path}
      component={component}
    />
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
  <Route key="_403" component={_403} path="/forbidden" />,
  <Route key="_404" component={_404} />,
];

export default routes;
