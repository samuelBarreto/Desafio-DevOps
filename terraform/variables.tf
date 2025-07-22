variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

# variable "profile" {
#   description = "AWS profile"
#   type        = string
# }

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR da VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Zonas de disponibilidade"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Nome da chave SSH"
  type        = string
  default     = "desafio-devops-key"
}

variable "create_key_pair" {
  description = "Criar key pair automaticamente"
  type        = bool
  default     = false
}

variable "public_key" {
  description = "Chave pública SSH para criar key pair"
  type        = string
  default     = ""
}

variable "allocate_eip" {
  description = "Alocar Elastic IP para a instância"
  type        = bool
  default     = true
}

variable "root_volume_size" {
  description = "Tamanho do volume root em GB"
  type        = number
  default     = 20
}

variable "root_volume_type" {
  description = "Tipo do volume root"
  type        = string
  default     = "gp3"
} 