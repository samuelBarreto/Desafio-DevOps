#!/bin/bash

# Script para configurar o backend S3 do Terraform
# Execute este script uma vez para configurar o backend

set -e

echo "🏗️ Configurando backend S3 para Terraform..."

# Variáveis
BUCKET_NAME="desafio-devops-terraform-state"
REGION="us-east-1"
DYNAMODB_TABLE="terraform-state-lock"

# Verificar se AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não está configurado. Configure suas credenciais primeiro."
    exit 1
fi

echo "✅ AWS CLI configurado"

# Criar bucket S3
echo "📦 Criando bucket S3: $BUCKET_NAME"
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION || echo "Bucket já existe"

# Habilitar versionamento
echo "🔄 Habilitando versionamento no bucket"
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

# Habilitar criptografia
echo "🔒 Configurando criptografia no bucket"
aws s3api put-bucket-encryption \
    --bucket $BUCKET_NAME \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# Criar tabela DynamoDB para state locking
echo "🔐 Criando tabela DynamoDB para state locking"
aws dynamodb create-table \
    --table-name $DYNAMODB_TABLE \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region $REGION || echo "Tabela já existe"

# Aguardar tabela ficar ativa
echo "⏳ Aguardando tabela DynamoDB ficar ativa..."
aws dynamodb wait table-exists --table-name $DYNAMODB_TABLE --region $REGION

# Configurar backend no Terraform
echo "⚙️ Configurando backend no Terraform..."
cat > backend.tf << EOF
terraform {
  backend "s3" {
    bucket         = "$BUCKET_NAME"
    key            = "terraform.tfstate"
    region         = "$REGION"
    encrypt        = true
    dynamodb_table = "$DYNAMODB_TABLE"
  }
}
EOF

echo "✅ Backend S3 configurado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute: terraform init"
echo "2. Execute: terraform plan"
echo "3. Execute: terraform apply"
echo ""
echo "🔗 Recursos criados:"
echo "- S3 Bucket: $BUCKET_NAME"
echo "- DynamoDB Table: $DYNAMODB_TABLE" 