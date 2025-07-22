# 🏗️ Infraestrutura Terraform - Desafio DevOps

Infraestrutura como código (IaC) para provisionar recursos AWS necessários para o projeto Desafio DevOps.

## 📋 Recursos Provisionados

- **VPC** com subnets públicas e privadas
- **Internet Gateway** para conectividade externa
- **Security Groups** com regras para HTTP (80), HTTPS (443), SSH (22) e Node.js (3000)
- **EC2 Instance** com Ubuntu 22.04 LTS
- **Elastic IP** dinâmico para acesso estável
- **Key Pair** para acesso SSH seguro
- **User Data** com instalação automática de Docker 20.10 e Docker Compose 2.0
- **Backend S3** para estado do Terraform


## 🏗️ Estrutura dos Módulos

```
terraform/
├── main.tf                 # Arquivo principal
├── variables.tf            # Variáveis globais
├── outputs.tf              # Outputs globais
├── terraform.tfvars.example # Exemplo de configuração
├── modules/
│   ├── vpc/                # Módulo VPC
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── security_groups/    # Módulo Security Groups
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── ec2/               # Módulo EC2
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── templates/
    └── user_data.sh       # Script de inicialização
```

## 🚀 Como Usar

### 1. Pré-requisitos

- **Terraform** (versão >= 1.0)
- **AWS CLI** configurado com credenciais
- **Chave SSH** pública configurada no GitHub Secrets
- **GitHub Secrets** configurados (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SSH_PUBLIC_KEY)
- **Criar um Buckets na Aws** criação de baucket para o tfstate de versão 

### 1.1 Configurar Backend S3 (Recomendado)

Para uso em produção e colaboração em equipe, configure o backend S3:

```bash
# Configurar backend S3 e DynamoDB
chmod +x scripts/setup-backend.sh
./scripts/setup-backend.sh

# Inicializar com backend S3
terraform init
```

**Importante**: O backend S3 é configurado automaticamente no pipeline CI/CD.

### 1.2 Verificar AMIs Disponíveis

Se você encontrar erro de AMI não encontrada, execute:

**Linux/Mac:**
```bash
# 1. Criar o bucket S3
aws s3api create-bucket \
    --bucket desafio-devops-terraform-state \
    --region us-east-1 \
    --create-bucket-configuration LocationConstraint=us-east-1

#  2. Habilitar versionamento
aws s3api put-bucket-versioning \
    --bucket desafio-devops-terraform-state \
    --versioning-configuration Status=Enabled

# 3. Configurar encriptação 
aws s3api put-bucket-encryption \
    --bucket desafio-devops-terraform-state \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# 4. Bloquear acesso público
aws s3api put-public-access-block \
    --bucket desafio-devops-terraform-state \
    --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```


# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
cd Desafio-DevOps/terraform

# Copie o arquivo de configuração
cp terraform.tfvars.example terraform.tfvars

# Edite as configurações
vim terraform.tfvars
```

**Nota**: Para uso com CI/CD, as variáveis são configuradas via GitHub Secrets e não precisam do arquivo `terraform.tfvars`.

### 2.1 Configurar Chave SSH

**Para uso local:**
```bash
# Gerar chave SSH
ssh-keygen -t rsa -b 4096 -f ~/.ssh/desafio-devops-key -N ""

# Mostrar chave pública
cat ~/.ssh/desafio-devops-key.pub

# Copiar a chave para terraform.tfvars
```

**Para uso com CI/CD:**
1. Gere sua chave SSH localmente
2. Adicione a chave pública ao GitHub Secret `SSH_PUBLIC_KEY`
3. Mantenha a chave privada segura para acesso à instância

### 3. Deploy

```bash
# Inicializar Terraform
terraform init

# Verificar o plano
terraform plan

# Aplicar a infraestrutura
terraform apply
```

### 4. Acessar a Instância

```bash
# Obter o IP público
terraform output instance_public_ip

