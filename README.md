# Tasklist Frontend - Sistema TODO List Multi-usuário

![Jtech Logo](http://www.jtech.com.br/wp-content/uploads/2015/06/logo.png)

## Visão Geral

Frontend desenvolvido em Vue 3 com TypeScript para gerenciamento de tarefas (TODO List) multi-usuário, integrado com backend Spring Boot.

## Stack Tecnológica

- **Vue 3**: Framework JavaScript progressivo (Composition API)
- **TypeScript**: Tipagem estática para maior segurança
- **Vue Router 4**: Roteamento e navegação
- **Pinia**: Gerenciamento de estado global
- **Vuetify**: Framework Material Design para UI
- **Axios**: Cliente HTTP para comunicação com API
- **Vitest**: Framework de testes unitários
- **Vite**: Build tool e dev server

## Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos (CSS, imagens)
├── components/       # Componentes Vue reutilizáveis
├── router/          # Configuração de rotas
├── services/        # Serviços de API
│   ├── api.ts       # Cliente HTTP configurado
│   ├── authService.ts
│   └── taskService.ts
├── stores/          # Stores Pinia
│   ├── auth.ts      # Store de autenticação
│   └── tasks.ts     # Store de tarefas
├── types/           # Definições TypeScript
│   ├── auth.ts
│   └── task.ts
├── views/           # Views/Páginas
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── TasksView.vue
├── App.vue          # Componente raiz
└── main.ts          # Ponto de entrada
```

## Pré-requisitos

- Node.js 20.19.0+ ou 22.12.0+
- npm ou yarn
- Backend rodando (ver README do backend)

## Instalação

```bash
# Instalar dependências
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure a URL da API no arquivo `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## Testes

```bash
# Executar testes unitários
npm run test:unit
```

## Funcionalidades Implementadas

### Autenticação

- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Validação de formulários
- ✅ Persistência de sessão (localStorage)
- ✅ Guards de rota para proteção

### Gerenciamento de Tarefas

- ✅ Listar todas as tarefas do usuário
- ✅ Criar nova tarefa
- ✅ Editar tarefa existente
- ✅ Marcar/desmarcar tarefa como concluída
- ✅ Excluir tarefa
- ✅ Interface responsiva com Material Design

### Integração com Backend

- ✅ Comunicação via REST API
- ✅ Autenticação JWT
- ✅ Interceptors para adicionar token automaticamente
- ✅ Tratamento de erros de autenticação
- ✅ Redirecionamento automático em caso de token expirado

## Rotas

- `/login` - Tela de login
- `/register` - Tela de registro
- `/tasks` - Gerenciamento de tarefas (protegida)

## Guards de Rota

- Rotas protegidas (`/tasks`) requerem autenticação
- Rotas públicas (`/login`, `/register`) redirecionam para `/tasks` se já autenticado

## Gerenciamento de Estado (Pinia)

### Auth Store
- `user`: Dados do usuário logado
- `accessToken`: Token JWT de acesso
- `isAuthenticated`: Computed que verifica se está autenticado
- `login()`: Método para fazer login
- `register()`: Método para registrar novo usuário
- `logout()`: Método para fazer logout

### Tasks Store
- `tasks`: Lista de tarefas
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `fetchAll()`: Buscar todas as tarefas
- `create()`: Criar nova tarefa
- `update()`: Atualizar tarefa
- `remove()`: Excluir tarefa

## Serviços de API

### AuthService
- `register(data)`: Registrar novo usuário
- `login(data)`: Fazer login

### TaskService
- `getAll()`: Listar todas as tarefas
- `getById(id)`: Buscar tarefa por ID
- `create(data)`: Criar tarefa
- `update(id, data)`: Atualizar tarefa
- `delete(id)`: Excluir tarefa

## Interceptors HTTP

O serviço de API (`api.ts`) inclui:

- **Request Interceptor**: Adiciona automaticamente o token JWT no header `Authorization`
- **Response Interceptor**: Trata erros 401 (não autorizado) e redireciona para login

## Validações

- Email válido
- Campos obrigatórios
- Senha com mínimo de 6 caracteres
- Confirmação de senha no registro

## Próximos Passos

1. Implementar refresh token
2. Adicionar testes unitários para componentes
3. Implementar loading states mais granulares
4. Adicionar notificações toast
5. Implementar filtros e busca de tarefas
6. Adicionar paginação

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build de produção
- `npm run test:unit` - Executa testes unitários
- `npm run lint` - Executa linter
- `npm run format` - Formata código com Prettier
- `npm run type-check` - Verifica tipos TypeScript

## Troubleshooting

### Erro de CORS

Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend. O backend deve ter CORS habilitado para `http://localhost:5173`.

### Token não está sendo enviado

Verifique se o token está sendo salvo no localStorage após o login. O interceptor adiciona automaticamente o token nas requisições.

### Erro 401 (Não autorizado)

O token pode ter expirado. O interceptor redireciona automaticamente para `/login` em caso de 401.
