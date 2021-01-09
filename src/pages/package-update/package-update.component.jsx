import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import PackageForm from '../../components/package-form/package-form.component';

import http from '../../http';

const PackageUpdate = () => {
  const { packageId } = useParams();

  const [item, setItem] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = (updatedItem) => {
    setLoading(true);
    const { id, milestoneId, packageName, sectionId, serviceIds } = updatedItem;
    http
      .post(`/maintenance-packages/${id}`, {
        milestoneId: milestoneId ?? null,
        packageName: packageName,
        sectionId: sectionId ?? null,
        serviceIds,
      })
      .then(({ data }) => {
        message.success('Successfully update package');
        setRedirect(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    http.get(`/maintenance-packages/${packageId}`).then(({ data }) => {
      setItem(data);
    });
  }, [packageId]);

  if (redirect) {
    return <Redirect to="/packages" />;
  }

  return (
    <LayoutWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PackageForm item={item} onSubmit={submitHandler} />
      )}
    </LayoutWrapper>
  );
};

export default PackageUpdate;
