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

  vpc_cidr            = local.config.vpc_cidr
  environment         = local.config.environment
  availability_zones  = local.config.availability_zones
  public_subnet_cidrs = local.config.public_subnet_cidrs
  tags                = local.config.tags
}

# Módulo Security Groups
module "security_groups" {
  source = "./modules/security_groups"

  vpc_id      = module.vpc.vpc_id
  environment = local.config.environment
  tags        = local.config.tags
}

# Módulo EC2
module "ec2" {
  source = "./modules/ec2"

  environment        = local.config.environment
  instance_type      = local.config.instance_type
  key_name           = local.config.key_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_id   = module.vpc.public_subnet_ids[0]
  security_group_ids = [module.security_groups.web_sg_id]
  user_data_template = file("${path.module}/templates/user_data.sh")
  create_key_pair    = local.config.create_key_pair
  public_key         = var.public_key
  allocate_eip       = local.config.allocate_eip
  root_volume_size   = local.config.root_volume_size
  root_volume_type   = local.config.root_volume_type
  tags               = local.config.tags
} 