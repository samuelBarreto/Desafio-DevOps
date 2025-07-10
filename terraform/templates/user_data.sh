#!/bin/bash

# Atualizar o sistema
echo "🔄 Atualizando o sistema..."
apt-get update
apt-get upgrade -y

# Instalar dependências
echo "📦 Instalando dependências..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    unzip

# Adicionar repositório oficial do Docker
echo "🐳 Adicionando repositório do Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar e instalar Docker
echo "📥 Instalando Docker..."
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar Docker
echo "🚀 Iniciando Docker..."
systemctl start docker
systemctl enable docker

# Adicionar usuário ubuntu ao grupo docker
echo "👤 Configurando permissões do Docker..."
usermod -aG docker ubuntu

# Instalar Docker Compose 2.0
echo "📦 Instalando Docker Compose 2.0..."
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

# Verificar instalações
echo "✅ Verificando instalações..."
docker --version
docker compose version

# Instalar ferramentas úteis
echo "🛠️ Instalando ferramentas úteis..."
apt-get install -y \
    htop \
    tree \
    git \
    vim \
    npm\
    wget \
    jq

# Configurar timezone
echo "🕐 Configurando timezone..."
timedatectl set-timezone America/Sao_Paulo

# Criar diretório para aplicação
echo "📁 Criando diretório da aplicação..."
mkdir -p /opt/app
cd /opt/app

# Baixar o projeto (opcional - você pode fazer isso manualmente)
echo "📥 Baixando projeto..."
git clone https://github.com/samuelBarreto/Desafio-DevOps.git /opt/app/desafio-devops

# Configurar permissões
chown -R ubuntu:ubuntu /opt/app

# Criar arquivo de log
echo "📝 Criando log de instalação..."
echo "Instalação concluída em $(date)" > /var/log/user-data.log

# Mostrar informações do sistema
echo "📊 Informações do sistema:"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker compose version)"
echo "IP Público: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "IP Privado: $(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)"

echo "🎉 Instalação concluída com sucesso!"
echo "🚀 Para acessar a aplicação, execute:"
echo "   cd /opt/app/desafio-devops"
echo "   docker-compose up -d" 