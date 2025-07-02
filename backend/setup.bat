@echo off
echo 🔧 Configurando projeto Desafio DevOps...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 16+ primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Instale npm primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js e npm encontrados
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

REM Criar arquivo .env se não existir
if not exist .env (
    if exist env.example (
        echo ⚙️  Criando arquivo .env...
        copy env.example .env >nul
        echo ✅ Arquivo .env criado
        echo ⚠️  Configure as variáveis no arquivo .env
    ) else (
        echo ❌ Arquivo env.example não encontrado
    )
) else (
    echo ✅ Arquivo .env já existe
)

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma...
call npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar cliente Prisma
    pause
    exit /b 1
)

echo.
echo 🎉 Configuração concluída!
echo.
echo 🚀 Para iniciar o servidor:
echo    npm run dev    # Modo desenvolvimento
echo    npm start      # Modo produção
echo.
echo 📚 Comandos úteis:
echo    npm run db:studio    # Interface visual do banco
echo    npm run db:seed      # Popular banco com dados
echo    npm test             # Executar testes
echo    npm run code:fix     # Corrigir problemas de código
echo.
pause 