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

export const status = {
  Accepted: 'ACCEPTED',
  Arrived: 'ARRIVED',
  Confirmed: 'CONFIRMED',
  InProgress: 'IN PROGRESS',
  WorkCompleted: 'WORK COMPLETED',
  Finished: 'FINISHED',
  Canceled: 'CANCELED',
};

export const moneyFormat = {
  symbol: 'VNĐ',
  format: '%v %s',
  decimal: 0,
  thousand: '.',
  precision: 0,
};

export const requestStateMachineConfig = {
  init: 'ACCEPTED',
  transitions: [
    { name: 'cancel', from: ['ACCEPTED', 'ARRIVED'], to: 'CANCELED' },
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
