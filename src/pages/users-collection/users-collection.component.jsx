import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Switch, Table } from 'antd';
import { connect } from 'react-redux';

import { Title, Content } from './users-collection.styles';
import http from '../../http';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import UserModal from '../../components/user-modal/user-modal.component';

const UsersCollection = ({ providerId }) => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [updated, setUpdated] = useState(null);

  const loadData = useCallback(() => {
    http
      .get(`/users/provider/${providerId}`)
      .then(({ data }) => setUsers(data));
  }, [providerId]);

  const toggleActiveHandler = (checked, userId) => {
    http.get(`/users/${userId}/provider`).then(() => {
      message.info('Successfully deleted.');
      loadData();
    });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <LayoutWrapper>
      <Title>
        <h1>USERS</h1>
        <Button type="primary" onClick={() => setVisible(true)}>
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
                      setUpdated(record);
                      setVisible(true);
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
        user={updated}
        visible={visible}
        title={updated ? `Update User` : 'Create User'}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          loadData();
          setUpdated(null);
          setVisible(false);
        }}
      />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});
export default connect(mapStateToProps)(UsersCollection);
