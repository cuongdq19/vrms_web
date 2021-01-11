import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &:hover {
    .image {
      opacity: 0.8;
    }

    .buttons {
      opacity: 0.85;
      display: flex;
    }
  }
`;

export const BackgroundImage = styled.img`
  width: 100%;
  height: 95%;
  background-size: cover;
  background-position: center;
  margin-bottom: 5px;
  border-radius: 5px;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NameContainer = styled.span`
  flex: 1;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;

export const PriceContainer = styled.span`
  text-align: center;
  font-size: 18px;
`;

export const ButtonContainer = styled.div`
  width: 80%;
  opacity: 0.7;
  position: absolute;
  top: 80%;
  display: none;
  justify-content: space-between;
  align-items: center;
`;
