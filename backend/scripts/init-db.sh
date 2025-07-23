#!/bin/bash
set -e

echo "🚀 Iniciando configuração do banco de dados..."

# Aguardar o PostgreSQL estar pronto
until pg_isready -U postgres -d desafio; do
  echo "⏳ Aguardando PostgreSQL estar pronto..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Criar a tabela users se não existir
echo "📋 Criando tabela users..."
psql -U postgres -d desafio <<-EOSQL
  CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    age INTEGER,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
  );

  -- Criar índice para melhor performance
  CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
  CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(active);
EOSQL

echo "✅ Tabela users criada com sucesso!"

# Inserir dados de exemplo
echo "🌱 Inserindo dados de exemplo..."
psql -U postgres -d desafio <<-EOSQL
  -- Inserir usuários de exemplo (apenas se a tabela estiver vazia)
  INSERT INTO public.users (id, email, name, password, age, active, "createdAt", "updatedAt")
  SELECT 
    'clh1234567890abcdef'::TEXT,
    'joao@example.com'::TEXT,
    'João Silva'::TEXT,
    'senha123'::TEXT,
    25::INTEGER,
    true::BOOLEAN,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'joao@example.com');

  INSERT INTO public.users (id, email, name, password, age, active, "createdAt", "updatedAt")
  SELECT 
    'clh1234567890abcdeg'::TEXT,
    'maria@example.com'::TEXT,
    'Maria Santos'::TEXT,
    'senha456'::TEXT,
    30::INTEGER,
    true::BOOLEAN,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'maria@example.com');

  INSERT INTO public.users (id, email, name, password, age, active, "createdAt", "updatedAt")
  SELECT 
    'clh1234567890abcdeh'::TEXT,
    'pedro@example.com'::TEXT,
    'Pedro Oliveira'::TEXT,
    'senha789'::TEXT,
    28::INTEGER,
    false::BOOLEAN,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pedro@example.com');

  INSERT INTO public.users (id, email, name, password, age, active, "createdAt", "updatedAt")
  SELECT 
    'clh1234567890abcdei'::TEXT,
    'ana@example.com'::TEXT,
    'Ana Costa'::TEXT,
    'senha101'::TEXT,
    22::INTEGER,
    true::BOOLEAN,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'ana@example.com');

  INSERT INTO public.users (id, email, name, password, age, active, "createdAt", "updatedAt")
  SELECT 
    'clh1234567890abcdej'::TEXT,
    'carlos@example.com'::TEXT,
    'Carlos Ferreira'::TEXT,
    'senha202'::TEXT,
    35::INTEGER,
    true::BOOLEAN,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'carlos@example.com');
EOSQL

echo "✅ Dados de exemplo inseridos com sucesso!"

# Verificar os dados inseridos
echo "📊 Verificando dados inseridos..."
psql -U postgres -d desafio -c "SELECT id, email, name, age, active, \"createdAt\" FROM public.users ORDER BY \"createdAt\";"

echo "🎉 Configuração do banco de dados concluída com sucesso!" 