# Tasklist Frontend - Sistema TODO List Multi-usuário

## Visão Geral da Arquitetura

Este projeto implementa uma aplicação frontend para gerenciamento de tarefas (TODO List) multi-usuário, desenvolvida com **Vue 3** e **TypeScript**, seguindo os princípios de **Arquitetura em Camadas** e **Component-Based Architecture**.

A arquitetura foi projetada para garantir **alta manutenibilidade**, **escalabilidade** e **experiência de usuário otimizada**, utilizando padrões modernos de desenvolvimento frontend.

### Decisões Arquiteturais

#### Arquitetura Baseada em Componentes

A escolha pela arquitetura baseada em componentes permite:

- **Reutilização**: Componentes podem ser reutilizados em diferentes contextos
- **Manutenibilidade**: Código organizado e fácil de manter
- **Testabilidade**: Componentes isolados facilitam testes unitários
- **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica
- **Padrão Vue 3**: Alinhada com as melhores práticas do ecossistema Vue

#### Estrutura em Camadas

```
Views (Presentation Layer)
    ↓
Components (UI Components)
    ↓
Stores (State Management Layer)
    ↓
Services (Business/API Layer)
    ↓
API (Backend Communication)
```

#### Princípios Aplicados

1. **Single Responsibility**: Cada componente, store e service tem uma única responsabilidade
   - `AuthStore`: Apenas gerenciamento de autenticação
   - `TasksStore`: Apenas gerenciamento de tarefas
   - `TaskListStore`: Apenas gerenciamento de listas de tarefas
   - `authService`: Apenas comunicação com API de autenticação
   - `taskService`: Apenas comunicação com API de tarefas

2. **Separation of Concerns**: Separação clara entre apresentação, lógica de negócio e comunicação
   - Views: Apenas apresentação e interação do usuário
   - Stores: Lógica de estado e negócio
   - Services: Comunicação com API

