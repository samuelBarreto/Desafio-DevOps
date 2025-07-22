variable "vpc_cidr" {
  description = "CIDR da VPC"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "availability_zones" {
  description = "Zonas de disponibilidade"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas"
  type        = list(string)
}

variable "tags" {
  description = "Tags para os recursos"
  type        = map(string)
  default     = {}
} 