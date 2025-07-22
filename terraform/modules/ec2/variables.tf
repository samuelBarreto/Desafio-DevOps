variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Nome da chave SSH"
  type        = string
}

variable "vpc_id" {
  description = "ID da VPC"
  type        = string
}

variable "public_subnet_id" {
  description = "ID da subnet pública"
  type        = string
}

variable "security_group_ids" {
  description = "IDs dos Security Groups"
  type        = list(string)
}

variable "user_data_template" {
  description = "Template do user-data"
  type        = string
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

variable "create_key_pair" {
  description = "Criar key pair se não existir"
  type        = bool
  default     = false
}

variable "public_key" {
  description = "Chave pública SSH"
  type        = string
  default     = ""
}

variable "allocate_eip" {
  description = "Alocar Elastic IP para a instância"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags para os recursos"
  type        = map(string)
  default     = {}
} 