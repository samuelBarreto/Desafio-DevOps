# 🔒 Security

Este projeto inclui múltiplas camadas de segurança para garantir a qualidade e segurança do código.

## 🛡️ Security Scans

### SAST (Static Application Security Testing)
- **Ferramenta**: Trivy
- **O que analisa**: Imagem Docker, dependências, vulnerabilidades conhecidas
- **Quando**: Durante o CI/CD pipeline
- **Resultado**: Relatório em formato texto e artifacts

### DAST (Dynamic Application Security Testing)
- **Ferramenta**: Script personalizado (axios + Node.js)
- **O que analisa**: Aplicação rodando, endpoints HTTP, headers de segurança
- **Quando**: Após build, aplicação em execução
- **Resultado**: Relatório detalhado no console e logs

## 📊 Como verificar resultados

### 1. **No GitHub Actions**
- Vá para a aba "Actions" do repositório
- Clique no workflow executado
- Baixe os artifacts de segurança

### 2. **Localmente**
```bash
# Build da imagem de teste
cd backend
npm run docker:build-test

# Scan com Trivy (se instalado)
trivy image desafio-devops-api:test

# DAST scan local
TARGET_URL=http://localhost:3000 node scripts/dast-scan.js
```

## 🚨 Vulnerabilidades Críticas

O pipeline está configurado para falhar se encontrar vulnerabilidades **CRÍTICAS** ou **ALTAS**:

- **CRITICAL**: Falha imediata do pipeline
- **HIGH**: Falha imediata do pipeline
- **MEDIUM**: Aviso, mas não falha
- **LOW**: Apenas informativo

## 📋 Checklist de Segurança

- [x] ✅ SAST scan configurado (Trivy)
- [x] ✅ DAST scan configurado (OWASP ZAP)
- [x] ✅ Dependências atualizadas
- [x] ✅ Imagem Docker otimizada
- [x] ✅ Usuário não-root no container
- [x] ✅ Health checks configurados
- [x] ✅ Variáveis de ambiente seguras
- [x] ✅ Logs sem dados sensíveis

## 🔍 Relatórios de Segurança

Os relatórios de segurança estão disponíveis como:

1. **Artifacts** no GitHub Actions
2. **Logs** detalhados no pipeline
3. **Comentários** em Pull Requests

## 📞 Reportar Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública
2. Envie um email para: [samukacfc1@gmail.com]
3. Use o formato: `[SECURITY] Descrição da vulnerabilidade`

---

**Segurança é prioridade! 🔒** 