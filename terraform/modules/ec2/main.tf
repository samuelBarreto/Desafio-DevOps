# Data source para AMI Ubuntu 22.04 LTS
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# Fallback para AMI específica se o data source falhar
locals {
  ami_id = try(data.aws_ami.ubuntu.id, "ami-0c02fb55956c7d316") # Ubuntu 22.04 LTS us-east-1
}

# Key Pair (opcional - se não existir)
resource "aws_key_pair" "main" {
  count      = var.create_key_pair ? 1 : 0
  key_name   = var.key_name
  public_key = var.public_key
}

# Instância EC2
resource "aws_instance" "main" {
  ami                    = local.ami_id
  instance_type          = var.instance_type
  key_name               = var.create_key_pair ? aws_key_pair.main[0].key_name : var.key_name
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.public_subnet_id

  user_data = var.user_data_template

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true

    tags = {
      Name        = "${var.environment}-root-volume"
      Environment = var.environment
    }
  }

  tags = {
    Name        = "${var.environment}-ec2-instance"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
} 