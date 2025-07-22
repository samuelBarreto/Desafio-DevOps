# 📋 Pré-requisitos - Desafio DevOps

Este documento lista todos os pré-requisitos necessários para executar o projeto localmente.

## 🖥️ Sistema Operacional

- **Windows** 10/11
- **macOS** 10.15+
- **Linux** (Ubuntu 18.04+, CentOS 7+, etc.)

## 🔧 Ferramentas Obrigatórias

### 1. Node.js
- **Versão**: 16.0.0 ou superior
- **Download**: https://nodejs.org/
- **Verificação**: `node --version`

### 2. npm
- **Versão**: 8.0.0 ou superior (vem com Node.js)
- **Verificação**: `npm --version`

### 3. Git
- **Versão**: 2.20.0 ou superior
- **Download**: https://git-scm.com/
- **Verificação**: `git --version`

## 🗄️ Banco de Dados

### PostgreSQL
- **Versão**: 12.0 ou superior
- **Download**: https://www.postgresql.org/download/

#### Instalação por Sistema:

**Windows:**
1. Baixe o instalador do PostgreSQL
2. Execute o instalador
3. Configure senha do usuário `postgres`
4. Mantenha a porta padrão (5432)

**macOS:**
```bash
# Usando Homebrew
brew install postgresql
brew services start postgresql

# Ou usando Postgres.app
# Download: https://postgresapp.com/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Configuração do PostgreSQL:
```sql
-- Conectar como usuário postgres
sudo -u postgres psql

-- Criar banco de dados
CREATE DATABASE desafio;

-- Criar usuário (opcional)
CREATE USER desafio_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE desafio TO desafio_user;

-- Sair
\q
```

## 🐳 Ferramentas Opcionais

### Docker (Recomendado)
- **Versão**: 20.10.0 ou superior
- **Download**: https://www.docker.com/products/docker-desktop

**Benefícios:**
- Execução isolada do PostgreSQL
- Ambiente de desenvolvimento consistente
- Facilita deploy e testes

### Docker Compose
- **Versão**: 2.0.0 ou superior
- **Incluído**: Com Docker Desktop

## 📝 Editor de Código

### VS Code (Recomendado)
- **Download**: https://code.visualstudio.com/
- **Extensões recomendadas**:
  - ESLint (`esbenp.prettier-vscode`)
  - Prettier (`esbenp.prettier-vscode`)
  - Prisma (`Prisma.prisma`)
  - REST Client (`humao.rest-client`)

## 🔍 Verificação de Pré-requisitos

### Script Automático
```bash
cd backend
npm run setup
```

### Verificação Manual
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version

# Verificar Docker (opcional)
docker --version

# Verificar PostgreSQL
psql --version
```

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente
O projeto usa um arquivo `.env` para configurações:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/desafio?schema=public"

# Configurações de Segurança
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BCRYPT_ROUNDS=12
```

### 2. Configuração do Banco
```bash
# Conectar ao PostgreSQL
psql -U postgres -d desafio

# Verificar conexão
\dt
```

## 🚀 Setup Rápido

### Windows
```bash
# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
cd Desafio-DevOps/backend

# Execute o setup
setup.bat
```

### Linux/macOS
```bash
# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
```

### Usando npm
```bash
# Execute o setup
npm run setup
```

## 🐛 Troubleshooting

### Node.js não encontrado
```bash
# Windows: Reinstale o Node.js
# Linux/macOS:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### PostgreSQL não conecta
```bash
# Verificar se está rodando
sudo systemctl status postgresql

# Iniciar se necessário
sudo systemctl start postgresql

# Verificar porta
sudo netstat -tlnp | grep 5432
```

### Permissões no Linux
```bash
# Dar permissão de execução aos scripts
chmod +x setup.sh
chmod +x scripts/*.sh
```

### Problemas de Dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Adicionais

- **Node.js Docs**: https://nodejs.org/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Docker Docs**: https://docs.docker.com/

---

**Com todos os pré-requisitos instalados, você pode executar o projeto! 🚀** 