import { Button, Col, Pagination, Row, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Title, Content } from './parts-collection.styles';
import PartItem from '../../components/part-item/part-item.component';
import LayoutWrapper from '../../hoc/LayoutWrapper/layout-wrapper.component';
import http from '../../http';
import PartModal from '../../components/part-modal/part-modal.component';
import { updateObject } from '../../utils';

const PAGE_SIZE = 12;

const PartsCollection = () => {
  const [current, setCurrent] = useState(1);
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [parts, setParts] = useState({ data: [], loading: false });
  const [modal, setModal] = useState({ visible: false, item: null });

  const pageChangedHandler = (page) => {
    setCurrent(page);
  };

  const loadData = useCallback(() => {
    setParts((curr) => updateObject(curr, { loading: true }));
    return http
      .get(`/parts/${providerId}`)
      .then(({ data }) => {
        setParts({ data, loading: false });
      })
      .catch((err) => console.log(err));
  }, [providerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <LayoutWrapper>
      <Title>
        <Typography.Title level={4}>Automobile Parts</Typography.Title>
        <Button
          onClick={() =>
            setModal((curr) => updateObject(curr, { visible: true }))
          }
        >
          Create Part
        </Button>
      </Title>
      <Content>
        <Row gutter={[8, 16]}>
          {[...parts.data]
            .splice((current - 1) * PAGE_SIZE, PAGE_SIZE)
            .map((part) => (
              <Col span={6} key={part.id}>
                <PartItem part={part} onSuccess={loadData} />
              </Col>
            ))}
        </Row>
        <Pagination
          current={current}
          pageSize={PAGE_SIZE}
          total={parts.data.length}
          onChange={pageChangedHandler}
        />
      </Content>
      <PartModal
        {...modal}
        onClose={() => setModal({ visible: false, item: null })}
      />
    </LayoutWrapper>
  );
};

export default PartsCollection;
