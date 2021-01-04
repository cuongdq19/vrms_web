import { Button, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';

import LayoutWrapper from '../../hoc/LayoutWrapper/layout-wrapper.component';
import RequestCheckInButton from '../../components/RequestCheckInButton';
import RequestCompleteWorkButton from '../../components/RequestCompleteWorkButton';
import RequestCheckoutButton from '../../components/RequestCheckoutButton';
import RequestCanceledButton from '../../components/RequestCanceledButton';
import RequestUpdateButton from '../../components/RequestUpdateButton';
import * as actions from '../../store/actions';
import {
  calculateRequestPrice,
  formatMoney,
  generateRequestStatusColor,
} from '../../utils';
import { Title, Content } from './requests-collection.styles';
import RequestConfirmModal from '../../components/request-confirm-modal/request-confirm-modal.component';

const Requests = ({ loadRequests, requestsData }) => {
  const dispatch = useDispatch();
  const [modals, setModals] = useState({
    confirm: false,
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
          <RequestUpdateButton
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
        <RequestCheckInButton request={record} onSuccess={fetchRequestsData}>
          Check in
        </RequestCheckInButton>
      ),
    },
    {
      align: 'center',
      title: 'Confirm',
      render: (_, record) => (
        <Button
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
      title: 'Completed',
      render: (_, record) => (
        <RequestCompleteWorkButton
          id={record.id}
          disabled={record.cannot('done')}
          onStateTransition={() => record.done()}
          onSuccess={fetchRequestsData}
        >
          Completed
        </RequestCompleteWorkButton>
      ),
    },
    {
      align: 'center',
      title: 'Checkout',
      render: (_, record) => (
        <RequestCheckoutButton
          request={{ ...record, price: calculateRequestPrice(record) }}
          onSuccess={fetchRequestsData}
        >
          Checkout
        </RequestCheckoutButton>
      ),
    },
    {
      align: 'center',
      title: 'Canceled',
      render: (_, record) => (
        <RequestCanceledButton
          disabled={record.cannot('cancel')}
          onStateTransition={() => record.cancel()}
          id={record.id}
          onSuccess={fetchRequestsData}
        >
          Canceled
        </RequestCanceledButton>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
