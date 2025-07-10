# 📋 Guia do terraform.tfvars

Este documento explica como configurar o arquivo `terraform.tfvars` para funcionar tanto localmente quanto no pipeline CI/CD.

## 🚨 Problema de Segurança

O arquivo `terraform.tfvars` original tinha uma chave SSH hardcoded, o que não é seguro para pipelines. Agora resolvemos isso.

## 🔧 Configuração Atual

### Arquivo terraform.tfvars (Atualizado)

```hcl
# Configurações da AWS
aws_region = "us-east-1"
profile    = "admin-samuel"

# Ambiente
environment = "dev"

# Configurações da VPC
vpc_cidr = "10.0.0.0/16"

# Zonas de disponibilidade
availability_zones = ["us-east-1a", "us-east-1b"]

# Subnets públicas
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]

# Configurações da EC2
instance_type = "t3.micro"
key_name      = "desafio-devops-key"

# Configurações opcionais da EC2
create_key_pair = true

# IMPORTANTE: Para pipelines, a chave SSH será fornecida via variável de ambiente
# TF_VAR_public_key ou será gerada automaticamente pelo script
# 
# Para desenvolvimento local, você pode:
# 1. Definir a chave aqui (não recomendado para produção)
# 2. Usar variável de ambiente: export TF_VAR_public_key="sua-chave"
# 3. Executar o script de geração: ./scripts/generate-ssh-key.sh
#
# Exemplo de chave (substitua pela sua):
# public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
```

## 🎯 Como Funciona Agora

### 🔄 **Prioridade das Variáveis**

1. **Variável de ambiente** `TF_VAR_public_key` (mais alta prioridade)
2. **Valor no terraform.tfvars** (se definido)
3. **Valor padrão** da variável (string vazia)

### 🚀 **No Pipeline CI/CD**

```yaml
# O pipeline define a variável de ambiente
env:
  TF_VAR_public_key: ${{ steps.generate-key.outputs.public_key }}
```

### 💻 **Para Desenvolvimento Local**

#### Opção 1: Script Automático (Recomendado)
```bash
cd terraform
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

#### Opção 2: Variável de Ambiente
```bash
export TF_VAR_public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
terraform plan
```

#### Opção 3: Editar Manualmente
```bash
# Adicione no terraform.tfvars:
public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
```

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Segurança** | ❌ Chave hardcoded | ✅ Chave via variável |
| **Pipeline** | ❌ Não funcionava | ✅ Funciona automaticamente |
| **Desenvolvimento** | ✅ Funcionava | ✅ Funciona + script |
| **Flexibilidade** | ❌ Fixo | ✅ Dinâmico |

## 🔑 Geração de Chaves SSH

### 🚀 **Automática (Pipeline)**
- ✅ Gera chave única por deploy
- ✅ Sem chaves hardcoded
- ✅ Mais seguro

### 💻 **Manual (Local)**
```bash
# Gerar nova chave
ssh-keygen -t rsa -b 4096 -f ~/.ssh/desafio-devops-key -N "" -C "seu-email@exemplo.com"

# Copiar chave pública
cat ~/.ssh/desafio-devops-key.pub
```

## 🛡️ Segurança

### ✅ **O que está protegido:**
- Chaves SSH não são commitadas
- Credenciais AWS via secrets
- Estado do Terraform não é exposto

### ⚠️ **Boas práticas:**
1. **Nunca commite** chaves SSH no terraform.tfvars
2. **Use sempre** variáveis de ambiente no pipeline
3. **Rotacione** as chaves regularmente
4. **Monitore** os logs do pipeline

## 🔧 Troubleshooting

### Erro: "public_key is required"
```bash
# Solução 1: Usar script automático
./scripts/setup-local.sh

# Solução 2: Definir variável de ambiente
export TF_VAR_public_key="sua-chave-aqui"

# Solução 3: Editar terraform.tfvars
# Adicione: public_key = "sua-chave-aqui"
```

### Erro: "Invalid SSH key format"
```bash
# Verifique se a chave está no formato correto
# Deve começar com: ssh-rsa
# Deve terminar com: comentário
```

### Erro: "Key pair already exists"
```bash
# No pipeline, isso é normal - a chave é reutilizada
# Localmente, você pode deletar a key pair na AWS Console
```

## 📝 Exemplos de Uso

### 🚀 **Pipeline (Automático)**
```yaml
# O pipeline gera automaticamente:
# 1. Chave SSH
# 2. Define TF_VAR_public_key
# 3. Executa terraform
```

### 💻 **Local (Manual)**
```bash
# Opção 1: Script
./scripts/setup-local.sh

# Opção 2: Variável
export TF_VAR_public_key="ssh-rsa..."
terraform plan

# Opção 3: Arquivo
echo 'public_key = "ssh-rsa..."' >> terraform.tfvars
terraform plan
```

## 🎯 Resumo

O `terraform.tfvars` agora é:
- 🔒 **Seguro** para pipelines
- 🔄 **Flexível** para desenvolvimento
- 🚀 **Automático** no CI/CD
- 💻 **Fácil** de usar localmente

**Resultado:** Um arquivo que funciona perfeitamente tanto localmente quanto no pipeline, sem comprometer a segurança! 