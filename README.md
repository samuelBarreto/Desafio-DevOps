# 🚀 API REST - Desafio DevOps

Uma aplicação Node.js completa com API REST, PostgreSQL, Prisma ORM, testes automatizados, CI/CD pipeline e múltiplas camadas de segurança.

## 🎯 Sobre o Projeto

Este projeto demonstra uma implementação completa de uma API REST seguindo as melhores práticas de desenvolvimento, incluindo:

- ✅ **API REST completa** com CRUD de usuários
- 🗄️ **Banco de dados PostgreSQL** com Prisma ORM
- 🧪 **Testes automatizados** com Jest
- 🔒 **Múltiplas camadas de segurança** (SAST, DAST, Headers)
- 📏 **Qualidade de código** com ESLint e Prettier
- 🚀 **CI/CD Pipeline** com GitHub Actions
- 🐳 **Containerização** com Docker
- 📚 **Documentação completa**
- ⚡ **Setup automatizado** para desenvolvimento

## 📋 Requisitos 

### Para Execução Local
- **Node.js** (versão 16 ou superior)
- **PostgreSQL** - recomendação usar o ***docker*** -> (Opcional instalar o postgres versão 12 ou superior) 
- **npm** ou **yarn**
- **Git**

### Para Execução com Docker
- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git**

### Opcional (Recomendado)
- **VS Code** com extensões recomendadas
- **Postman** ou **Insomnia** para testar a API

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para Node.js

### Segurança
- **Helmet** - Headers de segurança
- **CORS** - Cross-Origin Resource Sharing
- **Trivy** - SAST (Static Application Security Testing)
- **Scripts DAST** - Dynamic Application Security Testing

### Qualidade e Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD Pipeline
- **Docker Hub** - Registry de imagens

### Ferramentas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **Nodemon** - Hot reload para desenvolvimento

## 🗄️ Estrutura do Banco de Dados

### Tabela: users
| Campo     | Tipo      | Descrição                          |
|-----------|-----------|------------------------------------|
| id        | String    | ID único (CUID)                    |
| email     | String    | Email único                        |
| name      | String    | Nome do usuário                    |
| password  | String    | Senha (em produção, criptografada) |
| age       | Int       | Idade (opcional)                   |
| active    | Boolean   | Status ativo/inativo               |
| createdAt | DateTime  | Data de criação                    |
| updatedAt | DateTime  | Data de atualização                |

## 📁 Estrutura do Projeto

```
-Desafio-DevOps/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js    # Lógica de negócio dos usuários
│   │   ├── database/
│   │   │   ├── connection.js        # Conexão com banco de dados
│   │   │   ├── seed.js             # Dados de exemplo
│   │   │   └── reset.js            # Scripts de reset do banco
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Tratamento de erros
│   │   ├── routes/
│   │   │   └── userRoutes.js        # Rotas da API
│   │   └── server.js               # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma           # Schema do banco de dados
│   ├── scripts/
│   │   ├── setup-local.js          # Setup automatizado
│   │   ├── setup-test-db.js        # Configuração banco de testes
│   │   ├── dast-scan.js            # Scripts de segurança DAST
│   │   ├── simple-dast.js          # DAST simplificado
│   │   └── dast-mode.js            # Servidor mock para DAST
│   ├── tests/
│   │   ├── config.js               # Configuração de testes
│   │   ├── setup.js                # Setup de testes
│   │   └── users.test.js           # Testes de usuários
│   ├── .vscode/
│   │   └── settings.json           # Configurações do VS Code
│   ├── package.json                # Dependências e scripts
│   ├── env.example                 # Template de variáveis de ambiente
│   ├── Dockerfile                  # Configuração Docker
│   ├── setup.bat                   # Setup para Windows
│   ├── setup.sh                    # Setup para Linux/Mac
│   ├── .eslintrc.js                # Configuração ESLint
│   ├── .prettierrc                 # Configuração Prettier
│   └── test-api.http              # Exemplos de requisições
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline CI/CD
├── docker-compose.yml             # Orquestração Docker
├── docker-compose.prod.yml        # Docker Compose para produção
├── .gitignore                     # Arquivos ignorados pelo Git
├── README.md                      # Documentação principal
├── CI-CD.md                       # Documentação do pipeline
├── SECURITY.md                    # Documentação de segurança
└── PREREQUISITES.md               # Pré-requisitos detalhados
```

