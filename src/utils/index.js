import accounting from 'accounting';

import { contractStatus, moneyFormat, requestStatus } from './constants';

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
  const { services = [], packages = [] } = request;

  const servicesPrice = services
    .filter((service) => service.isActive)
    .reduce((curr, service) => {
      const { servicePrice, parts } = service;
      const partsPrice = parts.reduce((curr, part) => {
        return curr + part.price * part.quantity;
      }, 0);

      return curr + servicePrice + partsPrice;
    }, 0);

  const packagesPrice = packages.reduce((curr, item) => {
    const { services = [] } = item;

    const packagePrice = services
      .filter((service) => service.isActive)
      .reduce((curr, service) => {
        const { servicePrice, parts } = service;
        const partsPrice = parts.reduce((curr, part) => {
          return curr + part.price * part.quantity;
        }, 0);

        return curr + servicePrice + partsPrice;
      }, 0);

    return curr + packagePrice;
  }, 0);

  return {
    services: servicesPrice,
    packages: packagesPrice,
    total: servicesPrice + packagesPrice,
  };
};

export const formatMoney = (money) => {
  return accounting.formatMoney(money, moneyFormat);
};

export const generateRequestStatusColor = (stat) => {
  switch (stat) {
    case requestStatus.Accepted:
      return 'default';
    case requestStatus.Arrived:
      return '#0094FF';
    case requestStatus.Confirmed:
      return '#FF6A00';
    case requestStatus.Canceled:
      return '#FF6F6F';
    case requestStatus.InProgress:
      return '#0026FF';
    case requestStatus.WorkCompleted:
      return '#00FF90';
    case requestStatus.Finished:
      return '#41C197';
    default:
      return 'default';
  }
};

export const generateContractStatusColor = (stat) => {
  switch (stat) {
    case contractStatus.Pending:
      return 'default';
    case contractStatus.Resolved:
      return '#41C197';
    case contractStatus.Denied:
      return '#FF6F6F';
    case contractStatus.Confirmed:
      return '#345FFF';
    default:
      return 'default';
  }
};

export const calculateServicePrice = (service) => {
  const { parts, price } = service;
  const partsPrice = parts.reduce(
    (accumulatedPrice, part) => accumulatedPrice + part.price * part.quantity,
    0
  );
  return price + partsPrice;
};

export const calculatePackagePrice = (item) => {
  return item.services.reduce((accumulatedPrice, item) => {
    return accumulatedPrice + calculateServicePrice(item);
  }, 0);
};

export const roundNumberToHalf = (number) => Math.round(number * 2) / 2;

export const modelToString = (model) => {
  return `${model.manufacturerName} ${model.name} ${model.fuelType} ${model.gearbox} (${model.year})`;
};

export const nonAccentVietnamese = (str) => {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  str = str.replace(
    /\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g,
    'a'
  );
  str = str.replace(
    /\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g,
    'e'
  );
  str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, 'i');
  str = str.replace(
    /\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g,
    'o'
  );
  str = str.replace(
    /\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g,
    'u'
  );
  str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, 'y');
  str = str.replace(/\u0111/g, 'd');

  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};
