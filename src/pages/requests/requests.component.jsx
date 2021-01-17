import {
  Button,
  Col,
  message,
  Popconfirm,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import http from '../../http';
import { Title, Content } from './requests.styles';
import {
  calculateRequestPrice,
  formatMoney,
  generateRequestStatusColor,
  modelToString,
} from '../../utils';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestConfirmModal from '../../components/request-confirm-modal/request-confirm-modal.component';
import RequestCheckInModal from '../../components/request-check-in-modal/request-check-in-modal.component';
import RequestCheckoutModal from '../../components/request-check-out-modal/request-check-out-modal.component';
import { requestModals, requestStatus } from '../../utils/constants';
import { getColumnSearchProps } from '../../utils/antd';
import {
  fetchRequestsStart,
  showRequestModal,
  hideRequestModal,
  completeRequestStart,
} from '../../redux/request/request.actions';

const RequestsPage = ({
  requests,
  visible,
  isFetching,
  onShowModal,
  onHideModal,
  onFetchRequests,
  onCompleteRequest,
  history,
}) => {
  const [item, setItem] = useState(null);
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

  const requestCompletedHandler = (id) => {
    onCompleteRequest(id);
  };

  const requestCanceledHandler = (record) => {
    http.delete(`/requests/${record.id}`).then(() => {
      record.cancel();
      message.success('Successfully complete.');
      onFetchRequests();
    });
  };

  const closedHandler = (modalType) => {
    setItem(null);
    onHideModal(modalType);
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
      title: 'Vehicle Model',
      align: 'center',
      render: (_, record) => {
        return modelToString(record.vehicle.model);
      },
    },
    {
      align: 'center',
      title: 'Booking Time',
      dataIndex: 'bookingTime',
      render: (value) => moment.unix(value).format('DD/MM/YYYY HH:mm'),
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
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      defaultFilteredValue: Object.keys(requestStatus)
        .filter(
          (key) =>
            requestStatus[key] !== requestStatus.Canceled &&
            requestStatus[key] !== requestStatus.Finished
        )
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
      title: 'Actions',
      render: (_, record) => {
        return (
          <Row align="middle" gutter={16}>
            <Col>
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
            </Col>
            {record.cannot('checkIn') || (
              <Col>
                <Button
                  disabled={record.cannot('checkIn')}
                  onClick={() => {
                    setItem(record);
                    onShowModal(requestModals.checkIn);
                  }}
                >
                  Check in
                </Button>
              </Col>
            )}
            {record.cannot('confirm') || (
              <Col>
                <Button
                  disabled={record.cannot('confirm')}
                  onClick={() => {
                    setItem(record);
                    onShowModal(requestModals.confirm);
                  }}
                >
                  Confirm
                </Button>
              </Col>
            )}
            {record.cannot('done') || (
              <Col>
                <Popconfirm
                  disabled={record.cannot('done')}
                  okText="Confirm"
                  placement="top"
                  title="Are you sure to complete work for this request?"
                  onConfirm={() => requestCompletedHandler(record.id)}
                >
                  <Button disabled={record.cannot('done')}>Complete</Button>
                </Popconfirm>
              </Col>
            )}
            {record.cannot('checkOut') || (
              <Col>
                <Button
                  disabled={record.cannot('checkOut')}
                  onClick={() => {
                    setItem(record);
                    onShowModal(requestModals.checkout);
                  }}
                >
                  Checkout
                </Button>
              </Col>
            )}
            {record.cannot('cancel') || (
              <Col>
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
              </Col>
            )}
          </Row>
        );
      },
    },
    // {
    //   align: 'center',
    //   title: 'Update',
    //   render: (_, record) => (
    //     <Button
    //       disabled={
    //         record.is('FINISHED') ||
    //         record.is('WORK COMPLETED') ||
    //         record.is('CANCELED')
    //       }
    //       onClick={() => {
    //         history.push(
    //           `/requests/${record.id}${
    //             record.is('CONFIRMED') ? `/incurred` : ''
    //           }`
    //         );
    //       }}
    //     >
    //       Update
    //     </Button>
    //   ),
    // },
    // {
    //   align: 'center',
    //   title: 'Check in',
    //   render: (_, record) => (
    //     <Button
    //       disabled={record.cannot('checkIn')}
    //       onClick={() => {
    //         setItem(record);
    //         onShowModal(requestModals.checkIn);
    //       }}
    //     >
    //       Check in
    //     </Button>
    //   ),
    // },
    // {
    //   align: 'center',
    //   title: 'Confirm',
    //   render: (_, record) => (
    //     <Button
    //       disabled={record.cannot('confirm')}
    //       onClick={() => {
    //         setItem(record);
    //         onShowModal(requestModals.confirm);
    //       }}
    //     >
    //       Confirm
    //     </Button>
    //   ),
    // },
    // {
    //   align: 'center',
    //   title: 'Complete',
    //   render: (_, record) => (
    //     <Popconfirm
    //       disabled={record.cannot('done')}
    //       okText="Confirm"
    //       placement="top"
    //       title="Are you sure to complete work for this request?"
    //       onConfirm={() => requestCompletedHandler(record.id)}
    //     >
    //       <Button disabled={record.cannot('done')}>Complete</Button>
    //     </Popconfirm>
    //   ),
    // },
    // {
    //   align: 'center',
    //   title: 'Checkout',
    //   render: (_, record) => (
    //     <Button
    //       disabled={record.cannot('checkOut')}
    //       onClick={() => {
    //         setItem(record);
    //         onShowModal(requestModals.checkout);
    //       }}
    //     >
    //       Checkout
    //     </Button>
    //   ),
    // },
    // {
    //   align: 'center',
    //   title: 'Cancel',
    //   render: (_, record) => (
    //     <Popconfirm
    //       okText="Cancel"
    //       okButtonProps={{ danger: true }}
    //       placement="top"
    //       title="Are you sure to cancel this request?"
    //       onConfirm={() => {
    //         requestCanceledHandler(record);
    //       }}
    //     >
    //       <Button danger disabled={record.cannot('cancel')}>
    //         Cancel
    //       </Button>
    //     </Popconfirm>
    //   ),
    // },
  ];

  useEffect(() => {
    onFetchRequests();
  }, [onFetchRequests]);

  return (
    <LayoutWrapper>
      <Title>
        <Typography.Title level={4}>Requests</Typography.Title>
      </Title>
      <Content>
        <Table
          loading={isFetching}
          dataSource={requests}
          columns={columns}
          rowKey="id"
        />
      </Content>
      <RequestConfirmModal
        onCancel={() => {
          closedHandler(requestModals.confirm);
        }}
        visible={visible.confirm}
        item={item}
      />
      <RequestCheckInModal
        visible={visible.checkIn}
        item={item}
        onCancel={() => closedHandler(requestModals.checkIn)}
      />
      <RequestCheckoutModal
        onSuccess={onFetchRequests}
        visible={visible.checkout}
        item={item}
        onCancel={() => closedHandler(requestModals.checkout)}
      />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    requests: state.requests.requests,
    isFetching: state.requests.isFetching,
    providerId: state.auth.userData?.providerId,
    visible: state.requests.visible,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchRequests: () => dispatch(fetchRequestsStart()),
  onCompleteRequest: (id) => dispatch(completeRequestStart(id)),
  onShowModal: (modalType) => dispatch(showRequestModal(modalType)),
  onHideModal: (modalType) => dispatch(hideRequestModal(modalType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