## ⚡ Quick Start

Este comando irão:
- ✅ Criar e configurar o banco PostgreSQL automaticamente -> "você pode usar o container para facilicar o desenvolvimneto (docker-compose)"
- ✅ Build da imagem da aplicação
- ✅ Executar as migrações do Prisma
- ✅ Popular o banco com dados de exemplo (Opcional)
- ✅ Edite o arquivo `.env` com suas configurações (para roda local) - container (docker-compose tem suas env)
- ✅ Iniciar a aplicação


```bash
# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
cd Desafio-DevOps
```
1. Banco de Dados container ou local (Opcional instalar o postgres no desktop)
```bash
# Execute apenas o banco de dados
docker-compose up postgres -d

# Verifique se está rodando
docker-compose ps
```

```sql
-- (Opcional) caso não usar o (docker-compose up postgres -d)

-- Conecte ao PostgreSQL
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE desafio;

-- Crie o schema (se necessário)
CREATE SCHEMA "User";

-- Saia do psql
\q
```

### 2. Aplicação Local
```bash
# Entra na pasta do projeto  Configure o projeto . gerar as .env 
cd backend

# Executar Configure o projeto gerar as .env default para localhost - 1 instalação de pacote, 2 DB geneterd e migrate, 3 test unit, 4  Lint Verificando qualidade do código...
npm run setup

  #  "Atenção" Configure as variáveis de ambiente (Opcional o npm run setup faz este passo com dados default)
  cp env.example .env 

  # "Atenção" Execute as migrações (Opcional Opcional o npm run setup faz este passo com dados default)
  npm "Atenção" run db:migrate

  # "Atenção" Execute o seed para popular o banco de dados (Opcional) "Só pode executar 1x"  
  npm run db:seed

# Inicie a aplicação
npm run dev
```

### 3. Docker Completo (Recomendado)
```bash
# Execute para encerrar os container do postgres do passo anterior 
docker-compose down 

# Execute para fazer a limpeza dos volume anterios caso tenha feito o (npm run db:seed)
 docker system prune --volumes --force && docker volume rm desafio-devops_postgres_data

# Execute tudo com Docker Compose 
docker-compose up -d

# Teste a API
curl http://localhost:3000/health
```

**Pronto!** A API estará rodando em `http://localhost:3000`

---

Após executar qualquer uma das opções acima, teste se a API está funcionando:

```bash
# Health check
curl http://localhost:3000/health

# Listar usuários
curl http://localhost:3000/api/users
```

**Resposta esperada do health check:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Troubleshooting

#### Problemas comuns:

**1. Erro de conexão com banco de dados:**
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `desafio` existe

**2. Erro de permissão no Docker:**
```bash
# No Linux/Mac, pode ser necessário
sudo docker-compose up -d
```

**3. Porta 3000 já em uso:**
- Mude a porta no arquivo `.env` ou `docker-compose.yml`
- Ou pare outros serviços usando a porta 3000

**4. Erro de migração do Prisma:**
```bash
# Reset completo do banco
npm run db:reset

# Ou no Docker
docker-compose exec api npm run db:reset
```

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


## 🛠️ Scripts Disponíveis

### Desenvolvimento
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)

### Banco de Dados
- `npm run db:migrate` - Executa as migrações do banco
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio para visualizar dados
- `npm run db:seed` - Popula o banco com dados de exemplo

### Setup e Configuração
- `npm run setup` - Configuração automática completa do projeto
- `setup.bat` - Script de setup para Windows
- `setup.sh` - Script de setup para Linux/Mac

### Qualidade de Código
- `npm run lint` - Executa ESLint para verificar qualidade do código
- `npm run lint:fix` - Corrige automaticamente problemas de linting
- `npm run format` - Formata o código com Prettier
- `npm run format:check` - Verifica se o código está formatado
- `npm run code:check` - Executa linting e verificação de formatação
- `npm run code:fix` - Corrige automaticamente linting e formatação

### Testes
- `npm test` - Executa os testes com Jest
- `npm run test:setup` - Configura o banco de dados para testes

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

### Camadas de Proteção
- **Helmet** - Headers de segurança HTTP
- **CORS** - Configurado para permitir requisições cross-origin
- **Validação** - Validações básicas nos endpoints
- **Tratamento de Erros** - Middleware centralizado para tratamento de erros

