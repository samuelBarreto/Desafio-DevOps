#!/bin/bash

echo "🧪 Testando modificação do backend..."

# Backup do arquivo original
cp backend.tf backend.tf.backup.test

# Simular a modificação que o workflow fará
ENVIRONMENT="prod"
sed -i "s|key     = \"terraform/environments/[^\"]*\"|key     = \"terraform/environments/$ENVIRONMENT/terraform.tfstate\"|g" backend.tf

echo "📋 Conteúdo do backend.tf após modificação:"
cat backend.tf

# Restaurar o arquivo original
mv backend.tf.backup.test backend.tf

echo "✅ Teste concluído - arquivo restaurado" 