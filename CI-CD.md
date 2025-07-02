# 🚀 CI/CD Pipeline - Desafio DevOps

Este projeto possui um pipeline completo de **Integração Contínua (CI)** e **Entrega Contínua (CD)** usando GitHub Actions.

## 📋 Workflows

### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
Executa em pushes para `main` e `develop`:
- ✅ **Testes** com PostgreSQL
- 🐳 **Build** da imagem Docker
- 📦 **Push** para Docker Hub
- 🔒 **Scan de segurança** com Trivy
- 📢 **Notificação** de sucesso

### 2. **Pull Request Check** (`.github/workflows/pr-check.yml`)
Executa em Pull Requests:
- ✅ **Testes** com PostgreSQL
- 🔍 **Verificação de qualidade** do código

## 🛠️ Configuração

### 1. **Secrets do GitHub**
Configure no seu repositório (`Settings > Secrets and variables > Actions`):

```
DOCKERHUB_USERNAME=seu_usuario_dockerhub
DOCKERHUB_TOKEN=seu_token_dockerhub
```

### 2. **Docker Hub**
1. Crie uma conta no [Docker Hub](https://hub.docker.com)
2. Crie um token de acesso em `Account Settings > Security`
3. Configure os secrets acima

### 3. **Imagem Docker**
A imagem será publicada como:
```
samuelcandrade/desafio-devops-api:latest
```

## 🚀 Como usar

### **Desenvolvimento Local**
```bash
# Testes
cd backend
npm test

# Build local
docker build -t desafio-devops-api:local .
```

### **Produção com Docker Hub**
```bash
# Usar imagem do Docker Hub
docker pull samuelcandrade/desafio-devops-api:latest

# Ou usar docker-compose
docker-compose -f backend/docker-compose.prod.yml up -d
```

## 📊 Status do Pipeline

O pipeline executa automaticamente:

1. **Push para `main`/`develop`** → Testa + Build + Push Docker Hub
2. **Pull Request** → Apenas testes
3. **Falha nos testes** → Pipeline para, não faz deploy

## 🔧 Personalização

### **Alterar nome da imagem**
Edite em `.github/workflows/ci-cd.yml`:
```yaml
env:
  DOCKER_IMAGE_NAME: seu-usuario/sua-imagem
```

### **Adicionar mais testes**
Adicione em `backend/tests/` e configure no `package.json`

### **Alterar branches**
Edite em ambos os workflows:
```yaml
on:
  push:
    branches: [ main, develop, feature/* ]
```

## 🐛 Troubleshooting

### **Erro de autenticação Docker Hub**
- Verifique se os secrets estão configurados
- Confirme se o token tem permissões de push

### **Falha nos testes**
- Verifique se o PostgreSQL está rodando
- Confirme se as variáveis de ambiente estão corretas

### **Build falha**
- Verifique se o Dockerfile está correto
- Confirme se o .dockerignore está configurado

## 📈 Próximos Passos

Para melhorar o pipeline, considere:

1. **Deploy automático** para servidores
2. **Testes de performance** com Artillery
3. **Análise de código** com SonarQube
4. **Notificações** via Slack/Discord
5. **Rollback automático** em caso de falha

---

**Pipeline configurado e pronto para uso! 🎯** 