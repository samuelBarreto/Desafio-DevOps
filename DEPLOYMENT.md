# 🚀 Deployment Pipeline - Ambientes

## 📋 Visão Geral

O pipeline de deploy (`deploy.yml`) foi configurado para detectar automaticamente o ambiente e fazer o deploy da aplicação no ambiente correto.

## 🌍 Detecção Automática de Ambiente

### **Branch `main` → Ambiente PROD**
- ✅ Deploy automático para produção
- 🏗️ Infraestrutura: t3.small, 50GB, rede 10.1.x.x
- 🔑 Chave SSH: `desafio-devops-key-prod`
- 🏷️ Tags: Environment=prod, CostCenter=production

### **Branch `develop` → Ambiente DEV**
- ✅ Deploy automático para desenvolvimento
- 🏗️ Infraestrutura: t3.micro, 20GB, rede 10.0.x.x
- 🔑 Chave SSH: `desafio-devops-key-dev`
- 🏷️ Tags: Environment=dev, CostCenter=development

## 🔄 Fluxo de Deploy

### **1. Trigger do Pipeline**
```yaml
on:
  workflow_run:
    workflows: ["Backend CI Pipeline", "Terraform CI/CD Pipeline"]
    types: [completed]
    branches: [main, develop]  # ✅ Ambas as branches
```

### **2. Detecção de Ambiente**
```bash
# Detecta automaticamente baseado na branch
if [[ "${{ github.event.workflow_run.head_branch }}" == "main" ]]; then
  ENVIRONMENT="prod"
else
  ENVIRONMENT="dev"
fi
```

### **3. Deploy da Aplicação**
- 🔍 Obtém informações da infraestrutura do ambiente correto
- 🐳 Faz deploy da aplicação Docker
- 🧪 Executa testes específicos do ambiente
- 📊 Monitora e notifica o resultado

## 📊 Diferenças entre Ambientes

------------------------------------------------------------------------------------------------
| Aspecto       | DEV                    | PROD                                                |
|---------------|------------------------|-----------------------------------------------------|
| **Branch**    | `develop`              | `main`                                              |
| **Instância** | t3.micro               | t3.small                                            |
| **Storage**   | 20GB                   | 50GB                                                |
| **Rede**      | 10.0.x.x               | 10.1.x.x                                            |
| **Chave SSH** | desafio-devops-key-dev | desafio-devops-key-prod                             |
| **Tags**      | CostCenter=development | CostCenter=production, Backup=true, Monitoring=true |
------------------------------------------------------------------------------------------------

## 🚀 Como Funciona

### **Para Desenvolvimento:**
1. Faça push para branch `develop`
2. Pipeline Terraform cria infraestrutura DEV
3. Pipeline Deploy detecta ambiente DEV
4. Deploy da aplicação no ambiente DEV

### **Para Produção:**
1. Faça merge para branch `main`
2. Pipeline Terraform cria infraestrutura PROD
3. Pipeline Deploy detecta ambiente PROD
4. Deploy da aplicação no ambiente PROD

## 📝 Logs e Notificações

### **Logs com Ambiente:**
```
🌍 Environment: dev
🚀 Iniciando deploy da aplicação no ambiente dev...
🔍 Verificando health check da aplicação no ambiente dev...
🧪 Executando testes da API no ambiente dev...
```

### **Notificações:**
```
🎉 DEPLOYMENT SUCCESSFUL!
=========================
🌍 Environment: prod
✅ All tests passed
✅ Application is running
🌐 Access your application at: http://[IP]:3000
```

## 🔧 Configuração

### **Secrets Necessários:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SSH_PRIVATE_KEY`

### **Variáveis de Ambiente:**
- `DOCKER_IMAGE_NAME`: 1234samue/desafio-devops-api
- `DOCKER_TAG`: 0.0.1
- `AWS_REGION`: us-east-1

## 🎯 Benefícios

1. **Automação Completa**: Deploy automático baseado na branch
2. **Isolamento**: Ambientes completamente separados
3. **Segurança**: Chaves SSH diferentes por ambiente
4. **Custos**: Controle de custos por ambiente
5. **Monitoramento**: Tags específicas para monitoramento
6. **Flexibilidade**: Fácil adição de novos ambientes

## 🚨 Troubleshooting

### **Problema**: Deploy não detecta ambiente
**Solução**: Verificar se a branch está correta (main/prod, develop/dev)

### **Problema**: Infraestrutura não encontrada
**Solução**: Verificar se o pipeline Terraform foi executado primeiro

### **Problema**: SSH falha
**Solução**: Verificar se a chave SSH está configurada corretamente

## 📈 Monitoramento

### **CloudWatch Metrics:**
- CPU Utilization
- Memory Usage
- Network I/O
- Disk I/O

### **Health Checks:**
- Endpoint: `/health`
- Porta: 3000
- Timeout: 30 tentativas

## 🎉 Resultado

Agora você tem um pipeline de deploy completamente automatizado que:

- ✅ Detecta automaticamente o ambiente
- ✅ Deploy no ambiente correto
- ✅ Testes específicos por ambiente
- ✅ Monitoramento e notificações
- ✅ Logs detalhados com ambiente
- ✅ Isolamento completo entre dev e prod

O deploy funciona automaticamente para ambos os ambientes! 🚀 