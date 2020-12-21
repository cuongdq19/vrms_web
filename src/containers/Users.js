import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Table, Tag, Form } from 'antd';
import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components';

import http from '../http';
import LayoutWrapper from '../hoc/LayoutWrapper';
import { generateUserRoleColor } from '../utils';
import { Roles } from '../utils/constants';
import UserUpdateModal from '../components/UserUpdateModal';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  padding: 0.5rem;
  width: 14rem;
`;

const Buttons = styled.div`
  margin-top: 0.5rem;
  display: flex;
`;

const getPageRole = (pathname) => {
  switch (pathname) {
    case '/staffs':
      return 'STAFF';
    case '/technicians':
      return 'TECHNICIAN';
    default:
      return true;
  }
};

const Users = () => {
  const location = useLocation();
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();

  const role = getPageRole(location.pathname);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({ searchText: '', searchedColumn: '' });
  const [updating, setUpdating] = useState({
    visible: false,
    user: null,
  });

  const finishHandler = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      switch (key) {
        case 'image':
          values[key].forEach((obj) => formData.append(key, obj.originFileObj));
          break;
        default:
          formData.append(key, values[key]);
      }
    });
    http
      .post(`/users/${values.id}/provider`, formData)
      .then((res) => {
        setUpdating({ visible: false, user: null });
        fetchUsersData();
      })
      .catch((err) => console.log(err));
  };

  const fetchUsersData = useCallback(() => {
    setLoading(true);
    http.get(`/users/provider/${providerId}`).then((res) => {
      setUsers(
        res.data
          .filter((user) => user.roleName.toUpperCase() === role.toUpperCase())
          .map((user) => ({ key: user.id, ...user }))
      );
      setLoading(false);
    });
  }, [providerId, role]);

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
      dataIndex: 'roleName',
      key: 'role',
      title: 'Role',
      filters: Object.keys(Roles).map((key) => ({
        text: key,
        value: Roles[key],
      })),
      onFilter: (value, record) => record.roleName === value,
      render: (value) => (
        <Tag color={generateUserRoleColor(value)}>{value}</Tag>
      ),
    },
    {
      key: 'update',
      title: 'Update',
      render: (_, user) => (
        <Button
          onClick={() => {
            setUpdating({ visible: true, user: user });
            form.setFieldsValue(user);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  return (
    <LayoutWrapper>
      <Table
        style={{ overflowX: 'auto' }}
        loading={loading}
        columns={columns}
        dataSource={users}
      />
      <UserUpdateModal
        form={form}
        updating={updating}
        onCancel={() => {
          setUpdating({ visible: false, user: null });
          form.resetFields();
        }}
        onSubmit={finishHandler}
      />
    </LayoutWrapper>
  );
};

export default Users;
