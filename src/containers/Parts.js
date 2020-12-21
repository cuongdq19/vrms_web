import { Col, Modal, Pagination, Row, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import PartCard from '../components/PartCard';
import PartCreateButton from '../components/PartCreateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';
import { pageSize } from '../utils/constants';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Parts = () => {
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [parts, setParts] = useState([]);

  const pageChangedHandler = (page) => {
    setCurrent(page);
  };

  const fetchPartsData = useCallback(() => {
    setLoading(true);
    return http
      .get(`/parts/${providerId}`)
      .then(({ data }) => {
        setParts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [providerId]);

  useEffect(() => {
    fetchPartsData();
  }, [fetchPartsData]);
  return (
    <LayoutWrapper>
      {loading && (
        <Modal
          visible={loading}
          closable={false}
          footer={null}
          maskClosable={false}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        </Modal>
      )}
      <Header>
        <Typography.Title level={4}>Automobile Parts</Typography.Title>
        <PartCreateButton onSuccess={fetchPartsData}>
          Create Part
        </PartCreateButton>
      </Header>
      <Row gutter={[8, 8]}>
        {[...parts].splice((current - 1) * pageSize, pageSize).map((part) => (
          <Col span={6} key={part.id}>
            <PartCard part={part} onSuccess={fetchPartsData} />
          </Col>
        ))}
      </Row>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={parts.length}
        onChange={pageChangedHandler}
      />
    </LayoutWrapper>
  );
};

export default Parts;
