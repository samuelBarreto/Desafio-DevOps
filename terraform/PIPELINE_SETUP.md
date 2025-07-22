# Configuração do Pipeline Terraform

Este documento explica como configurar o pipeline para usar as variáveis do Terraform de forma segura.

## 🚨 Problema de Segurança

O arquivo `terraform.tfvars` contém uma chave SSH pública hardcoded, o que não é seguro para pipelines. Vamos resolver isso.

## 🔧 Soluções Disponíveis

### Opção 1: Usar Secrets do GitHub (Recomendado)

1. **Configure os secrets no GitHub:**
   - Vá para seu repositório → Settings → Secrets and variables → Actions
   - Adicione os seguintes secrets:
     - `AWS_ACCESS_KEY_ID`: Sua AWS Access Key
     - `AWS_SECRET_ACCESS_KEY`: Sua AWS Secret Key
     - `SSH_PUBLIC_KEY`: Sua chave SSH pública

2. **Use o workflow `terraform-ci.yml`:**
   - Este workflow usa o secret `SSH_PUBLIC_KEY`
   - A chave é passada como variável de ambiente `TF_VAR_public_key`

### Opção 2: Geração Automática de Chave SSH

1. **Use o workflow `terraform-auto-key.yml`:**
   - Este workflow gera automaticamente uma nova chave SSH
   - A chave é gerada no início do pipeline
   - A chave privada é salva como artifact (temporário)

## 📋 Configuração dos Secrets

### 1. AWS Credentials
```bash
# No GitHub Secrets:
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### 2. SSH Public Key
```bash
# Gere sua chave SSH:
ssh-keygen -t rsa -b 4096 -f ~/.ssh/desafio-devops-key -N "" -C "seu-email@exemplo.com"

# Copie a chave pública:
cat ~/.ssh/desafio-devops-key.pub

# Adicione no GitHub Secret:
SSH_PUBLIC_KEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...
```

## 🔄 Fluxo do Pipeline

### Workflow Principal (`terraform-ci.yml`)
1. **Plan Stage:**
   - Usa `TF_VAR_public_key: ${{ secrets.SSH_PUBLIC_KEY }}`
   - Executa `terraform plan`

2. **Apply Stage:**
   - Usa a mesma chave do secret
   - Executa `terraform apply`

### Workflow com Geração Automática (`terraform-auto-key.yml`)
1. **Plan Stage:**
   - Gera nova chave SSH
   - Usa a chave gerada no plan
   - Salva a chave como artifact

2. **Apply Stage:**
   - Baixa a chave do artifact
   - Usa a mesma chave no apply

## 🛡️ Segurança

### Arquivos Ignorados
- `terraform.tfvars` (contém dados sensíveis)
- `*.tfstate` (estado do Terraform)
- `desafio-devops-key*` (chaves SSH)

### Boas Práticas
1. **Nunca commite** o arquivo `terraform.tfvars`
2. **Use sempre** secrets para dados sensíveis
3. **Rotacione** as chaves SSH regularmente
4. **Monitore** os logs do pipeline

## 🚀 Como Usar

### Para Desenvolvimento Local
```bash
# Copie o arquivo de exemplo
cp terraform.tfvars.example terraform.tfvars

# Edite com suas configurações
nano terraform.tfvars

# Execute localmente
cd terraform
terraform init
terraform plan
terraform apply
```

### Para Pipeline
1. Configure os secrets no GitHub
2. Faça push para a branch `main` ou `develop`
3. O pipeline executará automaticamente

## 📝 Variáveis de Ambiente

O pipeline usa as seguintes variáveis:

| Variável | Descrição | Fonte |
|----------|-----------|-------|
| `TF_VAR_aws_region` | Região AWS | `env.AWS_REGION` |
| `TF_VAR_environment` | Ambiente (dev/prod) | Baseado na branch |
| `TF_VAR_public_key` | Chave SSH pública | GitHub Secret ou gerada |

## 🔍 Troubleshooting

### Erro: "SSH_PUBLIC_KEY not found"
- Verifique se o secret está configurado no GitHub
- Certifique-se de que o nome está correto

### Erro: "Invalid SSH key format"
- Verifique se a chave pública está no formato correto
- Deve começar com `ssh-rsa` e terminar com comentário

### Erro: "Permission denied"
- Verifique se as credenciais AWS têm permissões adequadas
- Verifique se a chave SSH está correta

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do pipeline
2. Teste localmente primeiro
3. Verifique a configuração dos secrets 