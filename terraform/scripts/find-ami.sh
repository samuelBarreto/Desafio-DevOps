#!/bin/bash

echo "🔍 Procurando AMIs Ubuntu disponíveis..."

# Listar AMIs Ubuntu 22.04
echo "📋 AMIs Ubuntu 22.04 (Jammy):"
aws ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
  --query 'Images[*].[ImageId,Name,CreationDate,State]' \
  --output table \
  --region us-east-1

echo ""
echo "📋 AMIs Ubuntu 20.04 (Focal):"
aws ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*" \
  --query 'Images[*].[ImageId,Name,CreationDate,State]' \
  --output table \
  --region us-east-1

echo ""
echo "📋 AMIs Ubuntu 18.04 (Bionic):"
aws ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*" \
  --query 'Images[*].[ImageId,Name,CreationDate,State]' \
  --output table \
  --region us-east-1 