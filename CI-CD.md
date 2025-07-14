# 🚀 CI/CD Pipeline - Desafio DevOps

Este projeto possui um pipeline completo de **Integração Contínua (CI)**, **Entrega Contínua (CD)** e **Release** usando GitHub Actions e Terraform.

## 📋 Workflows Disponíveis

### 1. **Backend CI Pipeline** (`.github/workflows/backend-ci.yml`)
**Trigger**: Push para `main`, `develop`, `feature/*` e `hotfix/*`
- 📏 **Linting e Formatação** com ESLint e Prettier
- ✅ **Testes** com PostgreSQL e Jest
- 🔒 **SAST Scan** com Trivy (vulnerabilidades na imagem Docker)
- 🛡️ **DAST Scan** com script personalizado (testes de segurança da aplicação)
- 🐳 **Build** da imagem Docker
- 📦 **Push** para Docker Hub
- 📢 **Notificação** de sucesso

### 2. **Terraform CI/CD Pipeline** (`.github/workflows/terraform.yml`)
**Trigger**: Push para `main`, `develop`, `feature/*` e `hotfix/*` (apenas mudanças em `terraform/`)
- 🔍 **Validação** do código Terraform
- 📝 **Formatação** e verificação de sintaxe
- 📋 **Plan** da infraestrutura
- ⚡ **Apply** automático (apenas na branch `main`)
- 🛡️ **Security Scan** com Trivy
- 🧪 **Testes de Infraestrutura** pós-deploy
- 📊 **Métricas** e monitoramento

### 3. **Release Pipeline** (`.github/workflows/release.yml`)
**Trigger**: Manual via `workflow_dispatch`
- 🔍 **Validação** da versão (arquivo `VERSION` ou input manual)
- 🐳 **Build e Push** da imagem Docker com nova versão
- 🖥️ **Atualização da VM** via SSH com `sed`
- 🏷️ **Criação** de Git Tag e GitHub Release
- 🚀 **Deploy automático** da nova versão

### 4. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
**Trigger**: Após conclusão bem-sucedida dos pipelines de Backend CI e Terraform
- 🔍 **Validação** de ambos os workflows (Backend CI e Terraform)
- 🔒 **Lock mechanism** para evitar deploys simultâneos
- ⏳ **Aguardamento** de deploy anterior (se necessário)
- 🔍 **Verificação** de pré-requisitos da infraestrutura
- 🚀 **Deploy** da aplicação via SSH
- 🧪 **Testes pós-deploy** (health check, API, segurança)
- 📊 **Monitoramento** e notificações

### 5. **Pull Request Check** (`.github/workflows/pr-check.yml`)
**Trigger**: Pull Requests para `main` e `develop`
- 📏 **Linting e Formatação** com ESLint e Prettier
- ✅ **Testes** com PostgreSQL e Jest
- 🔍 **Validação** do código Terraform
- 🔒 **SAST Scan** básico

## 🛠️ Configuração

### 1. **Secrets do GitHub**
Configure no seu repositório (`Settings > Secrets and variables > Actions`):

```bash
# AWS Credentials (secrets)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Docker Hub (vars e secrets)
DOCKERHUB_USERNAME=seu_usuario_dockerhub  # vars
DOCKERHUB_TOKEN=seu_token_dockerhub       # secrets

# SSH Key para VM (secrets)
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
sua_chave_privada_ssh_aqui
-----END OPENSSH PRIVATE KEY-----

# Terraform (secrets)
SSH_PUBLIC_KEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...
```

### 2. **Arquivo VERSION**
Controle de versão centralizado:
```bash
# Atualizar versão
echo "1.0.0" > VERSION
git add VERSION
git commit -m "🚀 Bump version to 1.0.0"
git push origin main
```

### 3. **Infraestrutura AWS**
- **EC2 Instance**: Ubuntu para hospedar a aplicação
- **VPC**: Rede virtual privada customizada
- **Security Groups**: Portas 22, 80, 443, 3000
- **Elastic IP**: IP fixo (3.219.24.200)
- **Key Pair**: SSH para acesso à instância

## 🚀 Como Funciona o Fluxo Completo

### **1. Desenvolvimento**
```bash
# Fazer mudanças no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### **2. CI Pipeline**
- ✅ Testes executam automaticamente
- ✅ SAST/DAST scans verificam segurança
- ✅ Imagem Docker é buildada e enviada para Docker Hub 

### **3. Merge para Main**
```bash
# Criar Pull Request
# Após aprovação, merge para main
```

### **4. Release**
```bash
# Opção 1: Atualizar arquivo VERSION
echo "1.0.0" > VERSION
git add VERSION
git commit -m "🚀 Bump version to 1.0.0"
git push origin main