# Conectar via SSH (IP dinâmico)
ssh -i ~/.ssh/desafio-devops-key ubuntu@$(terraform output -raw elastic_ip)

# Verificar instalação do Docker
docker --version
docker compose version
```

**IP Dinâmico**: A instância usa um Elastic IP dinâmico para acesso estável.

### 5. Executar a Aplicação

```bash
# Na instância EC2
cd /opt/app/desafio-devops/backend
docker compose -f docker-compose.prod.yml up -d

# Verificar status
docker compose ps

# Verificar logs
docker compose logs api
```

**Aplicação disponível em:**
- **HTTP**: http://$(terraform output -raw elastic_ip)
- **API**: http://$(terraform output -raw elastic_ip):3000
- **Health Check**: http://$(terraform output -raw elastic_ip)/health

## 🔧 Configurações

### Variáveis Principais

| Variável                | Descrição                    | Padrão               |
|-------------------------|------------------------------|----------------------|
| `aws_region`            | Região AWS                   | `us-east-1`          |
| `environment`           | Ambiente                     | `dev`                |
| `vpc_cidr`              | CIDR da VPC                  | `10.0.0.0/16`        |
| `instance_type`         | Tipo da EC2                  | `t3.micro`           |
| `public_key`            | Chave pública SSH            | Via GitHub Secrets   |
| `allocate_eip`          | Alocar Elastic IP dinâmico   | `true`               |

### Security Groups

O módulo cria um Security Group com as seguintes regras:

- **SSH (22)** - Acesso remoto (0.0.0.0/0)
- **HTTP (80)** - Tráfego web (0.0.0.0/0)
- **HTTPS (443)** - Tráfego web seguro (0.0.0.0/0)
- **Porta 3000** - Aplicação Node.js (0.0.0.0/0)

**Nota**: Para produção, considere restringir o acesso SSH apenas aos IPs necessários.

## 🐳 Docker e Docker Compose

O user-data instala automaticamente:

- **Docker 20.10** (versão estável)
- **Docker Compose 2.0** (plugin)
- **Ferramentas úteis** (git, vim, htop, etc.)

## 📊 Outputs

Após o deploy, você terá acesso a:

- `instance_public_ip` - IP público da instância (dinâmico)
- `instance_public_dns` - DNS público da instância
- `vpc_id` - ID da VPC criada
- `web_sg_id` - ID do Security Group
- `elastic_ip_id` - ID do Elastic IP
- `key_pair_name` - Nome do Key Pair criado

## 🧹 Limpeza

### Via Terraform Local
```bash
# Destruir a infraestrutura
terraform destroy

