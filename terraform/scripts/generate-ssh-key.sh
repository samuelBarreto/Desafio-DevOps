#!/bin/bash

# Script para gerar chave SSH para o pipeline
# Este script pode ser usado como alternativa à chave hardcoded

set -e

# Diretório para salvar as chaves
KEY_DIR="./keys"
KEY_NAME="desafio-devops-key"

# Criar diretório se não existir
mkdir -p "$KEY_DIR"

# Gerar par de chaves SSH
echo "Gerando par de chaves SSH..."
ssh-keygen -t rsa -b 4096 -f "$KEY_DIR/$KEY_NAME" -N "" -C "pipeline-generated-key"

# Exibir a chave pública para uso no Terraform
echo "=== CHAVE PÚBLICA PARA TERRAFORM ==="
cat "$KEY_DIR/$KEY_NAME.pub"
echo "===================================="

# Salvar a chave pública em uma variável de ambiente para o pipeline
echo "::set-output name=public_key::$(cat $KEY_DIR/$KEY_NAME.pub)"

echo "Chaves SSH geradas com sucesso!"
echo "Chave privada: $KEY_DIR/$KEY_NAME"
echo "Chave pública: $KEY_DIR/$KEY_NAME.pub" 