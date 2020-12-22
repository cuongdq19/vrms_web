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

export const calculateTotalPrice = (request) => {
  const { parts, services } = request;
  const partsPrice = parts.reduce((curr, part) => {
    return curr + part.price;
  }, 0);
  const servicesPrice = services.reduce((curr, service) => {
    const {
      servicePrice,
      part: { price: partPrice },
    } = service;
    return curr + servicePrice + partPrice;
  }, 0);
  return partsPrice + servicesPrice;
};
