import React, { createContext, useState } from 'react';

import { api } from '../services/api';

export interface IssueProps {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

export interface RepositoryProps {
  id: number,
  full_name: string;
  owner: {
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  issues_url: string;

  issues: IssueProps[]
}

export interface ResponseProps {
  error: boolean;
  title?: string;
  message?: string;
  height?: number;
}

interface RepositoriesContextData {
  repositories: RepositoryProps[];
  addRepository: (repositoryName: string) => Promise<ResponseProps>;
  removeRepository: (repositoryId: number) => void;
  findRepositoryById: (repositoryId: number) => RepositoryProps;
}

interface RepositoriesProviderProps {
  children: React.ReactNode;
}

const RepositoriesContext = createContext<RepositoriesContextData>({} as RepositoriesContextData);

function RepositoriesProvider({ children }: RepositoriesProviderProps) {
  const [repositories, setRepositories] = useState<RepositoryProps[]>([]);

  async function addRepository(repositoryName: string) {
    try {
      const repoAlreadyExists = repositories.find(repository => { return repository.full_name.toLowerCase() === repositoryName.toLowerCase() });
      if (repoAlreadyExists) {

        return {
          error: true,
          title: "Erro",
          message: "Esse repositório já está cadastrado.",
          height: 160,
        }
      }

      const response = await api.get<RepositoryProps>(`repos/${repositoryName}`);
      const { data: issues } = await api.get<IssueProps[]>(`repos/${repositoryName}/issues`);
      setRepositories([...repositories, {
        ...response.data,
        issues
      }]);
      return {
        error: false
      }
    } catch {
      return {
        error: true,
        title: "Erro",
        message: "Ocorreu um erro ao buscar pelo repositório. Verifique a sua conexão ou o nome do repositório e tente novamente.",
        height: 200,
      }
    }
  }

  function findRepositoryById(repositoryId: number) {
    return repositories.find(repository => repository.id === repositoryId) as RepositoryProps;
  }

  function removeRepository(repositoryId: number) {
    const filteredRepositories = repositories.filter(repository =>
      repository.id !== repositoryId
    );

    setRepositories(filteredRepositories);
  }

  return (
    <RepositoriesContext.Provider value={{ repositories, addRepository, removeRepository, findRepositoryById }}>
      {children}
    </RepositoriesContext.Provider>
  )
}

export { RepositoriesProvider, RepositoriesContext }