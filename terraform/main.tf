terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  # profile = var.profile
}

# Módulo VPC
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr            = var.vpc_cidr
  environment         = var.environment
  availability_zones  = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
  tags = {
    Environment = var.environment
    Project     = "desafio-devops"
    Owner       = "devops-team"
    CostCenter  = var.environment == "prod" ? "production" : "development"
  }
}

# Módulo Security Groups
module "security_groups" {
  source = "./modules/security_groups"

  vpc_id      = module.vpc.vpc_id
  environment = var.environment
  tags = {
    Environment = var.environment
    Project     = "desafio-devops"
    Owner       = "devops-team"
    CostCenter  = var.environment == "prod" ? "production" : "development"
  }
}

# Módulo EC2
module "ec2" {
  source = "./modules/ec2"

  environment        = var.environment
  instance_type      = var.instance_type
  key_name           = var.key_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_id   = module.vpc.public_subnet_ids[0]
  security_group_ids = [module.security_groups.web_sg_id]
  user_data_template = file("${path.module}/templates/user_data.sh")
  create_key_pair    = var.create_key_pair
  public_key         = var.public_key
  allocate_eip       = var.allocate_eip
  root_volume_size   = var.root_volume_size
  root_volume_type   = var.root_volume_type
  tags = {
    Environment = var.environment
    Project     = "desafio-devops"
    Owner       = "devops-team"
    CostCenter  = var.environment == "prod" ? "production" : "development"
    Backup      = var.environment == "prod" ? "true" : null
    Monitoring  = var.environment == "prod" ? "true" : null
  }
} 