output "web_sg_id" {
  description = "ID do Security Group web"
  value       = aws_security_group.web.id
}

output "web_sg_name" {
  description = "Nome do Security Group web"
  value       = aws_security_group.web.name
} 