### Testes de Segurança
- **SAST (Trivy)** - Análise estática de vulnerabilidades na imagem Docker
- **DAST (Scripts personalizados)** - Testes dinâmicos de segurança da aplicação
- **Headers de Segurança** - Verificação automática de headers HTTP
- **Pipeline CI/CD** - Verificação automática de segurança em cada deploy

### Configurações de Segurança
- **Usuário não-root** no container Docker
- **Health checks** configurados
- **Variáveis de ambiente** seguras
- **Logs sem dados sensíveis**

## 📏 Qualidade de Código

### Ferramentas
- **ESLint** - Linting de código JavaScript com regras personalizadas
- **Prettier** - Formatação automática de código
- **Configuração VS Code** - Formatação automática ao salvar
- **Pipeline CI** - Verificação automática de qualidade no GitHub Actions

### Configuração do Editor

Para melhor experiência de desenvolvimento, instale as extensões:
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Prisma** (`Prisma.prisma`)
- **REST Client** (`humao.rest-client`)

O projeto já inclui configurações do VS Code em `.vscode/settings.json` para:
- Formatação automática ao salvar
- Correção automática de problemas de linting
- Configuração de fim de linha e espaçamento

### Scripts de Qualidade
```bash
npm run lint              # Verificar qualidade do código
npm run lint:fix          # Corrigir problemas automaticamente
npm run format            # Formatar código
npm run format:check      # Verificar formatação
npm run code:check        # Verificar qualidade e formatação
npm run code:fix          # Corrigir qualidade e formatação
```

## 🚀 Funcionalidades Implementadas

### ✅ Concluído
- [x] **API REST completa** com CRUD de usuários
- [x] **Banco de dados PostgreSQL** com Prisma ORM
- [x] **Testes automatizados** com Jest e Supertest
- [x] **Sistema de segurança** com SAST (Trivy) e DAST (scripts personalizados)
- [x] **Qualidade de código** com ESLint e Prettier
- [x] **CI/CD Pipeline** com GitHub Actions
- [x] **Containerização** com Docker
- [x] **Setup automatizado** para desenvolvimento
- [x] **Documentação completa** (README, CI/CD, Security, Prerequisites)
- [x] **Health checks** e endpoints de status
- [x] **Tratamento de erros** centralizado
- [x] **Headers de segurança** com Helmet

### 🔄 Em Desenvolvimento
- [ ] **Autenticação JWT** - Sistema de login/logout
- [ ] **Validação robusta** - Joi ou Yup
- [ ] **Rate Limiting** - Limitação de requisições
- [ ] **Logs estruturados** - Winston ou Pino

### 📋 Próximos Passos
- [ ] **Documentação API** - Swagger/OpenAPI
- [ ] **Monitoramento** - Prometheus/Grafana
- [ ] **Cache** - Redis
- [ ] **Upload de arquivos** - Multer
- [ ] **Notificações** - Email/SMS
- [ ] **Deploy automático** - AWS/GCP/Azure

### Docker Hub
A imagem está disponível em: `1234samue/desafio-devops-api`

### GitHub Actions
O pipeline automatizado:
1. Executa testes
2. Faz scan de segurança
3. Build da imagem Docker
4. Push para Docker Hub

## 📚 Documentação Adicional

- **[CI-CD.md](CI-CD.md)** - Documentação completa do pipeline CI/CD
- **[SECURITY.md](SECURITY.md)** - Detalhes sobre segurança e testes
- **[PREREQUISITES.md](PREREQUISITES.md)** - Pré-requisitos detalhados

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/teste`)
3. Commit suas mudanças (`git commit -m 'Add some feature/teste'`)
4. Push para a branch (`git push origin feature/teste`)
5. Abra um Pull Request

### Padrões de Contribuição
- Siga as regras de linting e formatação
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Verifique se o pipeline CI/CD passa

---

**Desenvolvido para o Desafio DevOps**

### 📊 Status do Projeto
![CI/CD Pipeline](https://github.com/1234samue/-Desafio-DevOps/workflows/CI%20Pipeline/badge.svg)
![Docker Image](https://img.shields.io/docker/pulls/1234samue/desafio-devops-api)
![License](https://img.shields.io/badge/license-MIT-blue.svg) 