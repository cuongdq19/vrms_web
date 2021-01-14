export const roles = {
  Manager: 'MANAGER',
  Staff: 'STAFF',
  Technician: 'TECHNICIAN',
  Admin: 'ADMIN',
};

export const providerRoles = {
  Staff: 'STAFF',
  Technician: 'TECHNICIAN',
};

export const gender = {
  Male: true,
  Female: false,
};

export const pageSize = 12;

export const requestStatus = {
  Accepted: 'ACCEPTED',
  Arrived: 'ARRIVED',
  Confirmed: 'CONFIRMED',
  InProgress: 'IN PROGRESS',
  WorkCompleted: 'WORK COMPLETED',
  Finished: 'FINISHED',
  Canceled: 'CANCELED',
};

export const contractStatus = {
  Pending: 'PENDING',
  Confirmed: 'CONFIRMED',
  Resolved: 'RESOLVED',
  Denied: 'DENIED',
};

export const moneyFormat = {
  symbol: 'VNĐ',
  format: '%v %s',
  decimal: 0,
  thousand: '.',
  precision: 0,
};

export const requestStateMachineConfig = {
  transitions: [
    {
      name: 'cancel',
      from: ['ACCEPTED', 'ARRIVED', 'CONFIRMED'],
      to: 'CANCELED',
    },
    { name: 'checkIn', from: 'ACCEPTED', to: 'ARRIVED' },
    { name: 'confirm', from: 'ARRIVED', to: 'CONFIRMED' },
    { name: 'done', from: 'CONFIRMED', to: 'WORK COMPLETED' },
    { name: 'checkOut', from: 'WORK COMPLETED', to: 'FINISHED' },
  ],
  methods: {
    onCancel: () => {
      console.log('Request canceled');
    },
    onCheckIn: () => {
      console.log('Request checked in');
    },
    onConfirm: () => {
      console.log('Request confirmed');
    },
    onDone: () => {
      console.log('Request done');
    },
    onCheckOut: () => {
      console.log('Request checked out');
    },
  },
};

export const ITEM_TYPES = {
  existed: 0,
  expense: 1,
  package: 2,
};

export const notificationActions = {
  CREATE_REQUEST: 'CREATE_REQUEST',
};

export const getRouteOnNotificationClicked = (action, data) => {
  switch (action) {
    case notificationActions.CREATE_REQUEST:
      return '/requests';
    default:
      return '/';
  }
};

export const requestModals = {
  checkIn: 'checkIn',
  confirm: 'confirm',
  checkout: 'checkout',
};
