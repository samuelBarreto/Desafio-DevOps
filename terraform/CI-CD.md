# 🚀 CI/CD Pipeline - Terraform

Este documento descreve o pipeline CI/CD específico para a infraestrutura Terraform do projeto Desafio DevOps.

## 📋 Visão Geral

O pipeline CI/CD do Terraform é projetado para:
- ✅ Executar apenas quando há mudanças na pasta `terraform/`
- ✅ Validar e formatar código Terraform
- ✅ Fazer plan e apply automático na branch `main`
- ✅ Executar scan de segurança
- ✅ Notificar resultados

## 🔄 Workflow Terraform CI/CD

### Trigger
```yaml
on:
  push:
    branches: [ main, develop, ]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'terraform/**'
```

### Jobs

#### 1. Terraform Plan
- **Objetivo**: Validar e planejar mudanças
- **Execução**: Sempre que há mudanças em `terraform/`
- **Ações**:
  - Setup Terraform
  - Configurar AWS credentials
  - `terraform init`
  - `terraform fmt -check`
  - `terraform validate`
  - `terraform plan`

#### 2. Terraform Apply
- **Objetivo**: Aplicar mudanças na infraestrutura
- **Execução**: Apenas na branch `main` após push
- **Ações**:
  - Download do plan gerado
  - `terraform apply -auto-approve`
  - Exibir outputs da infraestrutura

#### 3. Security Scan
- **Objetivo**: Verificar vulnerabilidades
- **Execução**: Apenas na branch `main`
- **Ações**:
  - Scan com Trivy
  - Upload resultados para GitHub Security

#### 4. Notify
- **Objetivo**: Notificar resultados
- **Execução**: Sempre (success/failure)
- **Ações**:
  - Notificar sucesso/falha
  - Exibir informações da instância

## 🔧 Configuração

### Secrets Necessários

Configure no GitHub Repository → Settings → Secrets and variables → Actions:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Docker Hub (para build da aplicação)
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
```

### Variáveis de Ambiente

```yaml
env:
  TF_VERSION: '1.5.0'
  AWS_REGION: 'us-east-1'
```

## 🎯 Comportamento por Branch

### Branch `main`
- ✅ Terraform Plan
- ✅ Terraform Apply (deploy automático)
- ✅ Security Scan
- ✅ Notifications

### Branch `develop`
- ✅ Terraform Plan
- ❌ Terraform Apply (apenas validação)
- ❌ Security Scan
- ✅ Notifications

### Pull Requests
- ✅ Terraform Plan
- ❌ Terraform Apply (apenas validação)
- ❌ Security Scan
- ✅ Notifications

## 🔍 Detecção de Mudanças

O pipeline usa `paths` para detectar mudanças específicas:

```yaml
paths:
  - 'terraform/**'  # Qualquer arquivo na pasta terraform
```

### Arquivos Monitorados
- `terraform/main.tf`
- `terraform/variables.tf`
- `terraform/modules/**`
- `terraform/templates/**`
- `terraform/scripts/**`

### Arquivos Ignorados
- `terraform/.terraform/`
- `terraform/*.tfstate`
- `terraform/*.tfstate.backup`

## 🛡️ Segurança

### Validações Automáticas
1. **Formatação**: `terraform fmt -check`
2. **Validação**: `terraform validate`
3. **Vulnerabilidades**: Trivy scan
4. **State Locking**: DynamoDB (quando configurado)

### Boas Práticas
- ✅ Estado criptografado (S3 + KMS)
- ✅ State locking (DynamoDB)
- ✅ Versionamento de estado
- ✅ Logs detalhados
- ✅ Rollback automático em falha

## 📊 Monitoramento

### Logs Disponíveis
- GitHub Actions logs
- Terraform logs
- Trivy scan results
- AWS CloudTrail (auditoria)

### Métricas
- Tempo de execução
- Taxa de sucesso
- Vulnerabilidades encontradas
- Recursos criados/modificados

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de credenciais AWS**
   ```bash
   # Verificar secrets no GitHub
   Settings → Secrets and variables → Actions
   ```

2. **Erro de AMI não encontrada**
   ```bash
   # Verificar região AWS
   # Atualizar AMI ID no código
   ```

3. **Erro de state lock**
   ```bash
   # Verificar DynamoDB table
   # Forçar unlock se necessário
   terraform force-unlock <lock-id>
   ```

4. **Timeout no apply**
   ```bash
   # Aumentar timeout no workflow
   # Verificar recursos AWS
   ```

### Debug

Para debug local:
```bash
# Simular pipeline local
cd terraform
terraform init
terraform plan
terraform apply
```

## 📈 Melhorias Futuras

- [ ] Terraform Cloud integration
- [ ] Cost estimation
- [ ] Policy as Code (OPA)
- [ ] Automated testing
- [ ] Blue/Green deployment
- [ ] Multi-region support
- [ ] Disaster recovery
- [ ] Performance monitoring

## 📚 Referências

- [Terraform GitHub Actions](https://www.terraform.io/docs/cloud/run/run-tasks.html)
- [AWS GitHub Actions](https://github.com/aws-actions/configure-aws-credentials)
- [Trivy Security Scanner](https://trivy.dev/)
- [GitHub Actions Paths](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpaths) 