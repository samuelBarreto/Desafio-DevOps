# Configurações específicas para o ambiente PROD
environment = "prod"

# Configurações da AWS
aws_region = "us-east-1"

# Configurações de rede
vpc_cidr = "10.1.0.0/16"
public_subnet_cidrs = ["10.1.1.0/24", "10.1.2.0/24"]
availability_zones = ["us-east-1a", "us-east-1b"]

# Configurações da instância
instance_type = "t3.small"
root_volume_size = 50
root_volume_type = "gp3"

# Configurações da chave SSH
key_name = "desafio-devops-key"
public_key = ""  # Será definida via variável de ambiente no pipeline
create_key_pair = false  # Desabilitado quando não há chave pública

# Configurações opcionais
allocate_eip    = true 