import React from 'react';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
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
  faHome,
} from '@fortawesome/free-solid-svg-icons';

import {
  CollapsedIcon,
  CustomContent,
  CustomHeader,
  Logo,
  Profile,
} from './layout-wrapper.styles';
import {
  setOpenKeys,
  toggleCollapsed,
} from '../../redux/common/common.actions';
import { signOut } from '../../redux/auth/auth.actions';
import { roles } from '../../utils/constants';

const { Sider } = Layout;

const LayoutWrapper = ({
  children,
  collapsed,
  currentUser,
  openKeys,
  setOpenKeys,
  toggleCollapsed,
  signOut,
}) => {
  const history = useHistory();

  const SIDER_MENU = [
    {
      icon: <BarChartOutlined />,
      key: 'dashboard',
      title: 'Dashboard',
      onClick: () => history.push('/dashboard'),
    },
    {
      hidden:
        currentUser.roleName !== roles.Manager &&
        currentUser.roleName !== roles.Staff,
      icon: <FontAwesomeIcon icon={faTools} />,
      key: 'services',
      title: 'Services',
      onClick: () => history.push('/services'),
    },
    {
      hidden:
        currentUser.roleName !== roles.Manager &&
        currentUser.roleName !== roles.Staff,
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
          hidden:
            currentUser.roleName !== roles.Manager &&
            currentUser.roleName !== roles.Staff,
          title: 'Staffs',
          icon: <UserOutlined />,
          key: 'staffs',
          onClick: () => history.push('/staffs'),
        },
        {
          hidden:
            currentUser.roleName !== roles.Manager &&
            currentUser.roleName !== roles.Staff,
          title: 'Technicians',
          icon: <UserOutlined />,
          key: 'technicians',
          onClick: () => history.push('/technicians'),
        },
        {
          hidden: currentUser.roleName !== roles.Admin,
          title: 'Customers',
          icon: <UserOutlined />,
          key: 'customers',
          onClick: () => history.push('/customers'),
        },
      ],
    },
    {
      hidden:
        currentUser.roleName !== roles.Manager &&
        currentUser.roleName !== roles.Staff,
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
      hidden: currentUser.roleName !== roles.Admin,
      icon: <FontAwesomeIcon icon={faHome} />,
      key: 'providers',
      title: 'Providers',
      onClick: () => history.push('/providers'),
    },
    {
      hidden:
        currentUser.roleName !== roles.Manager &&
        currentUser.roleName !== roles.Staff,
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
          onOpenChange={(keys) => setOpenKeys(keys)}
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
          <CollapsedIcon onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapsedIcon>
          <div style={{ flex: 1 }} />
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
              <div style={{ marginRight: '0.5rem' }}>
                {currentUser.fullName}
              </div>
              <Avatar src={currentUser.imgUrl} shape="square" />
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
    collapsed: state.common.collapsed,
    openKeys: state.common.openKeys,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOpenKeys: (keys) => dispatch(setOpenKeys(keys)),
    toggleCollapsed: () => dispatch(toggleCollapsed()),
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutWrapper);
