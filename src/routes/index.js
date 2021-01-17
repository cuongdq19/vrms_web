import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/private-route/private-route.component';
import ContractsCollection from '../pages/contracts-collection/contracts-collection.component';
import Dashboard from '../pages/dashboard/dashboard.component';
import PackagesCollection from '../pages/packages-collection/packages-collection.component';
import PartsCollection from '../pages/parts-collection/parts-collection.component';
import ServiceCreateAndUpdate from '../pages/service-create-and-update/service-create-and-update.component';
import RequestsCollection from '../pages/requests-collection/requests-collection.component';
import ServicesCollection from '../pages/services-collection/services-collection.component';
import SignIn from '../pages/sign-in/sign-in.component';
import UsersCollection from '../pages/users-collection/users-collection.component';
import _403 from '../pages/_403/_403.component';
import _404 from '../pages/_404/_404.component';
import SignUp from '../pages/sign-up/sign-up.component';
import ContractResolve from '../pages/contract-resolve/contract-resolve.component';
import ProvidersCollection from '../pages/providers-collection/providers-collection.component';
import PackageCreateAndUpdate from '../pages/package-create-and-update/package-create-and-update.component';
import RequestUpdatePage from '../pages/request-update-page/request-update-page.component';
import RequestUpdateWithIncurredPage from '../pages/request-update-with-incurred-page/request-update-with-incurred-page.component';

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
  {
    key: 'providers',
    path: '/providers',
    exact: true,
    component: ProvidersCollection,
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
    component: ServiceCreateAndUpdate,
  },
  {
    key: 'update-service',
    path: '/services/:serviceId',
    exact: true,
    component: ServiceCreateAndUpdate,
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
    component: PackageCreateAndUpdate,
  },
  {
    key: 'update-package',
    path: '/packages/:packageId',
    exact: true,
    component: PackageCreateAndUpdate,
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
    component: RequestUpdatePage,
  },
  {
    key: 'update-request-incurred',
    path: '/requests/:requestId/incurred',
    exact: true,
    component: RequestUpdateWithIncurredPage,
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
