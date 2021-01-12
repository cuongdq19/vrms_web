import { Button, message, Popconfirm, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import StateMachine from 'javascript-state-machine';

import http from '../../http';
import { Title, Content } from './requests-collection.styles';
import {
  calculateRequestPrice,
  formatMoney,
  generateRequestStatusColor,
} from '../../utils';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestConfirmModal from '../../components/request-confirm-modal/request-confirm-modal.component';
import RequestCheckInModal from '../../components/request-check-in-modal/request-check-in-modal.component';
import RequestCheckoutModal from '../../components/request-check-out-modal/request-check-out-modal.component';
import {
  requestStateMachineConfig,
  requestStatus,
} from '../../utils/constants';
import { getColumnSearchProps } from '../../utils/antd';

const RequestsCollection = ({ providerId, history }) => {
  const [modals, setModals] = useState({
    confirm: false,
    checkIn: false,
    checkout: false,
    item: null,
  });
  const [loading, setLoading] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: '' });
  };

  const requestCompletedHandler = (record) => {
    setLoading(true);
    http.get(`/requests/done/${record.id}`).then(() => {
      record.done();
      message.info('Canceled request.');
      fetchRequestsData();
    });
  };

  const requestCanceledHandler = (record) => {
    setLoading(true);
    http.delete(`/requests/${record.id}`).then(() => {
      record.cancel();
      message.success('Successfully complete.');
      fetchRequestsData();
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center' },
    {
      title: 'User Full Name',
      dataIndex: 'fullName',
      align: 'center',
      ...getColumnSearchProps('fullName', handleSearch, handleReset, search),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      align: 'center',
      ...getColumnSearchProps('phoneNumber', handleSearch, handleReset, search),
    },
    {
      align: 'center',
      title: 'Booking Time',
      dataIndex: 'bookingTime',
      render: (value) => moment.unix(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      defaultFilteredValue: Object.keys(requestStatus)
        .filter((key) => requestStatus[key] !== requestStatus.Canceled)
        .map((key) => requestStatus[key]),
      filters: Object.keys(requestStatus).map((key) => ({
        text: requestStatus[key],
        value: requestStatus[key],
      })),
      onFilter: (value, record) => record.status === value,
      render: (value) => {
        const color = generateRequestStatusColor(value);
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      align: 'center',
      title: 'Total Price',
      render: (_, record) => {
        const price = calculateRequestPrice({
          services: record.services.filter(({ isActive }) => isActive),
          packages: record.packages.map(({ services, ...rest }) => ({
            ...rest,
            services: services.filter(({ isActive }) => isActive),
          })),
        });
        return formatMoney(price.total);
      },
    },
    {
      align: 'center',
      title: 'Update',
      render: (_, record) => (
        <Button
          disabled={
            record.is('FINISHED') ||
            record.is('WORK COMPLETED') ||
            record.is('CANCELED')
          }
          onClick={() => {
            history.push(
              `/requests/${record.id}${
                record.is('CONFIRMED') ? `/incurred` : ''
              }`
            );
          }}
        >
          Update
        </Button>
      ),
    },
    {
      align: 'center',
      title: 'Check in',
      render: (_, record) => (
        <Button
          disabled={record.cannot('checkIn')}
          onClick={() => {
            setModals((curr) => ({ ...curr, checkIn: true, item: record }));
          }}
        >
          Check in
        </Button>
      ),
    },
    {
      align: 'center',
      title: 'Confirm',
      render: (_, record) => (
        <Button
          disabled={record.cannot('confirm')}
          onClick={() => {
            setModals((curr) => ({ ...curr, confirm: true, item: record }));
          }}
        >
          Confirm
        </Button>
      ),
    },
    {
      align: 'center',
      title: 'Complete',
      render: (_, record) => (
        <Popconfirm
          okText="Confirm"
          placement="top"
          title="Are you sure to complete work for this request?"
          onConfirm={() => requestCompletedHandler(record)}
        >
          <Button disabled={record.cannot('done')}>Complete</Button>
        </Popconfirm>
      ),
    },
    {
      align: 'center',
      title: 'Checkout',
      render: (_, record) => (
        <Button
          disabled={record.cannot('checkOut')}
          onClick={() => {
            setModals((curr) => ({ ...curr, checkout: true, item: record }));
          }}
        >
          Checkout
        </Button>
      ),
    },
    {
      align: 'center',
      title: 'Cancel',
      render: (_, record) => (
        <Popconfirm
          okText="Cancel"
          okButtonProps={{ danger: true }}
          placement="top"
          title="Are you sure to cancel this request?"
          onConfirm={() => {
            requestCanceledHandler(record);
          }}
        >
          <Button danger disabled={record.cannot('cancel')}>
            Cancel
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const fetchRequestsData = useCallback(() => {
    setLoading(true);
    http
      .get(`/requests/providers/${providerId}`)
      .then(({ data }) => {
        data.forEach((req) => {
          StateMachine.apply(req, {
            ...requestStateMachineConfig,
            init: req.status,
          });
        });
        setRequestsData(
          data.map(({ user, ...rest }) => {
            const { fullName, phoneNumber, ...userProps } = user;
            return { fullName, phoneNumber, ...userProps, ...rest };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [providerId]);

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  return (
    <LayoutWrapper>
      <Title>
        <Typography.Title level={4}>Requests</Typography.Title>
      </Title>
      <Content>
        <Table
          loading={loading}
          dataSource={requestsData}
          columns={columns}
          rowKey="id"
        />
      </Content>
      <RequestConfirmModal
        onCancel={() =>
          setModals((curr) => ({ ...curr, confirm: false, item: null }))
        }
        onSuccess={fetchRequestsData}
        visible={modals.confirm}
        item={modals.item}
      />
      <RequestCheckInModal
        onSuccess={fetchRequestsData}
        visible={modals.checkIn}
        item={modals.item}
        onCancel={() =>
          setModals((curr) => ({ ...curr, checkIn: false, item: null }))
        }
      />
      <RequestCheckoutModal
        onSuccess={fetchRequestsData}
        visible={modals.checkout}
        item={modals.item}
        onCancel={() =>
          setModals((curr) => ({ ...curr, checkout: false, item: null }))
        }
      />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(RequestsCollection);
