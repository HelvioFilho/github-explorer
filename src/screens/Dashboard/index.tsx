import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Keyboard, Modal, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

import search from '../../assets/search.json';

import { Background } from '../../components/Background';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { WarningModal } from '../../components/WarningModal';

import { useTheme } from 'styled-components';
import { useRepositories } from '../../hooks/useRepositories';

import {
  Container,
  AddGithubRepo,
  Title,
  Input,
  InputField,
  InputButton,
  RepositoriesList
} from './styles';

type RootStackParamList = {
  Dashboard: undefined;
  Repository: {
    repositoryId: number;
  }
};

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

type NavigationProps = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [visible, setVisible] = useState(false);
  const [button, setButton] = useState({} as ButtonProps[]);
  const [alert, setAlert] = useState({} as AlertProps);

  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const animationSearch = useRef<LottieView>(null);

  const { navigate } = useNavigation<NavigationProps>();

  const { addRepository, repositories } = useRepositories();

  function handleAddRepository() {
    setInputText("");
    animationSearch.current?.play();
    setTimeout(async () => {
      if (await delay()) {
        animationSearch.current?.reset();
      }
    }, 5000);
  }

  async function delay() {
    const data = await addRepository(inputText);
    if (data.error === true) {
      setAlert({ title: data.title!, message: data.message!, height: data.height! });
      setButton([{ title: "ok", color: theme.colors.green_500, close: true }]);
      setVisible(true);
    }
    return true;
  }

  function handleRepositoryPageNavigation(id: number) {
    navigate("Repository", { repositoryId: id });
  }

  return (
    <Background>
      <Header />
      <Container>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
        >
          <AddGithubRepo>
            <Title>Explore repositórios{'\n'}no GitHub.</Title>
            <Input>
              <InputField
                ref={inputRef}
                placeholder="Digite aqui 'usuário/repositório'"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleAddRepository}
                returnKeyType="send"
                autoCapitalize='none'
                autoCorrect={false}
              />
              <InputButton
                testID="input-button"
                onPress={handleAddRepository}
                disabled={!inputText}
              >
                <LottieView
                  ref={animationSearch}
                  source={search}
                  style={{ height: 50 }}
                  resizeMode="contain"
                  loop={true}
                />
              </InputButton>
            </Input>
          </AddGithubRepo>
          <RepositoriesList
            data={repositories}
            showsVerticalScrollIndicator={false}
            keyExtractor={repository => String(repository.id)}
            renderItem={({ item: repository }) => (
              <Card
                key={repository.id}
                data={{
                  id: repository.id,
                  title: repository.full_name,
                  subTitle: repository.description,
                  imageUrl: repository.owner.avatar_url
                }}
                onPress={() => handleRepositoryPageNavigation(repository.id)}
              />
            )}
          />
        </TouchableWithoutFeedback>
      </Container>
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
          closeModal={() => { setVisible(false) }}
        />
      </Modal>
    </Background>
  )
}