output "instance_id" {
  description = "ID da instância EC2"
  value       = aws_instance.main.id
}

output "instance_public_ip" {
  description = "IP público da instância EC2"
  value       = aws_instance.main.public_ip
}

output "instance_public_dns" {
  description = "DNS público da instância EC2"
  value       = aws_instance.main.public_dns
}

output "instance_private_ip" {
  description = "IP privado da instância EC2"
  value       = aws_instance.main.private_ip
}

output "instance_ami" {
  description = "AMI da instância EC2"
  value       = aws_instance.main.ami
}

output "key_pair_id" {
  description = "ID da key pair (se criada)"
  value       = var.create_key_pair ? aws_key_pair.main[0].id : null
}

output "elastic_ip" {
  description = "Elastic IP da instância (se alocado)"
  value       = var.allocate_eip ? aws_eip.main[0].public_ip : null
}

output "elastic_ip_id" {
  description = "ID do Elastic IP (se alocado)"
  value       = var.allocate_eip ? aws_eip.main[0].id : null
} 