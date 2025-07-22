#!/bin/bash

# Script para build da imagem de teste para security scan

echo "🔨 Build da imagem de teste para security scan..."

# Build da imagem
docker build -t desafio-devops-api:test .

echo "✅ Imagem de teste construída: desafio-devops-api:test"

# Opcional: Rodar Trivy localmente
if command -v trivy &> /dev/null; then
    echo "🔒 Executando Trivy scan local..."
    trivy image desafio-devops-api:test
else
    echo "⚠️ Trivy não encontrado. Instale para scan local:"
    echo "   https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
fi

echo "🎯 Build concluído!" 