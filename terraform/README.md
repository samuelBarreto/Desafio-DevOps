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
├── backend.tf              # Configuração do backend S3
├── terraform.tfvars.example # Exemplo de configuração
├── environments/           # Configurações por ambiente
│   ├── dev.tfvars          # Variáveis para desenvolvimento
│   └── prod.tfvars         # Variáveis para produção
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
├── templates/
│   └── user_data.sh       # Script de inicialização
├── TERRAFORM_TFVARS_GUIDE.md    # Guia de configuração
├── TERRAFORM_TFVARS_SUMMARY.md  # Resumo das variáveis
├── PIPELINE_SETUP.md            # Configuração do pipeline
└── README.md                    # Esta documentação
```

## 🚀 Como Usar

### 1. Pré-requisitos

- **Terraform** (versão >= 1.0)
- **AWS CLI** configurado com credenciais
- **Chave SSH** pública configurada no GitHub Secrets
- **GitHub Secrets** configurados (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SSH_PUBLIC_KEY)
- **Bucket S3** criado para armazenar o estado do Terraform
- **DynamoDB Table** para locking do estado (opcional, mas recomendado) 

### 1.1 Configurar Backend S3 (Recomendado)

Para uso em produção e colaboração em equipe, configure o backend S3:

```bash
# Criar bucket S3 para o estado do Terraform
aws s3api create-bucket \
    --bucket desafio-devops-terraform-state \
    --region us-east-1 \
    --create-bucket-configuration LocationConstraint=us-east-1

# Habilitar versionamento
aws s3api put-bucket-versioning \
    --bucket desafio-devops-terraform-state \
    --versioning-configuration Status=Enabled

# Configurar encriptação
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

# Bloquear acesso público
aws s3api put-public-access-block \
    --bucket desafio-devops-terraform-state \
    --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Criar tabela DynamoDB para locking (opcional)
aws dynamodb create-table \
    --table-name desafio-devops-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1

# Inicializar com backend S3
terraform init
```

**Importante**: O backend S3 é configurado automaticamente no pipeline CI/CD.

### 1.2 Configurar Variáveis de Ambiente

```bash
# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
cd Desafio-DevOps/terraform

# Copie o arquivo de configuração
cp terraform.tfvars.example terraform.tfvars

# Edite as configurações
vim terraform.tfvars
```

### 1.3 Verificar AMIs Disponíveis

Se você encontrar erro de AMI não encontrada, execute:

```bash
# Verificar AMIs disponíveis para Ubuntu 22.04
aws ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
  --query 'Images[*].[ImageId,Name]' \
  --output table \
  --region us-east-1
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

- `instance_id` - ID da instância EC2
- `instance_public_ip` - IP público da instância (dinâmico)
- `elastic_ip` - IP elástico da instância
- `vpc_id` - ID da VPC criada
- `security_group_id` - ID do Security Group
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

### Via Release Pipeline
Para fazer releases de produção:
1. Vá para **Actions** no GitHub
2. Selecione **Release Pipeline**
3. Clique em **Run workflow**
4. Configure:
   - **Version**: Deixe vazio para usar o arquivo VERSION ou especifique uma versão
5. Clique em **Run workflow**

## 🌍 Ambientes

O projeto suporta múltiplos ambientes através de arquivos de configuração específicos:

### Desenvolvimento (`dev`)
- **Arquivo**: `environments/dev.tfvars`
- **Uso**: Para desenvolvimento e testes
- **Recursos**: Instância menor, configurações básicas

### Produção (`prod`)
- **Arquivo**: `environments/prod.tfvars`
- **Uso**: Para ambiente de produção
- **Recursos**: Instância maior, configurações otimizadas

### Configuração de Ambiente
```bash
# Para desenvolvimento
terraform plan -var-file="environments/dev.tfvars"

# Para produção
terraform plan -var-file="environments/prod.tfvars"
```

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

## 🏷️ Versionamento

O projeto utiliza versionamento semântico através do arquivo `VERSION` na raiz do projeto:

### Como Funciona
- **Arquivo VERSION**: Contém a versão atual (ex: `0.0.5`)
- **Release Pipeline**: Lê automaticamente a versão do arquivo
- **Docker Tags**: Usa a versão para taggar imagens Docker
- **Git Tags**: Cria tags git automaticamente (ex: `v0.0.5`)

### Atualizar Versão
```bash
# Editar o arquivo VERSION
echo "0.0.6" > VERSION

# Commit e push
git add VERSION
git commit -m "Bump version to 0.0.6"
git push origin main
```

### Release Automático
1. Atualize o arquivo `VERSION`
2. Execute o Release Pipeline manualmente
3. O pipeline irá:
   - Validar a versão
   - Build da imagem Docker
   - Deploy em produção
   - Criar git tag e GitHub release


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

4. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - **Trigger**: Workflow run completion ou execução manual
   - **Funcionalidades**:
     - Deploy automático da aplicação na VM
     - Atualização da imagem Docker
     - Testes pós-deploy
     - Monitoramento e notificações

5. **Release Pipeline** (`.github/workflows/release.yml`)
   - **Trigger**: Execução manual
   - **Funcionalidades**:
     - Validação de versão do arquivo VERSION
     - Build e push da imagem Docker com nova versão
     - Deploy em produção
     - Criação de git tag e GitHub release

### Secrets Necessários

Configure os seguintes secrets no GitHub:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# SSH Keys
SSH_PUBLIC_KEY=your-ssh-public-key
SSH_PRIVATE_KEY=your-ssh-private-key

# Docker Hub
DOCKERHUB_USERNAME=your-username
DOCKERHUB_TOKEN=your-token

# GitHub Token (para releases)
GITHUB_TOKEN=your-github-token
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
4. **Workflow completion** → Executa Deploy Pipeline
5. **Execução manual** → Permite trigger manual de workflows
6. **Release manual** → Executa Release Pipeline para produção

### Execução Manual

Para executar workflows manualmente:
1. Vá para **Actions** no GitHub
2. Selecione o workflow desejado
3. Clique em **Run workflow**
4. Configure os parâmetros necessários
5. Clique em **Run workflow**

## 📚 Documentação Adicional

### Documentação do Projeto
- **[TERRAFORM_TFVARS_GUIDE.md](TERRAFORM_TFVARS_GUIDE.md)** - Guia detalhado de configuração de variáveis
- **[TERRAFORM_TFVARS_SUMMARY.md](TERRAFORM_TFVARS_SUMMARY.md)** - Resumo das variáveis disponíveis
- **[PIPELINE_SETUP.md](PIPELINE_SETUP.md)** - Configuração dos pipelines CI/CD

### Links Externos
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)
- [Docker Installation](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose Installation](https://docs.docker.com/compose/install/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Terraform Backend S3](https://www.terraform.io/language/settings/backends/s3)
- [AWS DynamoDB Locking](https://www.terraform.io/language/settings/backends/s3#dynamodb-state-locking) 