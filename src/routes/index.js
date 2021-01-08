import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/private-route/private-route.component';
import ContractsCollection from '../containers/contracts-collection/contracts-collection.component';
import Dashboard from '../containers/dashboard/dashboard.component';
import PackagesCollection from '../containers/packages-collection/packages-collection.component';
import PartsCollection from '../containers/parts-collection/parts-collection.component';
import ServiceForm from '../containers/service-form/service-form.component';
import RequestsCollection from '../containers/requests-collection/requests-collection.component';
import ServicesCollection from '../containers/services-collection/services-collection.component';
import SignIn from '../containers/sign-in/sign-in.component';
import UsersCollection from '../containers/users-collection/users-collection.component';
import _403 from '../containers/_403/_403.component';
import _404 from '../containers/_404/_404.component';
import RequestUpdate from '../containers/request-update/request-update.component';
import RequestUpdateIncurred from '../containers/request-update-incurred/request-update-incurred.component';
import PackageCreate from '../containers/package-create/package-create.component';
import PackageUpdate from '../containers/package-update/package-update.component';
import SignUp from '../containers/sign-up/sign-up.component';
import ContractResolve from '../containers/contract-resolve/contract-resolve.component';

const publicRoutes = [
  { key: 'sign-in', path: '/sign-in', exact: true, component: SignIn },
  { key: 'sign-up', path: '/sign-up', exact: true, component: SignUp },
];

const adminRoutes = [
  {
    key: 'contracts',
    path: '/contracts',
    exact: true,
    component: ContractsCollection,
  },
  {
    key: 'contracts',
    path: '/contracts/:contractId',
    exact: true,
    component: ContractResolve,
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
    component: ServicesCollection,
  },
  {
    key: 'add-service',
    path: '/services/add',
    exact: true,
    component: ServiceForm,
  },
  {
    key: 'update-service',
    path: '/services/:serviceId',
    exact: true,
    component: ServiceForm,
  },
  {
    key: 'packages',
    path: '/packages',
    exact: true,
    component: PackagesCollection,
  },
  {
    key: 'add-package',
    path: '/packages/add',
    exact: true,
    component: PackageCreate,
  },
  {
    key: 'update-package',
    path: '/packages/:packageId',
    exact: true,
    component: PackageUpdate,
  },
  {
    key: 'staffs',
    path: '/staffs',
    exact: true,
    component: UsersCollection,
  },
  {
    key: 'technicians',
    path: '/technicians',
    exact: true,
    component: UsersCollection,
  },
  {
    key: 'customers',
    path: '/customers',
    exact: true,
    component: UsersCollection,
  },
  {
    key: 'parts',
    path: '/parts',
    exact: true,
    component: PartsCollection,
  },
  {
    key: 'requests',
    path: '/requests',
    exact: true,
    component: RequestsCollection,
  },
  {
    key: 'update-request',
    path: '/requests/:requestId',
    exact: true,
    component: RequestUpdate,
  },
  {
    key: 'update-request-incurred',
    path: '/requests/:requestId/incurred',
    exact: true,
    component: RequestUpdateIncurred,
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