# Confirmar a destruição
yes
```

### Via CI/CD Pipeline (Recomendado)
1. Crie uma branch `destroy`
2. Faça push para o repositório
3. Crie um Pull Request para a branch `destroy`
4. Após aprovação e merge, o destroy será executado automaticamente

### Via Execução Manual
1. Vá para **Actions** no GitHub
2. Selecione **Terraform CI/CD (Destroy)**
3. Clique em **Run workflow**
4. Configure:
   - **Confirmar destroy**: `true`
   - **Ambiente**: `dev` ou `prod`
5. Clique em **Run workflow**

## 🔒 Segurança

- **Volumes criptografados** (GP3 com encryption)
- **Security Groups** configurados para portas específicas
- **User não-root** para Docker
- **Timezone** configurado para Brasil
- **Chaves SSH** gerenciadas via GitHub Secrets
- **Backend S3** com DynamoDB para locking do estado
- **IP fixo** para evitar mudanças de endereço

## 📝 Logs

O user-data cria logs em:
- `/var/log/user-data.log` - Log da instalação
- `/var/log/cloud-init-output.log` - Log do cloud-init


## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de AMI não encontrada**
   ```bash
   # Verificar AMIs disponíveis
   ./scripts/find-ami.sh
   
   # Ou usar comando direto
   aws ec2 describe-images \
     --owners 099720109477 \
     --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
     --query 'Images[*].[ImageId,Name]' \
     --output table \
     --region us-east-1
   ```

2. **Erro de chave SSH**
   ```bash
   # Verificar se a chave está configurada no GitHub Secrets
   # Verificar se a chave privada está no local correto
   ls -la ~/.ssh/desafio-devops-key
   
   # Testar conexão SSH
   ssh -i ~/.ssh/desafio-devops-key ubuntu@$(terraform output -raw elastic_ip)
   ```

3. **Aplicação não acessível**
   ```bash
   # Verificar se a instância está rodando
   aws ec2 describe-instances --filters "Name=ip-address,Values=$(terraform output -raw elastic_ip)"
   
   # Verificar Security Groups
   aws ec2 describe-security-groups --group-ids <sg-id>
   
   # Testar conectividade
   curl -I http://$(terraform output -raw elastic_ip)/health
   ```

4. **Docker não inicia**
   ```bash
   # Conectar via SSH
   ssh -i ~/.ssh/desafio-devops-key ubuntu@$(terraform output -raw elastic_ip)
   
   # Verificar status do Docker
   sudo systemctl status docker
   
   # Verificar se o usuário está no grupo docker
   groups ubuntu
   ```

5. **Porta 3000 não acessível**
   ```bash
   # Verificar se a aplicação está rodando
   docker compose ps
   
   # Verificar logs da aplicação
   docker compose logs api
   
   # Verificar portas abertas
   sudo netstat -tlnp | grep :3000
   ```

## 🚀 CI/CD Pipeline

Este projeto inclui um pipeline CI/CD completo que executa automaticamente quando há mudanças na pasta `terraform/`:

### Workflows Disponíveis

1. **Terraform CI/CD** (`.github/workflows/terraform-ci.yml`)
   - **Trigger**: Push para branch `main`
   - **Funcionalidades**:
     - Validação do código Terraform
     - Verificação de formatação
     - Plan e Apply da infraestrutura
     - Build e push da imagem Docker
     - Testes de segurança SAST/DAST

2. **Terraform Destroy** (`.github/workflows/terraform-destroy.yml`)
   - **Trigger**: Pull Request para branch `destroy` ou execução manual
   - **Funcionalidades**:
     - Validação e plan de destroy
     - Execução segura do destroy (apenas após confirmação)
     - Notificações de status

3. **PR Check** (`.github/workflows/pr-check.yml`)
   - **Trigger**: Pull Request para qualquer branch
   - **Funcionalidades**:
     - Validação do Terraform
     - Testes da aplicação
     - Verificação de qualidade de código
     - Notificações de status

### Secrets Necessários

Configure os seguintes secrets no GitHub:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# SSH Public Key
SSH_PUBLIC_KEY=your-ssh-public-key

# Docker Hub (para build da aplicação)
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-token
```

### Como Configurar Secrets

1. **AWS Credentials**:
   ```bash
   # Criar usuário IAM com permissões necessárias
   aws iam create-user --user-name terraform-user
   aws iam attach-user-policy --user-name terraform-user --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
   aws iam create-access-key --user-name terraform-user
   ```

2. **SSH Key**:
   ```bash
   # Gerar chave SSH
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/desafio-devops-key -N ""
   
   # Copiar chave pública
   cat ~/.ssh/desafio-devops-key.pub
   ```

### Como Funciona

1. **Push para `main`** → Executa Terraform CI/CD
2. **Pull Request para `destroy`** → Executa Terraform Destroy
3. **Pull Request para qualquer branch** → Executa PR Check
4. **Execução manual** → Permite trigger manual de workflows

### Execução Manual

Para executar workflows manualmente:
1. Vá para **Actions** no GitHub
2. Selecione o workflow desejado
3. Clique em **Run workflow**
4. Configure os parâmetros necessários
5. Clique em **Run workflow**

## 📚 Documentação Adicional

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)
- [Docker Installation](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose Installation](https://docs.docker.com/compose/install/)
- [GitHub Actions](https://docs.github.com/en/actions) 