# Sistema de Controle Financeiro

Sistema de controle financeiro pessoal com autenticação de usuários e gerenciamento de investimentos.

## Estrutura do Projeto

O projeto está organizado em duas pastas principais:
- `client/`: Frontend em React
- `server/`: Backend em Node.js/Express

## Funcionalidades

- Autenticação de usuários (registro e login)
- Gerenciamento de investimentos (CDB, Tesouro Direto, LCI, LCA)
- Cálculo automático de rendimentos
- Interface segura e personalizada por usuário

## Requisitos

- Node.js (v14 ou superior)
- MongoDB
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd finance-control
```

2. Instale as dependências:
```bash
npm run install-all
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na pasta `server` com as seguintes variáveis:
```
MONGODB_URI=sua_url_do_mongodb
JWT_SECRET=seu_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

4. Inicie o projeto em modo desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor e o cliente em modo desenvolvimento
- `npm run server`: Inicia apenas o servidor
- `npm run client`: Inicia apenas o cliente
- `npm run build`: Cria a build de produção do cliente
- `npm start`: Inicia o servidor em modo produção

## API Endpoints

### Autenticação
- POST /api/auth/register - Registrar novo usuário
- POST /api/auth/login - Login de usuário

### Investimentos
- GET /api/investments - Listar investimentos do usuário
- POST /api/investments - Criar novo investimento
- PUT /api/investments/:id - Atualizar investimento
- DELETE /api/investments/:id - Deletar investimento

## Deploy

O sistema pode ser facilmente implantado no Render:

1. Crie uma conta no Render
2. Conecte seu repositório
3. Configure as variáveis de ambiente
4. Configure o Build Command:
```bash
npm run install-all && npm run build
```
5. Configure o Start Command:
```bash
npm start
```

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request. 