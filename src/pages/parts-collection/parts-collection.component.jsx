import { Button, Col, Input, message, Pagination, Row, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Title,
  Content,
  SearchAndCreateButtonContainer,
} from './parts-collection.styles';
import PartItem from '../../components/part-item/part-item.component';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import PartModal from '../../components/part-modal/part-modal.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import http from '../../http';
import { nonAccentVietnamese, updateObject } from '../../utils';

const PAGE_SIZE = 12;

const PartsCollection = () => {
  const [current, setCurrent] = useState(1);
  const providerId = useSelector((state) => state.auth.userData?.providerId);
  const [parts, setParts] = useState({ data: [], loading: false });
  const [modal, setModal] = useState({ visible: false, item: null, title: '' });
  const [search, setSearch] = useState('');

  const pageChangedHandler = (page) => {
    setCurrent(page);
  };

  const loadData = useCallback(() => {
    setParts((curr) => updateObject(curr, { loading: true }));
    return http
      .get(`/parts/${providerId}`)
      .then(({ data }) => {
        setParts({ data: data.filter((p) => !p.isDeleted), loading: false });
      })
      .catch((err) => console.log(err));
  }, [providerId]);

  const removedHandler = (id) => {
    http.delete(`/parts/${id}`).then(() => {
      message.info(
        'Any services and packages contains this part will be disabled. You can remove this part out of these services to continue using.'
      );
      loadData();
    });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredParts = parts.data
    .filter((part) =>
      search.length > 0
        ? nonAccentVietnamese(part.name)
            .toLowerCase()
            .indexOf(nonAccentVietnamese(search).toLowerCase()) >= 0
        : true
    )
    .splice((current - 1) * PAGE_SIZE, PAGE_SIZE);

  return (
    <LayoutWrapper>
      {parts.loading ? (
        <LoadingSpinner title="Loading ..." />
      ) : (
        <>
          <Title>
            <Typography.Title level={4}>Automobile Parts</Typography.Title>
            <SearchAndCreateButtonContainer>
              <Input.Search
                placeholder="Search Parts"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                type="primary"
                onClick={() =>
                  setModal((curr) =>
                    updateObject(curr, { visible: true, title: 'Create Part' })
                  )
                }
              >
                Create Part
              </Button>
            </SearchAndCreateButtonContainer>
          </Title>
          <Content>
            <Row gutter={[16, 16]}>
              {filteredParts.map((item) => (
                <Col span={6} key={item.id}>
                  <PartItem
                    item={item}
                    onRemove={removedHandler}
                    onInitUpdate={() =>
                      setModal({ item, visible: true, title: 'Update Part' })
                    }
                  />
                </Col>
              ))}
            </Row>
            <Row justify="center">
              <Pagination
                current={current}
                pageSize={PAGE_SIZE}
                total={parts.data.length}
                onChange={pageChangedHandler}
              />
            </Row>
          </Content>
          <PartModal
            {...modal}
            onClose={() => {
              setModal({ visible: false, item: null, title: '' });
              loadData();
            }}
          />
        </>
      )}
    </LayoutWrapper>
  );
};

export default PartsCollection;
