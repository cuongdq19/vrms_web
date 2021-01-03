import { Button } from 'antd';
import React from 'react';

import { formatMoney } from '../../utils';
import PartUpdateButton from '../PartUpdateButton';
import {
  Container,
  BackgroundImage,
  Footer,
  NameContainer,
  PriceContainer,
  ButtonContainer,
} from './part-item.styles';

const PartItem = ({ part, onSuccess }) => {
  const { name, price, imageUrls } = part;
  return (
    <Container>
      <NameContainer level={4}>{name}</NameContainer>
      <BackgroundImage className="image" imageUrl={imageUrls[0]} />
      <Footer>
        <PriceContainer>{formatMoney(price)}</PriceContainer>
      </Footer>
      <ButtonContainer className="buttons">
        <PartUpdateButton part={part} onSuccess={onSuccess}>
          Update
        </PartUpdateButton>
        <Button danger>Remove</Button>
      </ButtonContainer>
    </Container>
  );
};

export default PartItem;
