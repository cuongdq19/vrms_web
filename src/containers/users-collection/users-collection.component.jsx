import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'antd';

import { Title, Content } from './users-collection.styles';
import http from '../../http';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { connect } from 'react-redux';
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <LayoutWrapper>
      <Title>
        <h1>USERS</h1>
        <Button onClick={() => setVisible(true)}>Create User</Button>
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
        title="Create User"
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
