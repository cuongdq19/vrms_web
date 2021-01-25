import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from '../components/private-route/private-route.component';

import SignIn from '../pages/sign-in/sign-in.component';
import SignUp from '../pages/sign-up/sign-up.component';
import Dashboard from '../pages/dashboard/dashboard.component';

import ContractsPage from '../pages/contracts/contracts.component';
import ContractResolve from '../pages/contract-resolve/contract-resolve.component';
import Feedbacks from '../pages/feedbacks/feedbacks.component';
import Profile from '../pages/profile/profile.component';

import VehiclePartsPage from '../pages/vehicle-parts/vehicle-parts.component';

import ServicesPage from '../pages/services/services.component';
import CreateAndUpdateServicePage from '../pages/create-and-update-service/create-and-update-service.component';

import MaintenancePackagesPage from '../pages/maintenance-packages/maintenance-packages.component';
import CreateAndUpdatePackagePage from '../pages/create-and-update-package/create-and-update-package.component';

import RequestsPage from '../pages/requests/requests.component';
import UpdateRequestPage from '../pages/update-request/update-request.component';
import UpdateRequestWithIncurredPage from '../pages/update-request-with-incurred/update-request-with-incurred.component';

import UsersPage from '../pages/users/users.component';

import ProvidersPage from '../pages/providers/providers.component';

import _403 from '../pages/_403/_403.component';
import _404 from '../pages/_404/_404.component';

const publicRoutes = [
  { key: 'sign-in', path: '/sign-in', exact: true, component: SignIn },
  { key: 'sign-up', path: '/sign-up', exact: true, component: SignUp },
];

const adminRoutes = [
  {
    key: 'contracts',
    path: '/contracts',
    exact: true,
    component: ContractsPage,
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
    component: ProvidersPage,
  },
];

const adminManagerStaffRoutes = [
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
  {
    key: 'profile',
    path: '/profile',
    exact: true,
    component: Profile,
  },
];

const managerStaffRoutes = [
  {
    key: 'services',
    path: '/services',
    exact: true,
    component: ServicesPage,
  },
  {
    key: 'add-service',
    path: '/services/add',
    exact: true,
    component: CreateAndUpdateServicePage,
  },
  {
    key: 'update-service',
    path: '/services/:serviceId',
    exact: true,
    component: CreateAndUpdateServicePage,
  },
  {
    key: 'packages',
    path: '/packages',
    exact: true,
    component: MaintenancePackagesPage,
  },
  {
    key: 'add-package',
    path: '/packages/add',
    exact: true,
    component: CreateAndUpdatePackagePage,
  },
  {
    key: 'update-package',
    path: '/packages/:packageId',
    exact: true,
    component: CreateAndUpdatePackagePage,
  },

  {
    key: 'parts',
    path: '/parts',
    exact: true,
    component: VehiclePartsPage,
  },
  {
    key: 'staffs',
    path: '/staffs',
    exact: true,
    component: UsersPage,
  },
  {
    key: 'technicians',
    path: '/technicians',
    exact: true,
    component: UsersPage,
  },
  {
    key: 'requests',
    path: '/requests',
    exact: true,
    component: RequestsPage,
  },
  {
    key: 'feedbacks',
    path: '/feedbacks',
    exact: true,
    component: Feedbacks,
  },
  {
    key: 'update-request',
    path: '/requests/:requestId',
    exact: true,
    component: UpdateRequestPage,
  },
  {
    key: 'update-request-incurred',
    path: '/requests/:requestId/incurred',
    exact: true,
    component: UpdateRequestWithIncurredPage,
  },
];

const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...adminManagerStaffRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute
      roles={['ADMIN', 'MANAGER', 'STAFF']}
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
  ...managerStaffRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute
      roles={['MANAGER', 'STAFF']}
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
