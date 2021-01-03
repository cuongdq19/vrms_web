import { Col, Modal, Pagination, Row, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Title, Content } from './parts-collection.styles';
import PartItem from '../../components/part-item/part-item.component';
import PartCreateButton from '../../components/PartCreateButton';
import LayoutWrapper from '../../hoc/LayoutWrapper/layout-wrapper.component';
import http from '../../http';

const PAGE_SIZE = 12;

const PartsCollection = () => {
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
      <Title>
        <Typography.Title level={4}>Automobile Parts</Typography.Title>
        <PartCreateButton onSuccess={fetchPartsData}>
          Create Part
        </PartCreateButton>
      </Title>
      <Content>
        <Row gutter={[8, 16]}>
          {[...parts]
            .splice((current - 1) * PAGE_SIZE, PAGE_SIZE)
            .map((part) => (
              <Col span={6} key={part.id}>
                <PartItem part={part} onSuccess={fetchPartsData} />
              </Col>
            ))}
        </Row>
        <Pagination
          current={current}
          pageSize={PAGE_SIZE}
          total={parts.length}
          onChange={pageChangedHandler}
        />
      </Content>
    </LayoutWrapper>
  );
};

export default PartsCollection;
