# Configurações específicas para o ambiente DEV
environment = "dev"

# Configurações da AWS
aws_region = "us-east-1"

# Configurações de rede
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
availability_zones = ["us-east-1a", "us-east-1b"]

# Configurações da instância
instance_type = "t3.micro"
root_volume_size = 20
root_volume_type = "gp3"

# Configurações da chave SSH
key_name = "desafio-devops-key-dev"
public_key = ""  # Será definida via variável de ambiente no pipeline

# Configurações opcionais
create_key_pair = true
allocate_eip    = true 