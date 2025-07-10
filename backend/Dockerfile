# Usar Node.js 18 Alpine como base
FROM node:18-alpine

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci 

# Copiar código da aplicação (excluindo arquivos do .dockerignore)
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação
CMD ["npm", "start"] 