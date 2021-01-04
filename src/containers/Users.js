import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Table, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import http from '../http';
import LayoutWrapper from '../components/layout-wrapper/layout-wrapper.component';
import UserUpdateButton from '../components/UserUpdateButton';
import UserCreateButton from '../components/UserCreateButton';

const Container = styled.div`
  padding: 0.5rem;
  width: 14rem;
`;

const Buttons = styled.div`
  margin-top: 0.5rem;
  display: flex;
`;

const generatePageRole = (pathname) => {
  switch (pathname) {
    case '/staffs':
      return 'STAFF';
    case '/technicians':
      return 'TECHNICIAN';
    default:
      return null;
  }
};

const generateTitle = (pathname) => {
  switch (pathname) {
    case '/staffs':
      return 'Staff';
    case '/technicians':
      return 'Technician';
    default:
      return null;
  }
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
`;

const Users = () => {
  const { pathname } = useLocation();
  const pageRole = generatePageRole(pathname);
  const providerId = useSelector((state) => state.auth.userData.providerId);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({ searchText: '', searchedColumn: '' });

  const fetchUsersData = useCallback(() => {
    setLoading(true);
    http.get(`/users/provider/${providerId}`).then((res) => {
      setUsers(
        res.data
          .filter((user) => user.roleName.toUpperCase() === pageRole)
          .map((user) => ({ key: user.id, ...user }))
      );
      setLoading(false);
    });
  }, [providerId, pageRole]);

  let searchInput = null;

  const searchHandler = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({ searchText: selectedKeys[0], searchedColumn: dataIndex });
  };

  const resetHandler = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: '' });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Container>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => searchHandler(selectedKeys, confirm, dataIndex)}
        />
        <Buttons>
          <Button
            type="primary"
            onClick={() => searchHandler(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button onClick={() => resetHandler(clearFilters)}>Reset</Button>
        </Buttons>
      </Container>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'fullName',
      key: 'fullName',
      title: 'Display Name',
      ...getColumnSearchProps('fullName'),
    },
    {
      key: 'update',
      title: 'Update',
      render: (_, user) => (
        <UserUpdateButton user={user} onSuccess={fetchUsersData}>
          Update
        </UserUpdateButton>
      ),
    },
  ];

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>{pageRole}</Typography.Title>
        <UserCreateButton
          onSuccess={fetchUsersData}
          role={generatePageRole(pathname)}
        >
          Create {generateTitle(pathname)}
        </UserCreateButton>
      </Header>
      <Table
        style={{ overflowX: 'auto' }}
        loading={loading}
        columns={columns}
        dataSource={users}
      />
    </LayoutWrapper>
  );
};

export default Users;
