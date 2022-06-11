import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Background } from '../../components/Background';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';

import { useRepositories } from '../../hooks/useRepositories';

import {
  Container,
  AddGithubRepo,
  Title,
  Input,
  InputField,
  InputButton,
  Icon,
  RepositoriesList
} from './styles';

type RootStackParamList = {
  Dashboard: undefined;
  Repository: {
    repositoryId: number;
  }
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export function Dashboard() {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { navigate } = useNavigation<NavigationProps>();

  const { addRepository, repositories } = useRepositories();

  async function handleAddRepository() {
    /**
     * TODO: 
     * - call addRepository function sending inputText value;
     * - clean inputText value.
     */
    const data = await addRepository(inputText);
    setInputText("");
    if (data.error === true) {
      console.log("olá")
    }

  }

  function handleRepositoryPageNavigation(id: number) {
    /**
     * TODO - navigate to the Repository screen sending repository id.
     * Remember to use the correct prop name (repositoryId) to the repositoy id:
     * 
     * navigate(SCREEN NAME, {
     *  repositoryId: id of the repository
     * })
     */
    navigate("Repository", { repositoryId: id });
  }

  return (
    <Background>

      <Header />
      <Container>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
        // style={{ flex: 1, marginTop: 15, paddingHorizontal: 20 }}
        >
          <AddGithubRepo>
            <Title>Explore repositórios{'\n'}no GitHub.</Title>

            <Input>
              <InputField
                ref={inputRef}
                placeholder="Digite aqui 'usuário/repositório'"
                value={inputText}
                /**
                 * TODO - update inputText value when input text value 
                 * changes:
                 * onChangeText={YOUR CODE HERE}
                 */
                onChangeText={setInputText}
                onSubmitEditing={handleAddRepository}
                returnKeyType="send"
                autoCapitalize='none'
                autoCorrect={false}
              />

              <InputButton
                testID="input-button"
                onPress={handleAddRepository}
                /**
                 * TODO - ensure to disable button when inputText is 
                 * empty (use disabled prop to this):
                 * disabled={CONDITION HERE}
                 */
                disabled={!inputText}
              >
                <Icon name="search" size={20} />
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
    </Background>
  )
}
