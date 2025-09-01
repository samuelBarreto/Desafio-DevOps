output "vpc_id" {
  description = "ID da VPC criada"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas"
  value       = module.vpc.public_subnet_ids
}

output "web_sg_id" {
  description = "ID do Security Group web"
  value       = module.security_groups.web_sg_id
}

output "instance_id" {
  description = "ID da instância EC2"
  value       = module.ec2.instance_id
}

output "instance_public_ip" {
  description = "IP público da instância EC2"
  value       = module.ec2.instance_public_ip
}

output "instance_public_dns" {
  description = "DNS público da instância EC2"
  value       = module.ec2.instance_public_dns
}

output "elastic_ip" {
  description = "Elastic IP da instância (IP fixo)"
  value       = module.ec2.elastic_ip
}

output "key_name" {
  description = "Nome da chave SSH"
  value       = var.key_name
} 