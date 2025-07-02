#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}🔧 Configurando projeto Desafio DevOps...${NC}"
echo

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 16+ primeiro.${NC}"
    echo -e "${BLUE}📥 Download: https://nodejs.org/${NC}"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Instale npm primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js e npm encontrados${NC}"
echo -e "${BLUE}   Node.js: $(node --version)${NC}"
echo -e "${BLUE}   npm: $(npm --version)${NC}"
echo

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
if ! npm install; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        echo -e "${BLUE}⚙️  Criando arquivo .env...${NC}"
        cp env.example .env
        echo -e "${GREEN}✅ Arquivo .env criado${NC}"
        echo -e "${YELLOW}⚠️  Configure as variáveis no arquivo .env${NC}"
    else
        echo -e "${RED}❌ Arquivo env.example não encontrado${NC}"
    fi
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# Gerar cliente Prisma
echo -e "${BLUE}🔧 Gerando cliente Prisma...${NC}"
if ! npm run db:generate; then
    echo -e "${RED}❌ Erro ao gerar cliente Prisma${NC}"
    exit 1
fi

echo
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo
echo -e "${BLUE}🚀 Para iniciar o servidor:${NC}"
echo -e "${BLUE}   npm run dev    # Modo desenvolvimento${NC}"
echo -e "${BLUE}   npm start      # Modo produção${NC}"
echo
echo -e "${BLUE}📚 Comandos úteis:${NC}"
echo -e "${BLUE}   npm run db:studio    # Interface visual do banco${NC}"
echo -e "${BLUE}   npm run db:seed      # Popular banco com dados${NC}"
echo -e "${BLUE}   npm test             # Executar testes${NC}"
echo -e "${BLUE}   npm run code:fix     # Corrigir problemas de código${NC}"
echo 