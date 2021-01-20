import { Button, Col, Input, Pagination, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  Title,
  Content,
  SearchAndCreateButtonContainer,
} from './vehicle-parts.styles';
import PartItem from '../../components/part-item/part-item.component';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import PartCreateAndUpdateModal from '../../components/part-create-and-update-modal/part-create-and-update-modal.component';

import { nonAccentVietnamese } from '../../utils';
import {
  fetchPartsStart,
  showPartModal,
  removePartStart,
} from '../../redux/part/part.actions';

const PAGE_SIZE = 12;

const VehiclePartsPage = ({
  isFetching,
  parts,
  onFetchParts,
  onShowModal,
  onRemovePart,
}) => {
  const [current, setCurrent] = useState(1);

  const [search, setSearch] = useState('');
  const [item, setItem] = useState(null);

  const pageChangedHandler = (page) => {
    setCurrent(page);
  };

  const removedHandler = (id) => {
    onRemovePart(id);
  };

  useEffect(() => {
    onFetchParts();
  }, [onFetchParts]);

  const filteredParts = parts
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
      {isFetching ? (
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
              <Button type="primary" onClick={onShowModal}>
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
                    onUpdate={() => {
                      setItem(item);
                      onShowModal();
                    }}
                  />
                </Col>
              ))}
            </Row>
            <Row justify="center">
              <Pagination
                current={current}
                pageSize={PAGE_SIZE}
                total={parts.length}
                onChange={pageChangedHandler}
              />
            </Row>
          </Content>
          <PartCreateAndUpdateModal item={item} onClose={() => setItem(null)} />
          {/* <PartModal
            {...modal}
            onClose={() => {
              setModal({ visible: false, item: null, title: '' });
            }}
          /> */}
        </>
      )}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  parts: state.parts.parts,
  isFetching: state.parts.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchParts: () => dispatch(fetchPartsStart()),
  onShowModal: () => dispatch(showPartModal()),
  onRemovePart: (id) => dispatch(removePartStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VehiclePartsPage);
