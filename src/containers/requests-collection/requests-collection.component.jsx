import { Button, message, Popconfirm, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestUpdateButton from '../../components/RequestUpdateButton';
import * as actions from '../../store/actions';
import {
  calculateRequestPrice,
  formatMoney,
  generateRequestStatusColor,
} from '../../utils';
import { Title, Content } from './requests-collection.styles';
import RequestConfirmModal from '../../components/request-confirm-modal/request-confirm-modal.component';
import RequestCheckInModal from '../../components/request-check-in-modal/request-check-in-modal.component';
import RequestCheckoutModal from '../../components/request-check-out-modal/request-check-out-modal.component';

const RequestsCollection = ({
  history,
  loadRequests,
  completeRequest,
  cancelRequest,
  requestsData,
}) => {
  const dispatch = useDispatch();
  const [modals, setModals] = useState({
    confirm: false,
    checkIn: false,
    checkout: false,
    item: null,
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center' },
    {
      title: 'User Full Name',
      dataIndex: ['user', 'fullName'],
      align: 'center',
    },
    {
      title: 'Phone Number',
      dataIndex: ['user', 'phoneNumber'],
      align: 'center',
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
      render: (value) => {
        const color = generateRequestStatusColor(value);
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      align: 'center',
      title: 'Total Price',
      render: (_, record) => {
        const price = calculateRequestPrice(record);
        return formatMoney(price.total);
      },
    },
    {
      align: 'center',
      title: 'Update',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              history.push(`/requests/${record.id}`);
            }}
          >
            Update
          </Button>
          <RequestUpdateButton
            disabled={
              record.is('FINISHED') ||
              record.is('WORK COMPLETED') ||
              record.is('CANCELED')
            }
            requestData={record}
            onInitUpdate={() => dispatch(actions.initUpdateRequest(record))}
          >
            Update
          </RequestUpdateButton>
        </>
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
          onConfirm={() =>
            completeRequest(record.id, () => {
              record.cancel();
              message.info('Canceled request.');
              fetchRequestsData();
            })
          }
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
          onConfirm={() =>
            cancelRequest(record.id, () => {
              record.confirm();
              message.success('Successfully complete.');
              fetchRequestsData();
            })
          }
        >
          <Button danger disabled={record.cannot('cancel')}>
            Cancel
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const fetchRequestsData = useCallback(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  return (
    <LayoutWrapper>
      <Title>
        <Typography.Title level={4}>Requests</Typography.Title>
      </Title>
      <Content>
        <Table dataSource={requestsData} columns={columns} rowKey="id" />
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
    requestsData: state.requests.requests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadRequests: () => dispatch(actions.fetchRequests()),
    completeRequest: (requestId, callback) =>
      dispatch(actions.completeRequest(requestId, callback)),
    cancelRequest: (requestId, callback) =>
      dispatch(actions.cancelRequest(requestId, callback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestsCollection);
