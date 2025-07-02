# 🚀 API REST - Desafio DevOps

Uma aplicação Node.js simples com API REST completa, utilizando PostgreSQL e Prisma ORM.

## 📋 Requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM para Node.js
- **Helmet** - Middleware de segurança
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd -Desafio-DevOps
```

### 2. Instale as dependências
```bash
cd backend
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cd backend
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/desafio_devops_db"

# Configurações de Segurança
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BCRYPT_ROUNDS=12
```

### 4. Configure o banco de dados PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE desafio_devops_db;
```

### 5. Execute as migrações do Prisma
```bash
cd backend
npm run db:migrate
```

### 6. Gere o cliente Prisma
```bash
cd backend
npm run db:generate
```

### 7. (Opcional) Popule o banco com dados de exemplo
```bash
cd backend
npm run db:seed
```

## 🏃‍♂️ Como Executar

### Modo Desenvolvimento
```bash
cd backend
npm run dev
```

### Modo Produção
```bash
cd backend
npm start
```

A API estará disponível em: `http://localhost:3000`

## 📚 Endpoints da API

### Health Check
- **GET** `/health` - Verificar status da API

### Usuários (CRUD Completo)

#### Listar todos os usuários
- **GET** `/api/users`
- **Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "email": "joao@example.com",
      "name": "João Silva",
      "age": 25,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Buscar usuário por ID
- **GET** `/api/users/:id`
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "email": "joao@example.com",
    "name": "João Silva",
    "age": 25,
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Criar novo usuário
- **POST** `/api/users`
- **Body:**
```json
{
  "email": "novo@example.com",
  "name": "Novo Usuário",
  "password": "senha123",
  "age": 30
}
```
- **Resposta:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "clx123...",
    "email": "novo@example.com",
    "name": "Novo Usuário",
    "age": 30,
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Atualizar usuário
- **PUT** `/api/users/:id`
- **Body:**
```json
{
  "name": "Nome Atualizado",
  "age": 31,
  "active": false
}
```
- **Resposta:**
```json
{
  "success": true,
  "message": "Usuário atualizado com sucesso",
  "data": {
    "id": "clx123...",
    "email": "novo@example.com",
    "name": "Nome Atualizado",
    "age": 31,
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Deletar usuário
- **DELETE** `/api/users/:id`
- **Resposta:**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: users
| Campo     | Tipo      | Descrição                    |
|-----------|-----------|------------------------------|
| id        | String    | ID único (CUID)              |
| email     | String    | Email único                  |
| name      | String    | Nome do usuário              |
| password  | String    | Senha (em produção, criptografada) |
| age       | Int       | Idade (opcional)             |
| active    | Boolean   | Status ativo/inativo         |
| createdAt | DateTime  | Data de criação              |
| updatedAt | DateTime  | Data de atualização          |

## 📁 Estrutura do Projeto

```
-Desafio-DevOps/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js    # Lógica de negócio dos usuários
│   │   ├── database/
│   │   │   ├── connection.js        # Conexão com banco de dados
│   │   │   └── seed.js             # Dados de exemplo
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Tratamento de erros
│   │   ├── routes/
│   │   │   └── userRoutes.js        # Rotas da API
│   │   └── server.js               # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma           # Schema do banco de dados
│   ├── package.json                # Dependências e scripts
│   ├── env.example                 # Template de variáveis de ambiente
│   ├── Dockerfile                  # Configuração Docker
│   └── test-api.http              # Exemplos de requisições
├── docker-compose.yml             # Orquestração Docker
├── .gitignore                     # Arquivos ignorados pelo Git
└── README.md                      # Documentação
```

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)
- `npm run db:migrate` - Executa as migrações do banco
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio para visualizar dados
- `npm run db:seed` - Popula o banco com dados de exemplo

## 🔧 Comandos Úteis

### Prisma Studio (Interface visual do banco)
```bash
cd backend
npm run db:studio
```

### Verificar status do banco
```bash
cd backend
npx prisma db pull
```

### Resetar banco de dados
```bash
cd backend
npx prisma migrate reset
```

## 🧪 Testando a API

### Usando cURL

#### Listar usuários
```bash
curl http://localhost:3000/api/users
```

#### Criar usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "name": "Usuário Teste",
    "password": "senha123",
    "age": 25
  }'
```

#### Buscar usuário por ID
```bash
curl http://localhost:3000/api/users/USER_ID_AQUI
```

#### Atualizar usuário
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "age": 26
  }'
```

#### Deletar usuário
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_AQUI
```

### Usando Postman ou Insomnia

Importe a coleção de endpoints ou teste manualmente usando os exemplos acima.

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Configurado para permitir requisições cross-origin
- **Validação** - Validações básicas nos endpoints
- **Tratamento de Erros** - Middleware centralizado para tratamento de erros

## 🚀 Próximos Passos

Para melhorar a aplicação, considere implementar:

1. **Autenticação JWT** - Sistema de login/logout
2. **Validação com Joi ou Yup** - Validação mais robusta
3. **Rate Limiting** - Limitação de requisições
4. **Logs estruturados** - Winston ou Pino
5. **Testes automatizados** - Jest ou Mocha
6. **Documentação com Swagger** - OpenAPI
7. **Docker** - Containerização
8. **CI/CD** - Pipeline de deploy

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para o Desafio DevOps** 