import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../store/actions';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const openKeys = useSelector((state) => state.common.openKeys);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const SIDER_MENU = [
    {
      icon: <BarChartOutlined />,
      key: 'dashboard',
      title: 'Dashboard',
      onClick: () => history.push('/dashboard'),
    },
    {
      icon: <UserOutlined />,
      key: 'user-management',
      title: 'User Management',
      children: [
        {
          title: 'Staffs',
          icon: <UserOutlined />,
          key: 'staffs',
          onClick: () => history.push('/staffs'),
        },
        {
          title: 'Technicians',
          icon: <UserOutlined />,
          key: 'technicians',
          onClick: () => history.push('/technicians'),
        },
        {
          title: 'Customers',
          icon: <UserOutlined />,
          key: 'customers',
          onClick: () => history.push('/customers'),
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={(keys) =>
            console.log(keys) || dispatch(actions.setOpenKeys(keys))
          }
        >
          {SIDER_MENU.map((submenu) =>
            Array.isArray(submenu.children) ? (
              <Menu.SubMenu
                icon={submenu.icon}
                key={submenu.key}
                title={submenu.title}
              >
                {submenu.children.map(
                  (menu) =>
                    !menu.hidden && (
                      <Menu.Item
                        icon={menu.icon}
                        key={menu.key}
                        onClick={menu.onClick}
                      >
                        {menu.title}
                      </Menu.Item>
                    )
                )}
              </Menu.SubMenu>
            ) : (
              !submenu.hidden && (
                <Menu.Item
                  icon={submenu.icon}
                  key={submenu.key}
                  onClick={submenu.onClick}
                >
                  {submenu.title}
                </Menu.Item>
              )
            )
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
