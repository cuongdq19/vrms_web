import { message } from 'antd';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import PackageForm from '../../components/package-form/package-form.component';

import http from '../../http';

const PackageCreate = ({ providerId, history }) => {
  const modelIds = history.location?.state?.modelIds ?? [];
  const [redirect, setRedirect] = useState(false);

  const submitHandler = (newPackage) => {
    const { milestoneId, packageName, sectionId, serviceIds } = newPackage;
    http
      .post(`/maintenance-packages/providers/${providerId}`, {
        milestoneId: milestoneId ?? null,
        packageName: packageName,
        sectionId: sectionId ?? null,
        serviceIds: serviceIds,
      })
      .then(({ data }) => {
        message.success('Successfully create package');
        setRedirect(true);
      });
  };

  if (redirect) {
    return <Redirect to="/packages" />;
  }

  return (
    <LayoutWrapper>
      <PackageForm modelIds={modelIds} onSubmit={submitHandler} />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(PackageCreate);
