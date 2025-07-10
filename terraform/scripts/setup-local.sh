#!/bin/bash

# Script para configurar o ambiente local de desenvolvimento
# Este script facilita o setup local sem comprometer a segurança

set -e

echo "🔧 Configurando ambiente local de desenvolvimento..."
echo "=================================================="

# Verifica se o terraform.tfvars existe
if [ ! -f "terraform.tfvars" ]; then
    echo "❌ arquivo terraform.tfvars não encontrado!"
    echo "📝 Copiando arquivo de exemplo..."
    cp terraform.tfvars.example terraform.tfvars
    echo "✅ arquivo terraform.tfvars criado"
fi

# Verifica se a chave SSH já está configurada
if grep -q "public_key.*ssh-rsa" terraform.tfvars; then
    echo "🔑 Chave SSH já configurada no terraform.tfvars"
    echo "ℹ️ Para usar uma nova chave, edite o arquivo terraform.tfvars"
else
    echo "🔑 Nenhuma chave SSH encontrada"
    echo ""
    echo "📋 Opções para configurar a chave SSH:"
    echo "1. Gerar nova chave automaticamente"
    echo "2. Usar chave existente"
    echo "3. Configurar manualmente"
    echo ""
    read -p "Escolha uma opção (1-3): " choice
    
    case $choice in
        1)
            echo "🔑 Gerando nova chave SSH..."
            chmod +x scripts/generate-ssh-key.sh
            ./scripts/generate-ssh-key.sh
            
            # Extrai a chave pública
            PUBLIC_KEY=$(cat keys/desafio-devops-key.pub)
            
            # Adiciona ao terraform.tfvars
            echo "" >> terraform.tfvars
            echo "# Chave SSH gerada automaticamente" >> terraform.tfvars
            echo "public_key = \"$PUBLIC_KEY\"" >> terraform.tfvars
            
            echo "✅ Chave SSH gerada e configurada automaticamente"
            echo "🔑 Chave privada salva em: keys/desafio-devops-key"
            ;;
        2)
            echo "🔑 Usando chave SSH existente..."
            read -p "Digite o caminho para sua chave pública (.pub): " key_path
            
            if [ -f "$key_path" ]; then
                PUBLIC_KEY=$(cat "$key_path")
                echo "" >> terraform.tfvars
                echo "# Chave SSH existente" >> terraform.tfvars
                echo "public_key = \"$PUBLIC_KEY\"" >> terraform.tfvars
                echo "✅ Chave SSH configurada"
            else
                echo "❌ Arquivo não encontrado: $key_path"
                exit 1
            fi
            ;;
        3)
            echo "📝 Configure manualmente a chave SSH no arquivo terraform.tfvars"
            echo "ℹ️ Descomente a linha 'public_key = ...' e adicione sua chave"
            ;;
        *)
            echo "❌ Opção inválida"
            exit 1
            ;;
    esac
fi

echo ""
echo "🚀 Ambiente local configurado!"
echo "=============================="
echo "📁 Arquivo de configuração: terraform.tfvars"
echo "🔑 Chave SSH: Configurada"
echo ""
echo "📋 Próximos passos:"
echo "1. terraform init"
echo "2. terraform plan"
echo "3. terraform apply"
echo ""
echo "🔒 Para produção, use o pipeline CI/CD que gera chaves automaticamente" 