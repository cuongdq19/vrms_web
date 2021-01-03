import { Button } from 'antd';
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

const PartItem = ({ item, onInitUpdate }) => {
  const { name, price, imageUrls } = item;
  return (
    <Container>
      <NameContainer level={4}>{name}</NameContainer>
      <BackgroundImage className="image" imageUrl={imageUrls[0]} />
      <Footer>
        <PriceContainer>{formatMoney(price)}</PriceContainer>
      </Footer>
      <ButtonContainer className="buttons">
        <Button onClick={onInitUpdate}>Update</Button>
        <Button danger>Remove</Button>
      </ButtonContainer>
    </Container>
  );
};

export default PartItem;
