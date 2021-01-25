import React from 'react';
import { connect } from 'react-redux';

import AdminDashboard from '../../components/admin-dashboard/admin-dashboard.component';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ProviderDashboard from '../../components/provider-dashboard/provider-dashboard.component';
import { roles } from '../../utils/constants';

const DashboardPage = ({ roleName }) => {
  return (
    <LayoutWrapper>
      {roleName === roles.Admin ? <AdminDashboard /> : <ProviderDashboard />}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  roleName: state.auth.userData?.roleName,
});

export default connect(mapStateToProps)(DashboardPage);
