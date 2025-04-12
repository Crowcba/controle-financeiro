# Sistema de Controle Financeiro

Sistema de controle financeiro pessoal com autenticação de usuários e gerenciamento de investimentos.

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
```

2. Instale as dependências:
```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```
MONGODB_URI=sua_url_do_mongodb
JWT_SECRET=seu_secret_key
PORT=5000
```

4. Inicie o servidor:
```bash
npm start
```

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
4. Deploy automático

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request. 