3. **DRY (Don't Repeat Yourself)**: Reutilização de componentes e serviços
   - Componentes reutilizáveis (dialogs, headers)
   - Serviços centralizados para comunicação com API
   - Stores centralizados para gerenciamento de estado

4. **Composition API**: Uso da Composition API do Vue 3 para melhor organização do código
   - Lógica reutilizável em composables
   - Melhor tipagem com TypeScript
   - Melhor tree-shaking

### Fluxo de Dados

1. **Usuário interage** → View recebe evento
2. **View** → Chama método da Store
3. **Store** → Chama Service para comunicação com API
4. **Service** → Faz requisição HTTP via Axios
5. **Resposta** → Retorna através das camadas até a View
6. **View** → Atualiza interface com novos dados

## Stack Tecnológica

### Framework e Linguagem

- **Vue 3.5.18**: Framework JavaScript progressivo
  - Composition API para melhor organização do código
  - Reactivity system otimizado
  - Tree-shaking para builds menores
  - TypeScript support nativo
- **TypeScript 5.8.0**: Superset do JavaScript com tipagem estática
  - Detecção de erros em tempo de desenvolvimento
  - Melhor autocomplete e IntelliSense
  - Refatoração mais segura
  - Documentação implícita através de tipos

### Roteamento

- **Vue Router 4.5.1**: Roteamento oficial do Vue
  - Navegação declarativa
  - Guards de rota para proteção
  - Lazy loading de componentes
  - History mode para URLs limpas

### Gerenciamento de Estado

- **Pinia 3.0.3**: Store oficial do Vue (sucessor do Vuex)
  - API simples e intuitiva
  - TypeScript support nativo
  - DevTools integradas
  - Modularidade e code-splitting

### UI Framework

- **Vuetify 3.11.2**: Framework Material Design para Vue
  - Componentes prontos e acessíveis
  - Design system consistente
  - Responsividade nativa
  - Tema customizável
- **Material Design Icons (MDI) 7.4.47**: Ícones Material Design
  - Biblioteca extensa de ícones
  - Consistência visual

### Comunicação com API

- **Axios 1.13.2**: Cliente HTTP baseado em Promises
  - Interceptors para requisições/respostas
  - Cancelamento de requisições
  - Transformação automática de dados
  - Suporte a TypeScript

### Build e Desenvolvimento

- **Vite 7.0.6**: Build tool e dev server moderno
  - HMR (Hot Module Replacement) extremamente rápido
  - Build otimizado com Rollup
  - Suporte nativo a ES modules
  - Plugin system extensível
- **Vite Plugin Vue DevTools 8.0.0**: DevTools para Vue
  - Debugging facilitado
  - Inspeção de componentes em tempo real

### Testes

- **Vitest 3.2.4**: Framework de testes unitários
  - Compatível com Jest API
  - Suporte nativo a ES modules
  - Execução rápida
  - Integração com Vite
  - **Testes implementados**: Stores, Services e Componentes
- **Vue Test Utils 2.4.6**: Utilitários para testes de componentes Vue
  - Mounting e rendering de componentes
  - Simulação de interações do usuário
  - Assertions específicas para Vue
- **jsdom 26.1.0**: Ambiente DOM para testes
  - Simulação de browser em Node.js
  - Suporte a APIs do DOM

### Qualidade de Código

- **ESLint 9.31.0**: Linter para JavaScript/TypeScript
  - Detecção de problemas no código
  - Enforçamento de padrões de código
  - Plugins para Vue e TypeScript
- **Prettier 3.6.2**: Formatador de código
  - Formatação automática consistente
  - Integração com ESLint
- **Vue TSC 3.0.4**: Type checking para Vue
  - Verificação de tipos em componentes Vue
  - Detecção de erros em templates

### Justificativas das Escolhas

1. **Vue 3**: Framework moderno, performático, com excelente suporte a TypeScript e Composition API que melhora organização do código
2. **TypeScript**: Tipagem estática reduz erros, melhora autocomplete e facilita manutenção em projetos grandes
3. **Vue Router 4**: Roteamento oficial, bem integrado com Vue, suporte a guards e lazy loading
4. **Pinia**: Store moderna e simples, melhor que Vuex, com excelente suporte a TypeScript
5. **Vuetify**: Framework Material Design completo, reduz tempo de desenvolvimento, componentes acessíveis
6. **Axios**: Cliente HTTP robusto, interceptors poderosos, melhor que fetch nativo para APIs REST
7. **Vite**: Build tool extremamente rápido, HMR instantâneo, melhor experiência de desenvolvimento
8. **Vitest**: Framework de testes moderno, compatível com Jest, integrado com Vite
9. **ESLint + Prettier**: Garantem qualidade e consistência do código
10. **Composition API**: Melhor organização, reutilização de lógica, melhor suporte a TypeScript

## Como Rodar Localmente

### Pré-requisitos

- **Node.js 20.19.0+** ou **22.12.0+**
- **npm** ou **yarn** (gerenciador de pacotes)
- **Backend rodando** (ver README do backend)
  - Backend deve estar acessível em `http://localhost:8080`
  - CORS configurado no backend para aceitar requisições do frontend

### Instalação

1. Clone o repositório (se ainda não tiver feito):

```bash
git clone <repository-url>
cd tasklist-frontend
```

2. Instale as dependências:

```bash
npm install
```

### Executando a Aplicação

#### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

**Características do modo desenvolvimento:**

- Hot Module Replacement (HMR) - mudanças refletem instantaneamente
- Source maps para debugging
- Erros visíveis no navegador
- Vue DevTools habilitadas

#### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

**Otimizações aplicadas:**

- Minificação de código
- Tree-shaking (remoção de código não utilizado)
- Code splitting
- Otimização de assets

#### Preview da Build de Produção

```bash
npm run preview
```

Testa localmente a build de produção antes de fazer deploy.

### Configuração da URL da API

A URL da API está configurada com valor padrão `http://localhost:8080/api/v1` no arquivo `src/services/api.ts`.

Se necessário alterar, edite diretamente o arquivo ou crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Troubleshooting

#### Erro de CORS

Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend. O backend deve ter CORS habilitado para `http://localhost:5173`.

#### Token não está sendo enviado

Verifique se o token está sendo salvo no `localStorage` após o login. O interceptor adiciona automaticamente o token nas requisições.

#### Erro 401 (Não autorizado)

O token pode ter expirado. O interceptor redireciona automaticamente para `/login` em caso de 401.

#### Porta já em uso

Se a porta 5173 estiver em uso, o Vite tentará usar a próxima porta disponível. Você pode especificar uma porta customizada:

```bash
npm run dev -- --port 3000
```

## Como Rodar os Testes

**Nota**: A suíte de testes ainda não foi implementada. O projeto está configurado para testes com Vitest.

### Comandos Disponíveis

```bash
# Verificação de tipos TypeScript
npm run type-check

# Linting (verifica e corrige problemas no código)
npm run lint

# Formatação de código
npm run format
```

### Configuração para Testes Futuros

O projeto está preparado para testes com:

- **Vitest**: Framework de testes configurado
- **Vue Test Utils**: Utilitários para testes de componentes
- **jsdom**: Ambiente DOM para testes

Quando os testes forem implementados, use:

```bash
npm run test:unit
```

## Estrutura de Pastas Detalhada

```
tasklist-frontend/
├── public/                          # Arquivos estáticos públicos
│   └── favicon.ico                  # Ícone do site
├── src/
│   ├── assets/                      # Recursos estáticos
│   │   ├── base.css                 # Estilos base
│   │   ├── main.css                 # Estilos principais
│   │   └── logo.svg                 # Logo da aplicação
│   ├── components/                  # Componentes Vue reutilizáveis
│   │   ├── __tests__/               # Testes de componentes
│   │   │   └── HelloWorld.spec.ts   # Teste exemplo
│   │   ├── PageContainer.vue         # Container reutilizável para layout padrão de páginas
│   │   ├── TaskTable.vue             # Tabela reutilizável para exibição de tarefas
│   │   ├── TaskListTable.vue         # Tabela reutilizável para exibição de listas de tarefas
│   │   ├── DeleteTaskDialog.vue     # Dialog de confirmação de exclusão de tarefa
│   │   ├── DeleteTaskListDialog.vue # Dialog de confirmação de exclusão de lista
│   │   ├── TaskDescriptionDialog.vue # Dialog de descrição de tarefa
│   │   ├── TaskListRegisterDialog.vue # Dialog de registro/edição de lista
│   │   ├── TaskRegisterDialog.vue   # Dialog de registro/edição de tarefa
│   │   ├── TasksHeader.vue          # Cabeçalho da página de tarefas
│   │   ├── HelloWorld.vue           # Componente exemplo
│   │   ├── TheWelcome.vue           # Componente de boas-vindas
│   │   ├── WelcomeItem.vue          # Item de boas-vindas
│   │   └── icons/                    # Componentes de ícones
│   │       ├── IconCommunity.vue
│   │       ├── IconDocumentation.vue
│   │       ├── IconEcosystem.vue
│   │       ├── IconSupport.vue
│   │       └── IconTooling.vue
│   ├── router/                      # Configuração de rotas
│   │   └── index.ts                 # Definição de rotas e guards
│   ├── services/                    # Serviços de comunicação com API
│   │   ├── api.ts                   # Cliente HTTP configurado (Axios)
│   │   ├── authService.ts           # Serviço de autenticação
│   │   ├── taskService.ts           # Serviço de tarefas
│   │   └── taskListService.ts       # Serviço de listas de tarefas
│   ├── stores/                      # Stores Pinia (gerenciamento de estado)
│   │   ├── auth.ts                  # Store de autenticação
│   │   ├── tasks.ts                 # Store de tarefas
│   │   ├── taskLists.ts             # Store de listas de tarefas
│   │   └── counter.ts               # Store exemplo
│   ├── types/                       # Definições TypeScript
│   │   ├── auth.ts                  # Tipos relacionados a autenticação
│   │   ├── task.ts                  # Tipos relacionados a tarefas
│   │   └── taskList.ts              # Tipos relacionados a listas de tarefas
│   ├── views/                       # Views/Páginas da aplicação
│   │   ├── LoginView.vue            # Página de login
│   │   ├── RegisterView.vue         # Página de registro
│   │   ├── TaskListsView.vue        # Página de listas de tarefas
│   │   ├── TasksView.vue            # Página de tarefas de uma lista
│   │   ├── HomeView.vue             # Página inicial
│   │   └── AboutView.vue            # Página sobre
│   ├── App.vue                      # Componente raiz da aplicação
│   └── main.ts                      # Ponto de entrada da aplicação
├── env.d.ts                         # Definições de tipos para variáveis de ambiente
├── index.html                       # HTML principal
├── package.json                     # Dependências e scripts
├── tsconfig.json                    # Configuração TypeScript
├── tsconfig.app.json                # Configuração TypeScript para aplicação
├── tsconfig.node.json               # Configuração TypeScript para Node.js
├── tsconfig.vitest.json             # Configuração TypeScript para testes
├── vite.config.ts                   # Configuração do Vite
├── vitest.config.ts                 # Configuração do Vitest
├── eslint.config.ts                 # Configuração do ESLint
└── README.md                        # Este arquivo
```

### Descrição das Camadas

#### 1. **Views (Presentation Layer)**

- **Responsabilidade**: Páginas principais da aplicação, composição de componentes
- **Componentes**: `LoginView`, `RegisterView`, `TaskListsView`, `TasksView`
- **Características**:
  - Usam stores para acessar dados
  - Compõem componentes menores
  - Gerenciam navegação e fluxo da página

#### 2. **Components (UI Components)**

- **Responsabilidade**: Componentes reutilizáveis de interface
- **Componentes**:
  - **Layout**: `PageContainer` - Container padrão para páginas
  - **Tabelas**: `TaskTable`, `TaskListTable` - Tabelas reutilizáveis para listagem
  - **Dialogs**: `DeleteTaskDialog`, `DeleteTaskListDialog`, `TaskDescriptionDialog`, `TaskListRegisterDialog`, `TaskRegisterDialog`
  - **Headers**: `TasksHeader` - Cabeçalho padrão das páginas
- **Características**:
  - Componentes isolados e reutilizáveis
  - Props para comunicação com parent
  - Emits para comunicação com parent
  - Slots para conteúdo dinâmico
  - **Refatoração**: Componentes de layout e tabelas foram extraídos para reutilização entre views

#### 3. **Stores (State Management Layer)**

- **Responsabilidade**: Gerenciamento de estado global da aplicação
- **Stores**: `auth`, `tasks`, `taskLists`
- **Características**:
  - Estado reativo
  - Ações para modificar estado
  - Getters computados
  - Persistência em localStorage quando necessário

#### 4. **Services (Business/API Layer)**

- **Responsabilidade**: Comunicação com API backend
- **Services**: `authService`, `taskService`, `taskListService`
- **Características**:
  - Métodos específicos para cada endpoint
  - Tratamento de erros
  - Transformação de dados quando necessário

#### 5. **API (Backend Communication)**

- **Responsabilidade**: Cliente HTTP configurado
- **Arquivo**: `api.ts`
- **Características**:
  - Instância Axios configurada
  - Interceptors para token e erros
  - Base URL configurável

#### 6. **Types (Type Definitions)**

- **Responsabilidade**: Definições de tipos TypeScript
- **Arquivos**: `auth.ts`, `task.ts`, `taskList.ts`
- **Características**:
  - Interfaces e tipos compartilhados
  - Tipos para requests e responses
  - Tipos para entidades do domínio

#### 7. **Router (Navigation)**

- **Responsabilidade**: Configuração de rotas e navegação
- **Arquivo**: `router/index.ts`
- **Características**:
  - Definição de rotas
  - Guards de autenticação
  - Lazy loading de componentes

## Decisões Técnicas Aprofundadas

### 1. Vue 3 Composition API vs Options API

**Escolha**: Composition API

**Justificativa**:

- **Organização**: Lógica agrupada por funcionalidade, não por tipo
- **Reutilização**: Composables permitem compartilhar lógica entre componentes
- **TypeScript**: Melhor suporte e inferência de tipos
- **Tree-shaking**: Melhor otimização de bundle
- **Padrão Moderno**: Alinhado com as melhores práticas atuais do Vue

**Alternativa Considerada**: Options API foi descartada por ser menos flexível e ter pior suporte a TypeScript.

### 2. Pinia vs Vuex

**Escolha**: Pinia

**Justificativa**:

- **Simplicidade**: API mais simples e intuitiva
- **TypeScript**: Suporte nativo sem configuração adicional
- **Modularidade**: Stores são automaticamente modulares
- **DevTools**: Integração nativa com Vue DevTools
- **Oficial**: Store oficial recomendado pelo Vue 3

**Alternativa Considerada**: Vuex foi descartado por ser mais verboso e ter configuração mais complexa para TypeScript.

### 3. Vuetify vs Outros UI Frameworks

**Escolha**: Vuetify

**Justificativa**:

- **Material Design**: Design system consistente e familiar
- **Componentes Completos**: Biblioteca extensa de componentes prontos
- **Acessibilidade**: Componentes acessíveis por padrão
- **Responsividade**: Grid system e componentes responsivos
- **Tema**: Sistema de temas customizável
- **Documentação**: Documentação completa e exemplos

**Alternativas Consideradas**:

- **Quasar**: Similar ao Vuetify, mas Vuetify tem melhor integração com Vue 3
- **PrimeVue**: Boa alternativa, mas Vuetify tem mais componentes Material Design
- **Tailwind CSS**: Mais flexível, mas requer mais código para componentes complexos

### 4. Axios vs Fetch API

**Escolha**: Axios

**Justificativa**:

- **Interceptors**: Poderosos interceptors para requests e responses
- **Cancelamento**: Suporte nativo a cancelamento de requisições
- **Transformação**: Transformação automática de dados JSON
- **Timeout**: Suporte nativo a timeout
- **TypeScript**: Melhor suporte a TypeScript
- **Compatibilidade**: Melhor compatibilidade com navegadores antigos

**Alternativa Considerada**: Fetch API foi descartada por não ter interceptors nativos e requerer mais código boilerplate.

### 5. Vite vs Webpack/Vue CLI

**Escolha**: Vite

**Justificativa**:

- **Performance**: HMR extremamente rápido (milissegundos vs segundos)
- **Build**: Build otimizado com Rollup
- **ES Modules**: Suporte nativo a ES modules
- **Configuração**: Configuração mais simples
- **Plugin System**: Sistema de plugins extensível
- **Oficial**: Build tool recomendado pelo Vue 3

**Alternativa Considerada**: Vue CLI foi descartado por ser mais lento e usar Webpack que é mais complexo.

### 6. Vitest vs Jest

**Escolha**: Vitest

**Justificativa**:

- **Vite Integration**: Integração nativa com Vite
- **Performance**: Execução mais rápida
- **ES Modules**: Suporte nativo a ES modules
- **Jest Compatible**: API compatível com Jest
- **TypeScript**: Suporte nativo a TypeScript
- **Watch Mode**: Watch mode mais rápido

**Alternativa Considerada**: Jest foi descartado por ser mais lento e requerer mais configuração para ES modules.

**Nota**: Vitest está configurado e os testes estão implementados para stores, services e componentes principais.

### 7. TypeScript vs JavaScript

**Escolha**: TypeScript

**Justificativa**:

- **Type Safety**: Detecção de erros em tempo de desenvolvimento
- **Autocomplete**: Melhor autocomplete e IntelliSense
- **Refatoração**: Refatoração mais segura
- **Documentação**: Tipos servem como documentação
- **Manutenibilidade**: Código mais fácil de manter
- **Padrão da Indústria**: Amplamente adotado em projetos grandes

**Alternativa Considerada**: JavaScript foi descartado por não oferecer os benefícios de tipagem estática.

### 8. localStorage para Persistência de Estado

**Justificativa**:

- **Simplicidade**: Implementação simples sem dependências
- **Persistência**: Dados persistem entre sessões
- **Performance**: Acesso rápido e síncrono
- **Compatibilidade**: Suporte amplo em navegadores
- **Adequação**: Suficiente para tokens e dados do usuário

**Alternativas Consideradas**:

- **IndexedDB**: Mais poderoso, mas complexidade desnecessária para este caso
- **SessionStorage**: Não persiste entre sessões, não adequado para tokens
- **Cookies**: Mais complexo e menos seguro para tokens

### 9. Guards de Rota no Router

**Justificativa**:

- **Proteção**: Protege rotas que requerem autenticação
- **UX**: Redireciona automaticamente usuários não autenticados
- **Centralizado**: Lógica de autenticação centralizada
- **Manutenibilidade**: Fácil de manter e modificar

**Implementação**: Guards verificam `meta.requiresAuth` e `meta.requiresGuest` para controlar acesso.

### 10. Interceptors Axios para Token e Erros

**Justificativa**:

- **Automação**: Adiciona token automaticamente em todas as requisições
- **Centralização**: Lógica de autenticação centralizada
- **Tratamento de Erros**: Trata erros 401 automaticamente
- **Manutenibilidade**: Um único ponto para modificar comportamento

**Implementação**:

- Request interceptor adiciona token do localStorage
- Response interceptor trata 401 e redireciona para login

### 11. Lazy Loading de Rotas

**Justificativa**:

- **Performance**: Carrega componentes apenas quando necessário
- **Bundle Size**: Reduz tamanho inicial do bundle
- **Code Splitting**: Separação automática de código
- **UX**: Carregamento mais rápido da aplicação inicial

**Implementação**: Uso de `import()` dinâmico nas definições de rotas.

### 12. Stores Separadas por Domínio

**Justificativa**:

- **Separação de Responsabilidades**: Cada store gerencia um domínio específico
- **Modularidade**: Stores independentes e testáveis
- **Manutenibilidade**: Fácil localizar e modificar lógica específica
- **Escalabilidade**: Fácil adicionar novos stores para novos domínios

**Estrutura**: `auth.ts`, `tasks.ts`, `taskLists.ts` - cada um gerencia seu próprio domínio.

### 13. Componentização de Layout e Tabelas

**Justificativa**:

- **Reutilização**: Componentes de layout e tabelas podem ser reutilizados em múltiplas views
- **Consistência**: Garante layout e comportamento consistente entre páginas
- **Manutenibilidade**: Mudanças no layout ou tabelas são centralizadas
- **DRY**: Evita duplicação de código entre views

**Componentes Criados**:

- **PageContainer**: Componente que encapsula o layout padrão (container, row, col, card) usado em todas as views principais
- **TaskTable**: Componente reutilizável para exibir lista de tarefas com labels, checkbox, ações e truncamento de descrição
- **TaskListTable**: Componente reutilizável para exibir lista de task lists com formatação de data e ações

**Refatoração Realizada**:

- `TaskListsView.vue` e `TasksView.vue` foram refatoradas para usar os novos componentes
- Código mais limpo e focado na lógica de negócio
- Labels "Título" e "Descrição" adicionados na tabela de tarefas para melhor UX

## Melhorias e Roadmap

### Curto Prazo

1. **Refresh Token**: Implementar renovação automática de tokens
   - Interceptor para detectar token expirado
   - Chamada automática ao endpoint de refresh
   - Atualização transparente do token

2. **Expandir Testes Unitários**: Aumentar cobertura de testes
   - Testes para todos os componentes restantes (PageContainer, TaskTable, TaskListTable)
   - Testes para views refatoradas
   - Testes de integração
   - Cobertura mínima de 80%

3. **Loading States**: Melhorar feedback visual de carregamento
   - Skeleton loaders
   - Loading states granulares por operação
   - Progress indicators

4. **Notificações Toast**: Sistema de notificações
   - Sucesso, erro, warning, info
   - Posicionamento configurável
   - Auto-dismiss configurável

5. **Validação de Formulários**: Validação mais robusta
   - Validação em tempo real
   - Mensagens de erro claras
   - Validação customizada

6. **Filtros e Busca**: Funcionalidades de filtro
   - Filtro por status (completa/pendente)
   - Busca por título/descrição
   - Filtros combinados

7. **Melhorias de Componentização**: Expandir reutilização
   - Extrair componentes comuns adicionais
   - Criar composables para lógica compartilhada
   - Padronizar padrões de componentes

### Médio Prazo

1. **Paginação**: Implementar paginação completa
   - Paginação no frontend
   - Integração com paginação do backend
   - Navegação entre páginas

2. **Drag and Drop**: Reordenar tarefas
   - Drag and drop para reordenar
   - Mover tarefas entre listas
   - Persistência da ordem

3. **Modo Escuro**: Suporte a tema escuro
   - Toggle de tema
   - Persistência da preferência
   - Transição suave

4. **Offline Support**: Funcionalidade offline
   - Service Worker
   - Cache de dados
   - Sincronização quando online

5. **PWA**: Transformar em Progressive Web App
   - Manifest.json
   - Service Worker
   - Instalável
   - Notificações push (opcional)

6. **Internacionalização (i18n)**: Suporte a múltiplos idiomas
   - Vue I18n
   - Traduções para PT-BR e EN
   - Detecção automática de idioma

7. **Testes E2E**: Testes end-to-end
   - Playwright ou Cypress
   - Testes de fluxos críticos
   - CI/CD integration

### Longo Prazo

1. **Real-time Updates**: Atualizações em tempo real
   - WebSockets ou Server-Sent Events
   - Sincronização multi-tab
   - Notificações em tempo real

2. **Colaboração**: Funcionalidades colaborativas
   - Compartilhamento de listas
   - Edição simultânea
   - Comentários em tarefas

3. **Anexos**: Upload de arquivos
   - Upload de arquivos para tarefas
   - Preview de imagens
   - Download de arquivos

4. **Analytics**: Analytics e métricas
   - Tracking de eventos
   - Métricas de uso
   - Dashboard de analytics

5. **Acessibilidade**: Melhorias de acessibilidade
   - ARIA labels completos
   - Navegação por teclado
   - Screen reader support
   - Testes de acessibilidade

6. **Performance**: Otimizações de performance
   - Virtual scrolling para listas grandes
   - Lazy loading de imagens
   - Code splitting avançado
   - Bundle optimization

7. **Micro-frontends**: Arquitetura de micro-frontends (se necessário)
   - Module Federation
   - Deploy independente
   - Escalabilidade horizontal

8. **GraphQL**: Alternativa ao REST
   - Apollo Client ou urql
   - Queries flexíveis
   - Cache inteligente

9. **State Management Avançado**: Patterns avançados
   - Composables reutilizáveis
   - State machines (XState)
   - Optimistic updates

10. **CI/CD Completo**: Pipeline completo
    - Testes automatizados
    - Build automatizado
    - Deploy automatizado
    - Preview deployments

## Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run dev -- --port 3000` - Inicia em porta customizada
- `npm run dev -- --host` - Expõe para rede local

### Build

- `npm run build` - Build para produção (inclui type-check)
- `npm run build-only` - Build sem type-check
- `npm run preview` - Preview da build de produção

### Qualidade de Código

- `npm run type-check` - Verifica tipos TypeScript
- `npm run lint` - Executa ESLint e corrige automaticamente
- `npm run format` - Formata código com Prettier

### Qualidade de Código

- `npm run lint` - Executa ESLint e corrige automaticamente
- `npm run format` - Formata código com Prettier
- `npm run type-check` - Verifica tipos TypeScript

## Refatorações e Melhorias Recentes

### Componentização de Layout e Tabelas

O projeto passou por uma refatoração importante para melhorar a reutilização de código e consistência visual:

#### Novos Componentes Criados

1. **PageContainer.vue**
   - Componente reutilizável que encapsula o layout padrão de páginas
   - Inclui container, row, col e card com slots para header e conteúdo
   - Usado em `TaskListsView` e `TasksView` para manter consistência visual
   - Facilita manutenção e padronização do layout

2. **TaskTable.vue**
   - Componente reutilizável para exibição de lista de tarefas
   - Inclui labels "Título" e "Descrição" para melhor UX
   - Suporta checkbox para marcar como concluída
   - Truncamento automático de descrições longas (>100 caracteres)
   - Botões de ação (editar, deletar, ver descrição completa)
   - Emite eventos para comunicação com a view pai

3. **TaskListTable.vue**
   - Componente reutilizável para exibição de lista de task lists
   - Formatação automática de datas em português brasileiro
   - Ícones e ações (editar, deletar, navegar)
   - Emite eventos para comunicação com a view pai

#### Benefícios da Refatoração

- **Reutilização**: Componentes podem ser usados em múltiplas views
- **Consistência**: Layout e comportamento uniformes entre páginas
- **Manutenibilidade**: Mudanças centralizadas em componentes reutilizáveis
- **Código Limpo**: Views focadas apenas na lógica de negócio
- **DRY**: Eliminação de duplicação de código

#### Views Refatoradas

- `TaskListsView.vue`: Agora usa `PageContainer` e `TaskListTable`
- `TasksView.vue`: Agora usa `PageContainer` e `TaskTable`

## Funcionalidades Implementadas

### Autenticação

- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Validação de formulários
- ✅ Persistência de sessão (localStorage)
- ✅ Guards de rota para proteção
- ✅ Logout
- ✅ Redirecionamento automático em caso de token expirado

### Gerenciamento de Tarefas

- ✅ Listar todas as tarefas do usuário
- ✅ Criar nova tarefa
- ✅ Editar tarefa existente
- ✅ Marcar/desmarcar tarefa como concluída
- ✅ Excluir tarefa
- ✅ Visualizar descrição detalhada
- ✅ Paginação de tarefas
- ✅ Filtro por lista de tarefas

### Gerenciamento de Listas de Tarefas

- ✅ Listar todas as listas do usuário
- ✅ Criar nova lista
- ✅ Editar lista existente
- ✅ Excluir lista
- ✅ Navegação entre listas
- ✅ Paginação de listas

### Interface do Usuário

- ✅ Interface responsiva com Material Design
- ✅ Dialogs modais para ações
- ✅ Feedback visual de ações
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Componentização de layout e tabelas para reutilização
- ✅ Labels claros para campos (Título e Descrição)
- ✅ Layout consistente entre páginas usando PageContainer

### Integração com Backend

- ✅ Comunicação via REST API
- ✅ Autenticação JWT
- ✅ Interceptors para adicionar token automaticamente
- ✅ Tratamento de erros de autenticação
- ✅ Redirecionamento automático em caso de token expirado

## Rotas da Aplicação

- `/` - Lista de listas de tarefas (protegida)
- `/login` - Tela de login (pública, redireciona se autenticado)
- `/register` - Tela de registro (pública, redireciona se autenticado)
- `/tasks/:id` - Gerenciamento de tarefas de uma lista específica (protegida)

## Guards de Rota

- **Rotas Protegidas** (`/`, `/tasks/:id`): Requerem autenticação, redirecionam para `/login` se não autenticado
- **Rotas Públicas** (`/login`, `/register`): Redirecionam para `/` se já autenticado

## Gerenciamento de Estado (Pinia)

### Auth Store

- `user`: Dados do usuário logado
- `accessToken`: Token JWT de acesso
- `refreshToken`: Token JWT de refresh
- `isAuthenticated`: Computed que verifica se está autenticado
- `login()`: Método para fazer login
- `register()`: Método para registrar novo usuário
- `logout()`: Método para fazer logout
- `loadFromStorage()`: Carrega dados do localStorage

### Tasks Store

- `tasks`: Lista de tarefas
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `fetchAll()`: Buscar todas as tarefas
- `fetchByListId()`: Buscar tarefas de uma lista
- `create()`: Criar nova tarefa
- `update()`: Atualizar tarefa
- `remove()`: Excluir tarefa

### TaskLists Store

- `taskLists`: Lista de listas de tarefas
- `currentList`: Lista atual selecionada
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `fetchAll()`: Buscar todas as listas
- `fetchById()`: Buscar lista por ID
- `create()`: Criar nova lista
- `update()`: Atualizar lista
- `remove()`: Excluir lista

## Serviços de API

### AuthService

- `register(data)`: Registrar novo usuário
- `login(data)`: Fazer login
- `getCurrentUser()`: Buscar dados do usuário atual

### TaskService

- `getAll(page, size, taskListId, title)`: Listar tarefas com paginação
- `getAllWithoutPagination(taskListId, title)`: Listar todas as tarefas
- `getById(id)`: Buscar tarefa por ID
- `create(data)`: Criar tarefa
- `update(id, data)`: Atualizar tarefa
- `delete(id)`: Excluir tarefa

### TaskListService

- `getAll(page, size, name)`: Listar listas com paginação
- `getAllWithoutPagination(name)`: Listar todas as listas
- `getById(id)`: Buscar lista por ID
- `create(data)`: Criar lista
- `update(id, data)`: Atualizar lista
- `delete(id)`: Excluir lista

## Interceptors HTTP

O serviço de API (`api.ts`) inclui:

- **Request Interceptor**: Adiciona automaticamente o token JWT no header `Authorization` de todas as requisições
- **Response Interceptor**: Trata erros 401 (não autorizado), remove tokens do localStorage e redireciona para `/login`

## Validações

- Email válido (formato)
- Campos obrigatórios
- Senha com mínimo de 6 caracteres
- Confirmação de senha no registro
- Validação de formulários em tempo real
