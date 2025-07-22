# Configurações específicas por ambiente
locals {
  # Configurações para DEV
  dev_config = {
    instance_type     = "t3.micro"
    root_volume_size  = 20
    root_volume_type  = "gp3"
    vpc_cidr          = "10.0.0.0/16"
    public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
    availability_zones = ["us-east-1a", "us-east-1b"]
    key_name          = "desafio-devops-key-dev"
    create_key_pair   = true
    allocate_eip      = true
    environment       = "dev"
    tags = {
      Environment = "dev"
      Project     = "desafio-devops"
      Owner       = "devops-team"
      CostCenter  = "development"
    }
  }

  # Configurações para PROD
  prod_config = {
    instance_type     = "t3.small"
    root_volume_size  = 50
    root_volume_type  = "gp3"
    vpc_cidr          = "10.1.0.0/16"
    public_subnet_cidrs = ["10.1.1.0/24", "10.1.2.0/24"]
    availability_zones = ["us-east-1a", "us-east-1b"]
    key_name          = "desafio-devops-key-prod"
    create_key_pair   = true
    allocate_eip      = true
    environment       = "prod"
    tags = {
      Environment = "prod"
      Project     = "desafio-devops"
      Owner       = "devops-team"
      CostCenter  = "production"
      Backup      = "true"
      Monitoring  = "true"
    }
  }

  # Selecionar configuração baseada no ambiente
  config = var.environment == "prod" ? local.prod_config : local.dev_config
} 