# 🚀 Pipeline CI/CD Completo - Terraform

Este é o pipeline completo que automatiza todo o processo de deploy da infraestrutura Terraform.

## 📋 O que o Pipeline Faz

### 🔍 **Etapa 1: Validação e Plan**
- ✅ Checkout do código
- 🏗️ Setup do Terraform
- 🔐 Configuração AWS
- 🔑 Geração automática de chave SSH
- 📝 Validação de formato
- ✅ Validação de sintaxe
- 📋 Criação do plan
- 💾 Upload dos artifacts

### 🚀 **Etapa 2: Aplicação (Apenas Main)**
- ⚡ Aplicação da infraestrutura
- 📊 Coleta dos outputs
- 🌐 Exibição dos IPs/DNS

### 🛡️ **Etapa 3: Testes de Segurança**
- 🔍 Scan de vulnerabilidades com Trivy
- 📤 Upload dos resultados para GitHub Security

### 🧪 **Etapa 4: Testes de Infraestrutura**
- 🔍 Teste de conectividade SSH
- 🌐 Teste de conectividade HTTP/HTTPS
- ✅ Validação da infraestrutura

### 📢 **Etapa 5: Notificações**
- ✅ Notificação de sucesso
- ⚠️ Notificação de avisos
- ❌ Notificação de falhas

### 🧹 **Etapa 6: Limpeza**
- 🧹 Limpeza de artifacts temporários
- 📊 Resumo final

## ⚙️ Configuração Necessária

### 1. Secrets do GitHub
Configure estes secrets no seu repositório:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# (Opcional) Se quiser usar chave SSH fixa
SSH_PUBLIC_KEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...
```

### 2. Permissões AWS
O usuário AWS precisa ter estas permissões:
- `ec2:*`
- `vpc:*`
- `iam:*`
- `secretsmanager:*`

## 🚀 Como Usar

### Para Desenvolvimento
```bash
# Faça push para qualquer branch
git push origin develop

# O pipeline executará apenas o PLAN
```

### Para Produção
```bash
# Faça push para main
git push origin main

# O pipeline executará PLAN + APPLY + TESTES
```

## 📊 Triggers do Pipeline

| Evento | Branch          | Ação                  |
|--------|-----------------|-----------------------|
| Push   | `main`          | Plan + Apply + Testes |
| Push   | `develop`       | Apenas Plan           |
| Push   | `feature/*`     | Apenas Plan           |
| PR     | `main/develop`  | Apenas Plan           |

## 🔑 Geração Automática de Chaves SSH

O pipeline gera automaticamente:
- ✅ Chave SSH pública para a EC2
- ✅ Chave SSH privada (salva como artifact)
- ✅ Key pair na AWS

**Vantagens:**
- 🔒 Sem chaves hardcoded
- 🔄 Chaves únicas por deploy
- 🛡️ Mais seguro

## 🛡️ Segurança

### O que é verificado:
- ✅ Vulnerabilidades no código Terraform
- ✅ Conectividade da infraestrutura
- ✅ Permissões AWS
- ✅ Formato das configurações

### O que é protegido:
- 🔒 Chaves SSH não são commitadas
- 🔒 Credenciais AWS via secrets
- 🔒 Estado do Terraform não é exposto

## 📈 Monitoramento

### Logs Disponíveis:
- 📋 Plan detalhado
- 🚀 Logs de aplicação
- 🛡️ Resultados de segurança
- 🧪 Resultados de testes
- 📊 Outputs da infraestrutura

### Notificações:
- ✅ Sucesso completo
- ⚠️ Sucesso com avisos
- ❌ Falhas

## 🔧 Troubleshooting

### Erro: "AWS credentials not found"
```bash
# Verifique se os secrets estão configurados:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
```

### Erro: "SSH key generation failed"
```bash
# O pipeline tentará gerar uma nova chave
# Verifique os logs para detalhes
```

### Erro: "Infrastructure tests failed"
```bash
# Aguarde alguns minutos para a instância inicializar
# Verifique se as security groups estão corretas
```

## 📞 Suporte

Se encontrar problemas:
1. 🔍 Verifique os logs do pipeline
2. 🧪 Teste localmente primeiro
3. 🔐 Verifique os secrets
4. 📊 Consulte o resumo final

---

**🎯 Este pipeline automatiza 100% do processo de deploy da infraestrutura!** 