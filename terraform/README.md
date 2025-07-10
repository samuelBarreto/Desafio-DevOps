# 🏗️ Infraestrutura Terraform - Desafio DevOps

Infraestrutura como código (IaC) para provisionar recursos AWS necessários para o projeto Desafio DevOps.

## 📋 Recursos Provisionados

- **VPC** com subnets públicas
- **Internet Gateway** para conectividade externa
- **Security Groups** com regras para HTTP, HTTPS e SSH
- **EC2 Instance** com Ubuntu 22.04 LTS
- **User Data** com instalação automática de Docker 20.10 e Docker Compose 2.0

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
- **AWS CLI** configurado com profile
- **Chave SSH** criada na AWS (ou configure para criar automaticamente)

### 1.1 Configurar Backend S3 (Opcional - para produção)

Para usar em produção com múltiplos desenvolvedores, configure o backend S3:

```bash
# Configurar backend S3
chmod +x scripts/setup-backend.sh
./scripts/setup-backend.sh

# Inicializar com backend S3
terraform init
```

### 1.2 Verificar AMIs Disponíveis

Se você encontrar erro de AMI não encontrada, execute:

**Linux/Mac:**
```bash
# Dar permissão de execução
chmod +x scripts/find-ami.sh

# Executar script para listar AMIs
./scripts/find-ami.sh
```

**Windows PowerShell:**
```powershell
# Executar script para listar AMIs
.\scripts\find-ami.ps1
```

### 2. Configuração

```bash
# Clone o repositório
git clone https://github.com/samuelBarreto/Desafio-DevOps.git
cd Desafio-DevOps/terraform

# Copie o arquivo de configuração
cp terraform.tfvars.example terraform.tfvars

# Edite as configurações (incluindo o profile AWS)
vim terraform.tfvars
```

### 2.1 Gerar Chave SSH (Se necessário)

**Windows PowerShell:**
```powershell
# Gerar chave SSH automaticamente
.\scripts\generate-key.ps1

# Copiar a chave pública gerada para terraform.tfvars
```

**Linux/Mac:**
```bash
# Gerar chave SSH
ssh-keygen -t rsa -b 4096 -f desafio-devops-key -N ""

# Mostrar chave pública
cat desafio-devops-key.pub

# Copiar a chave para terraform.tfvars
```

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

# Conectar via SSH
ssh -i ~/.ssh/sua-chave.pem ubuntu@<IP_PUBLICO>

# Verificar instalação do Docker
docker --version
docker compose version
```

### 5. Executar a Aplicação

```bash
# Na instância EC2
cd /opt/app/desafio-devops
docker-compose up -d

# Verificar status
docker-compose ps
```

## 🔧 Configurações

### Variáveis Principais

| Variável        | Descrição         | Padrão               |
|-----------------|-------------------|----------------------|
| `aws_region`    | Região AWS        | `us-east-1`          |
| `environment`   | Ambiente          | `dev`                |
| `vpc_cidr`      | CIDR da VPC       | `10.0.0.0/16`        |
| `instance_type` | Tipo da EC2       | `t3.micro`           |
| `key_name`      | Nome da chave SSH | `desafio-devops-key` |

### Security Groups

O módulo cria um Security Group com as seguintes regras:

- **SSH (22)** - Acesso remoto
- **HTTP (80)** - Tráfego web
- **HTTPS (443)** - Tráfego web seguro
- **Porta 3000** - Aplicação Node.js

## 🐳 Docker e Docker Compose

O user-data instala automaticamente:

- **Docker 20.10** (versão estável)
- **Docker Compose 2.0** (plugin)
- **Ferramentas úteis** (git, vim, htop, etc.)

## 📊 Outputs

Após o deploy, você terá acesso a:

- `instance_public_ip` - IP público da instância
- `instance_public_dns` - DNS público da instância
- `vpc_id` - ID da VPC criada
- `web_sg_id` - ID do Security Group

## 🧹 Limpeza

```bash
# Destruir a infraestrutura
terraform destroy

# Confirmar a destruição
yes
```

## 🔒 Segurança

- **Volumes criptografados** (GP3 com encryption)
- **Security Groups** restritivos
- **User não-root** para Docker
- **Timezone** configurado para Brasil

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
   
   # Se não encontrar, usar AMI específica
   # Editar modules/ec2/main.tf e alterar o local.ami_id
   ```

2. **Erro de chave SSH**
   ```bash
   # Opção 1: Usar chave existente
   aws ec2 describe-key-pairs --key-names desafio-devops-key
   
   # Opção 2: Criar chave via AWS CLI
   aws ec2 create-key-pair --key-name desafio-devops-key --query 'KeyMaterial' --output text > desafio-devops-key.pem
   chmod 400 desafio-devops-key.pem
   
   # Opção 3: Gerar chave localmente e usar create_key_pair = true
   # Linux/Mac: ssh-keygen -t rsa -b 4096 -f desafio-devops-key -N ""
   ```

2. **Docker não inicia**
   ```bash
   # Verificar status do Docker
   sudo systemctl status docker
   
   # Reiniciar Docker
   sudo systemctl restart docker
   ```

3. **Porta 3000 não acessível**
   ```bash
   # Verificar Security Group
   aws ec2 describe-security-groups --group-ids <sg-id>
   
   # Verificar se a aplicação está rodando
   docker-compose ps
   ```

## 🚀 CI/CD Pipeline

Este projeto inclui um pipeline CI/CD completo que executa automaticamente quando há mudanças na pasta `terraform/`:

### Workflows Disponíveis

1. **Terraform CI/CD** (`.github/workflows/terraform-ci.yml`)
   - Executa apenas quando há mudanças em `terraform/**`
   - Valida, formata e faz plan do Terraform
   - Aplica mudanças automaticamente na branch `main`
   - Executa scan de segurança com Trivy

2. **Backend CI/CD** (`.github/workflows/backend-ci.yml`)
   - Executa apenas quando há mudanças em `backend/**`
   - Testa, build e faz deploy da aplicação

3. **Main Pipeline** (`.github/workflows/main-ci.yml`)
   - Coordena os workflows baseado nas mudanças detectadas
   - Detecta automaticamente quais partes do projeto foram alteradas

### Secrets Necessários

Configure os seguintes secrets no GitHub:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Docker Hub (para build da aplicação)
DOCKERHUB_USERNAME=your-username
DOCKERHUB_TOKEN=your-token
```

### Como Funciona

1. **Push/Pull Request** → Detecta mudanças
2. **Mudanças em `terraform/`** → Executa Terraform CI/CD
3. **Mudanças em `backend/`** → Executa Backend CI/CD
4. **Branch `main`** → Deploy automático
5. **Outras branches** → Apenas validação

## 📚 Documentação Adicional

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)
- [Docker Installation](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose Installation](https://docs.docker.com/compose/install/)
- [GitHub Actions](https://docs.github.com/en/actions) 