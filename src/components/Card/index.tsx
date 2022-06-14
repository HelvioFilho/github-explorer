import React, { useRef, useState } from 'react';
import { Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';

import { useRepositories } from '../../hooks/useRepositories';
import { WarningModal } from '../WarningModal';
import { CardAnimation } from './CardAnimation';

import {
  SwipeableContainer,
  CardContainer,
  Info,
  Image,
  TextGroup,
  Title,
  Description,
  Icon,
  DeleteContainer,
  DeleteIcon,
} from './styles';

interface CardProps {
  data: {
    id: number;
    title: string;
    subTitle: string;
    imageUrl?: string;
  },
  onPress: () => void;
}

interface ButtonProps {
  title: string;
  color: string;
  close: boolean;
}

interface AlertProps {
  title: string;
  message: string;
  height: number;
}

export function Card({ data, onPress }: CardProps) {
  const [button, setButton] = useState({} as ButtonProps[]);
  const [alert, setAlert] = useState({} as AlertProps);
  const [visible, setVisible] = useState(false);

  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const swipeableProps = {
    ref: swipeableRef,
    rightThreshold: 42,
    overshootRight: false,
    renderRightActions: () => <SwipeableDelete />,
    onSwipeableRightOpen: handleDeleteAlert
  }

  const { removeRepository } = useRepositories();

  function handleDeleteAlert() {
    setAlert({ title: "Remover item", message: "Você tem certeza que deseja remover esse repositório da lista?", height: 160 });
    setButton([{ title: "não", color: theme.colors.green_500, close: true }, { title: "sim", color: theme.colors.red_500, close: false }]);
    setVisible(true);
  }

  function CardContent() {
    return (
      <CardContainer
        hasImage={!!data.imageUrl}
        onPress={onPress}
      >
        <Info>
          {data.imageUrl && (
            <Image source={{ uri: data.imageUrl }} />
          )}

          <TextGroup>
            <Title numberOfLines={1}>{data.title}</Title>
            <Description numberOfLines={1}>{data.subTitle}</Description>
          </TextGroup>
        </Info>

        <Icon name="chevron-right" size={20} />
        <Modal
          animationType="fade"
          transparent
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <WarningModal
            title={alert.title}
            height={alert.height}
            message={alert.message}
            button={button}
            closeModal={() => {
              setVisible(false);
              swipeableRef.current?.close();
            }}
            primaryFunction={() => removeRepository(data.id)}
          />
        </Modal>
      </CardContainer>
    )
  }

  function SwipeableDelete() {
    return (
      <DeleteContainer>
        <DeleteIcon name="trash" size={24} />
      </DeleteContainer>
    )
  }

  if (data.imageUrl) {
    return (
      <CardAnimation testID="repository-card">
        <SwipeableContainer {...swipeableProps}>
          <CardContent />
        </SwipeableContainer>
      </CardAnimation>
    )
  }

  return (
    <CardAnimation>
      <CardContent />
    </CardAnimation>
  )
}