# Opção 2: Executar manualmente
# GitHub Actions → Release Pipeline → Run workflow → 
# Preencher versão → Execute
```

### **5. Release Pipeline Executa**
- 🔍 Valida versão (arquivo `VERSION` ou input manual)
- 🐳 Build imagem Docker com nova versão
- 🖥️ Conecta na VM via SSH
- 📝 Atualiza `docker-compose.prod.yml` com `sed`
- 🚀 Deploy da nova versão
- 🏷️ Cria Git Tag e GitHub Release

### **6. Deploy Pipeline**
- 🔍 **Valida** se ambos os workflows (Backend CI e Terraform) terminaram com sucesso
- 🔒 **Verifica** se não há deploy em andamento (lock mechanism)
- ⏳ **Aguarda** deploy anterior terminar (se necessário)
- 🔍 Verifica se infraestrutura está pronta
- 🚀 Deploy da aplicação
- 🧪 Testes pós-deploy
- 📊 Monitoramento

## 🎯 Comandos Úteis

### **Release Manual**
```bash
# Opção 1: Atualizar arquivo VERSION
echo "1.0.0" > VERSION
git add VERSION
git commit -m "🚀 Bump version to 1.0.0"
git push origin main

# Opção 2: Executar via GitHub Actions
# 1. Vá para Actions → Release Pipeline
# 2. Clique em "Run workflow"
# 3. Preencha a versão (ou deixe vazio para usar VERSION)
# 4. Clique em "Run workflow"
```

### **Verificar Status**
```bash
# Ver versão atual
cat VERSION

# Ver logs do pipeline
# Acesse: https://github.com/seu-usuario/seu-repo/actions

# Conectar na VM
ssh -i terraform/keys/desafio-devops-key ubuntu@3.219.24.200
```

### **Debug Local**
```bash
# Testar aplicação local
cd backend
npm install
npm test
npm start

# Testar Terraform
cd terraform
terraform init
terraform plan
terraform apply

# Testar Docker
docker build -t desafio-devops-api:local .
docker run -p 3000:3000 desafio-devops-api:local
```

## 🔧 Personalização

### **Alterar Nome da Imagem Docker**
Edite em `.github/workflows/release.yml`:
```yaml
env:
  DOCKER_IMAGE_NAME: seu-usuario/sua-imagem
```

### **Alterar Região AWS**
Edite em `.github/workflows/terraform.yml`:
```yaml
env:
  AWS_REGION: 'us-west-2'
```

### **Adicionar Mais Testes**
Adicione em `backend/tests/` e configure no `package.json`

### **Configurar DAST Scan**
Edite `backend/scripts/simple-dast.js` para adicionar novos testes de segurança

## 🐛 Troubleshooting

### **Erro de SSH na VM**
```bash
# Verificar se a chave SSH está configurada
# Settings > Secrets > SSH_PRIVATE_KEY

# Testar conexão manual
ssh -i terraform/keys/desafio-devops-key ubuntu@3.219.24.200
```

### **Erro de Autenticação Docker Hub**
- Verifique se `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` estão configurados
- Confirme se o token tem permissões de push

### **Erro de AWS Credentials**
- Verifique se `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` estão configurados
- Confirme se as credenciais têm permissões adequadas

### **Falha nos Testes**
```bash
# Verificar se o PostgreSQL está rodando
# Confirme se as variáveis de ambiente estão corretas
npm run test:setup
```

### **Infraestrutura não Aplicada**
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### **Release não Executa**
- **Trigger Manual**: Execute via GitHub Actions → Release Pipeline → Run workflow
- **Versão**: Preencha a versão ou deixe vazio para usar arquivo `VERSION`
- **Permissões**: Verifique se `GITHUB_TOKEN` tem permissões de `contents: write`
- **Logs**: Verifique os logs do pipeline para detalhes

### **Deploy não Executa**
- Verifique se ambos os workflows (Backend CI e Terraform) terminaram com sucesso
- Confirme se não há outro deploy em andamento
- Verifique se a infraestrutura está aplicada via Terraform
- Confirme se as credenciais SSH estão configuradas

## 📊 Monitoramento

### **Status da Aplicação**
- **Health Check**: http://3.219.24.200:3000/health
- **API**: http://3.219.24.200:3000/users
- **Logs**: Via SSH na VM

### **Métricas AWS**
- **CPU Utilization**: CloudWatch
- **Instance Status**: EC2 Console
- **Security Groups**: VPC Console

### **Pipeline Status**
- **GitHub Actions**: https://github.com/seu-usuario/seu-repo/actions
- **Docker Hub**: https://hub.docker.com/r/1234samue/desafio-devops-api
- **Releases**: https://github.com/seu-usuario/seu-repo/releases

## 📈 Próximos Passos

Para melhorar o pipeline, considere:

1. **Blue-Green Deploy** para zero downtime
2. **Testes de Performance** com Artillery ou k6
3. **Análise de Código** com SonarQube
4. **Notificações** via Slack/Discord/Teams
5. **Rollback Automático** em caso de falha
6. **Monitoramento Avançado** com Prometheus/Grafana
7. **Logs Centralizados** com ELK Stack
8. **Testes de Integração** mais abrangentes
9. **Multi-Environment** (dev, staging, prod)
10. **Infrastructure as Code** mais robusto

## 🔗 Links Úteis

- **GitHub Actions**: https://github.com/seu-usuario/seu-repo/actions
- **Docker Hub**: https://hub.docker.com/r/1234samue/desafio-devops-api
- **AWS Console**: https://console.aws.amazon.com
- **Terraform Docs**: https://www.terraform.io/docs
- **GitHub Secrets**: Settings > Secrets and variables > Actions

---

**🎯 Pipeline completo configurado e funcionando!**

**Fluxo**: Desenvolvimento → CI → Release (Manual) → Deploy → Monitoramento 