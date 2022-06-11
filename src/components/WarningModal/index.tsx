import React from 'react';

import {
  Container,
  ContainerModal,
  Close,
  IconX,
  Message,
  Footer,
  Button,
  Title,
  TitleAlert,
} from './styles';

interface WarningModalProps {
  title: string;
  message: string;
  height: number;
  button: {
    title: string;
    color: string;
    textColor?: string;
    close: boolean;
  }[];
  closeModal: () => void;
  primaryFunction?: () => void;
}

export function WarningModal({ height, title, message, button, closeModal, primaryFunction }: WarningModalProps) {
  return (
    <Container>
      <ContainerModal
        height={height}
      >
        <Close
          onPress={closeModal}
        >
          <IconX
            name="md-close-circle-outline"
            size={30}
            color="black"
          />
        </Close>
        <TitleAlert>
          {title}
        </TitleAlert>
        <Message>
          {message}
        </Message>
        <Footer itens={button.length}>
          {
            button.map((item) => (
              <Button
                key={item.title}
                color={item.color}
                onPress={item.close ? closeModal : primaryFunction}
              >
                <Title
                  textColor={item.textColor ? item.textColor : 'white'}
                >
                  {item.title}
                </Title>
              </Button>
            )
            )
          }
        </Footer>
      </ContainerModal>
    </Container>
  );
}