import React, { useState } from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BarChartOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faFileContract,
  faTools,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';

import {
  CollapsedIcon,
  CustomContent,
  CustomHeader,
  Logo,
  Profile,
} from './layout-wrapper.styles';
import * as actions from '../../store/actions';
import { roles } from '../../utils/constants';

const { Sider } = Layout;

const LayoutWrapper = ({
  children,
  currentUser,
  openKeys,
  setOpenKeys,
  signOut,
}) => {
  const history = useHistory();
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
      icon: <FontAwesomeIcon icon={faTools} />,
      key: 'services',
      title: 'Services',
      onClick: () => history.push('/services'),
    },
    {
      icon: <FontAwesomeIcon icon={faTools} />,
      key: 'packages',
      title: 'Maintenance Packages',
      onClick: () => history.push('/packages'),
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
    {
      icon: <FontAwesomeIcon icon={faCar} />,
      key: 'parts',
      title: 'Vehicle Parts',
      onClick: () => history.push('/parts'),
    },
    {
      hidden: currentUser.roleName !== roles.Admin,
      icon: <FontAwesomeIcon icon={faFileContract} />,
      key: 'contracts',
      title: 'Contracts',
      onClick: () => history.push('/contracts'),
    },
    {
      icon: <FontAwesomeIcon icon={faCalendar} />,
      key: 'requests',
      title: 'Booking Requests',
      onClick: () => history.push('/requests'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
        <Logo />
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={(keys) => console.log(keys) || setOpenKeys(keys)}
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
      <Layout>
        <CustomHeader>
          <CollapsedIcon onClick={toggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapsedIcon>
          <div style={{ flex: 1 }} />
          <div>{currentUser.fullName}</div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => history.push('/profile')}>
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={signOut}>Sign out</Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Profile>
              <DownOutlined
                style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}
              />
            </Profile>
          </Dropdown>
        </CustomHeader>
        <CustomContent>{children}</CustomContent>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.userData,
    openKeys: state.common.openKeys,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOpenKeys: (keys) => dispatch(actions.setOpenKeys(keys)),
    signOut: () => dispatch(actions.signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutWrapper);
