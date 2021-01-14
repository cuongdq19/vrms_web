import React, { useEffect, useState } from 'react';
import { Button, Switch, Table } from 'antd';
import { connect } from 'react-redux';

import { Title, Content } from './users-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import UserModal from '../../components/user-create-and-update-modal/user-create-and-update-modal.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import {
  fetchUsersStart,
  toggleUserActiveStart,
  showModal,
  hideModal,
} from '../../redux/user/user.actions';

const UsersCollection = ({
  visible,
  users,
  isFetching,
  onFetchUsers,
  onToggleUserActive,
  onShowModal,
  onHideModal,
}) => {
  const [item, setItem] = useState(null);
  const toggleActiveHandler = (_, userId) => {
    onToggleUserActive(userId);
  };

  const closedHandler = () => {
    setItem(null);
    onHideModal();
  };

  useEffect(() => {
    onFetchUsers();
  }, [onFetchUsers]);

  return (
    <LayoutWrapper>
      {isFetching ? (
        <LoadingSpinner title="Loading..." />
      ) : (
        <>
          <Title>
            <h1>USERS</h1>
            <Button type="primary" onClick={onShowModal}>
              Create User
            </Button>
          </Title>
          <Content>
            <Table
              rowKey="id"
              dataSource={users}
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  align: 'center',
                },
                {
                  title: 'Full Name',
                  dataIndex: 'fullName',
                  align: 'center',
                },
                {
                  title: 'User Role',
                  dataIndex: 'roleName',
                  align: 'center',
                },
                {
                  title: 'Active',
                  align: 'center',
                  render: (_, record) => {
                    return (
                      <Switch
                        checked={record.isActive}
                        onChange={(checked) =>
                          toggleActiveHandler(checked, record.id)
                        }
                      />
                    );
                  },
                },
                {
                  title: 'Update',
                  align: 'center',
                  render: (_, record) => {
                    return (
                      <Button
                        onClick={() => {
                          setItem(record);
                          onShowModal();
                        }}
                      >
                        Update
                      </Button>
                    );
                  },
                },
              ]}
            />
          </Content>
          <UserModal
            user={item}
            visible={visible}
            title={item ? `Update User` : 'Create User'}
            onCancel={closedHandler}
          />
        </>
      )}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
  users: state.users.users,
  isFetching: state.users.isFetching,
  visible: state.users.visible,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchUsers: () => dispatch(fetchUsersStart()),
  onToggleUserActive: (id) => dispatch(toggleUserActiveStart(id)),
  onShowModal: () => dispatch(showModal()),
  onHideModal: () => dispatch(hideModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersCollection);
