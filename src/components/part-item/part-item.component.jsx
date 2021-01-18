import { Button, Popconfirm } from 'antd';
import React from 'react';

import { formatMoney } from '../../utils';
import {
  Container,
  BackgroundImage,
  Footer,
  NameContainer,
  PriceContainer,
  ButtonContainer,
} from './part-item.styles';

const PartItem = ({ item, onUpdate, onRemove }) => {
  const { id, name, price, imageUrls } = item;

  return (
    <Container>
      <NameContainer level={5}>{name}</NameContainer>
      <BackgroundImage className="image" imageUrl={imageUrls[0]} />
      <Footer>
        <PriceContainer>{formatMoney(price)}</PriceContainer>
      </Footer>
      <ButtonContainer className="buttons">
        <Button type="primary" onClick={onUpdate}>
          Update
        </Button>
        <Popconfirm
          title="Are you sure to remove this part?"
          onConfirm={() => onRemove(id)}
        >
          <Button danger>Remove</Button>
        </Popconfirm>
      </ButtonContainer>
    </Container>
  );
};

export default PartItem;
