# 🖼️ AMIs Ubuntu por Região AWS

## Ubuntu 22.04 LTS (Jammy Jellyfish)

| Região | AMI ID | Nome |
|--------|--------|------|
| us-east-1 | ami-0c02fb55956c7d316 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| us-east-2 | ami-0b0af3577fe5e3532 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| us-west-1 | ami-0c4a54b78c1e487a0 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| us-west-2 | ami-0d70546e43a8d2e92 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| eu-west-1 | ami-0d75513e7706cf5d9 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| eu-central-1 | ami-0d527b44c6556414a | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |
| sa-east-1 | ami-0b0d9b1f2b1c1c1c1 | ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20231207 |

## Ubuntu 20.04 LTS (Focal Fossa)

| Região | AMI ID | Nome |
|--------|--------|------|
| us-east-1 | ami-0b0af3577fe5e3532 | ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20231207 |
| us-east-2 | ami-0c4a54b78c1e487a0 | ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20231207 |

## Como Usar

Se o data source falhar, você pode usar uma AMI específica:

```hcl
# Em modules/ec2/main.tf
locals {
  ami_id = try(data.aws_ami.ubuntu.id, "ami-0c02fb55956c7d316") # Ubuntu 22.04 us-east-1
}
```

## Verificar AMIs Atualizadas

```bash
# Listar AMIs Ubuntu 22.04
aws ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
  --query 'Images[*].[ImageId,Name,CreationDate]' \
  --output table \
  --region us-east-1
```

## Notas

- As AMIs são atualizadas regularmente pela Canonical
- Sempre use a AMI mais recente quando possível
- O data source `aws_ami` com `most_recent = true` deve funcionar na maioria dos casos
- Em caso de erro, use uma AMI específica como fallback 