# 🚀 CI/CD Pipeline - Desafio DevOps

Este projeto possui um pipeline completo de **Integração Contínua (CI)** e **Entrega Contínua (CD)** usando GitHub Actions.

## 📋 Workflows

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Executa em pushes para `main`, `develop`, `feature/*` e `hotfix/*`:
- 📏 **Linting e Formatação** com ESLint e Prettier
- ✅ **Testes** com PostgreSQL e Jest
- 🔒 **SAST Scan** com Trivy (vulnerabilidades na imagem Docker)
- 🛡️ **DAST Scan** com script personalizado (testes de segurança da aplicação)
- 🐳 **Build** da imagem Docker
- 📦 **Push** para Docker Hub
- 📢 **Notificação** de sucesso

### 2. **Pull Request Check** (`.github/workflows/pr-check.yml`)
Executa em Pull Requests:
- 📏 **Linting e Formatação** com ESLint e Prettier
- ✅ **Testes** com PostgreSQL e Jest
- 🔍 **Verificação de qualidade** do código
- 🔒 **SAST Scan** básico

## 🛠️ Configuração

### 1. **Secrets do GitHub**
Configure no seu repositório (`Settings > Secrets and variables > Actions`):

```bash
# Cadastra como repositorio vars
DOCKERHUB_USERNAME=seu_usuario_dockerhub 
# Cadastra como repositorio secret
DOCKERHUB_TOKEN=seu_token_dockerhub
```

### 2. **Docker Hub**
1. Crie uma conta no [Docker Hub](https://hub.docker.com)
2. Crie um token de acesso em `Account Settings > Security`
3. Configure os secrets acima

### 3. **Imagem Docker**
A imagem será publicada como:
```
1234samue/desafio-devops-api:latest
```

### 4. **Segurança**
O pipeline inclui múltiplas camadas de segurança:
- **SAST (Static Analysis)**: Trivy analisa a imagem Docker
- **DAST (Dynamic Analysis)**: Script personalizado testa a aplicação em execução
- **Dependências**: Verificação automática de vulnerabilidades
- **Headers de Segurança**: Verificação de headers HTTP de segurança

#### **Scripts de Segurança Criados:**
- `backend/scripts/simple-dast.js` - Testes DAST personalizados
- `backend/scripts/dast-mode.js` - Servidor mock para testes DAST
- `backend/scripts/dast-scan.js` - Script DAST avançado (com suporte a banco)

## 🚀 Como usar

### **Desenvolvimento Local**
```bash
# Qualidade de código
cd backend
npm run code:check    # Verificar linting e formatação
npm run code:fix      # Corrigir automaticamente

# Testes
npm test

# DAST Scan local
TARGET_URL=http://localhost:3000 node scripts/simple-dast.js

# SAST Scan local (se Trivy instalado)
trivy image desafio-devops-api:local
```

### **Produção com Docker Hub**
```bash
# Usar imagem do Docker Hub
docker pull 1234samue/desafio-devops-api:latest

# Ou usar docker-compose
docker-compose -f backend/docker-compose.prod.yml up -d
```

## 📊 Status do Pipeline

O pipeline executa automaticamente:

1. **Push para `main`/`develop`/`feature/*`/`hotfix/*`** → Testes + SAST + DAST 
3. **Push para `main`/`develop`/`feature/*`/`hotfix/*`** → Testes + SAST + DAST + Build + Push Docker Hub
4. **Pull Request** → Testes + SAST básico
5. **Falha em qualquer etapa** → Pipeline para, não faz deploy
6. **Vulnerabilidades críticas/altas** → Pipeline falha automaticamente

## 🔧 Personalização

### **Alterar nome da imagem**
Edite em `.github/workflows/ci.yml`:
```yaml
env:
  DOCKER_IMAGE_NAME: seu-usuario/sua-imagem
  DOCKER_TAG: latest
```

### **Adicionar mais testes**
Adicione em `backend/tests/` e configure no `package.json`

### **Configurar DAST Scan**
Edite `backend/scripts/simple-dast.js` para adicionar novos testes de segurança

### **Alterar branches**
Edite em `.github/workflows/ci.yml`:
```yaml
on:
  push:
    branches: [ main, develop, feature/*, hotfix/* ]
```

## 🐛 Troubleshooting

### **Erro de autenticação Docker Hub**
- Verifique se os secrets estão configurados
- Confirme se o token tem permissões de push

### **Falha nos testes**
- Verifique se o PostgreSQL está rodando
- Confirme se as variáveis de ambiente estão corretas
- Execute `npm run test:setup` para configurar banco de teste

### **Falha no SAST Scan**
- Verifique se a imagem Docker foi buildada corretamente
- Confirme se o Trivy está funcionando

### **Falha no DAST Scan**
- Verifique se o servidor está rodando na porta 3000
- Confirme se as dependências foram instaladas (`npm ci`)

### **Build falha**
- Verifique se o Dockerfile está correto
- Confirme se o .dockerignore está configurado

## 📈 Próximos Passos

Para melhorar o pipeline, considere:

1. **Deploy automático** para servidores (AWS, GCP, Azure)
2. **Testes de performance** com Artillery ou k6
3. **Análise de código** com SonarQube ou CodeClimate
4. **Notificações** via Slack/Discord/Teams
5. **Rollback automático** em caso de falha
6. **Monitoramento** com Prometheus/Grafana
7. **Logs centralizados** com ELK Stack
8. **Testes de integração** mais abrangentes

---

**Pipeline configurado e pronto para uso! 🎯** 