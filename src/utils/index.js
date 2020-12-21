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
