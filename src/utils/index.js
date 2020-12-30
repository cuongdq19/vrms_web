import accounting from 'accounting';

import { moneyFormat, status } from './constants';

export const updateObject = (oldState, newProps) => {
  return { ...oldState, ...newProps };
};

export const generateUserRoleColor = (roleName) => {
  switch (roleName) {
    case 'MANAGER':
      return 'red';
    case 'STAFF':
      return 'green';
    case 'TECHNICIAN':
      return 'yellow';
    default:
      return 'default';
  }
};

export const calculateRequestPrice = (request) => {
  const { services } = request;

  const servicesPrice = services.reduce((curr, service) => {
    const { servicePrice, parts } = service;
    const partsPrice = parts.reduce((curr, part) => {
      return curr + part.price * part.quantity;
    }, 0);

    return curr + servicePrice + partsPrice;
  }, 0);
  return {
    services: servicesPrice,
    total: servicesPrice,
  };
};

export const formatMoney = (money) => {
  return accounting.formatMoney(money, moneyFormat);
};

export const generateRequestStatusColor = (stat) => {
  switch (stat) {
    case status.Accepted:
      return 'default';
    case status.Arrived:
      return '#0094FF';
    case status.Confirmed:
      return '#FF6A00';
    case status.Canceled:
      return '#FF6F6F';
    case status.InProgress:
      return '#0026FF';
    case status.WorkCompleted:
      return '#00FF90';
    case status.Finished:
      return '#00FF21';
    default:
      return 'default';
  }
};
