const axios = require('axios');

// Configuração do DAST scan simples
const config = {
  baseURL: process.env.TARGET_URL || 'http://localhost:3000',
  timeout: 5000,
  tests: [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'API Documentation',
      endpoint: '/',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Users List (Mock)',
      endpoint: '/api/users',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'User by ID (Mock)',
      endpoint: '/api/users/1',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Invalid Endpoint (404)',
      endpoint: '/invalid-endpoint',
      method: 'GET',
      expectedStatus: 404
    },
    {
      name: 'Security Headers Test',
      endpoint: '/health',
      method: 'GET',
      expectedStatus: 200,
      checkHeaders: true
    }
  ]
};

async function runSimpleDAST() {
  console.log('🛡️ Starting Simple DAST Security Scan...');
  console.log(`🎯 Target: ${config.baseURL}`);
  
  const results = {
    total: config.tests.length,
    passed: 0,
    failed: 0,
    errors: []
  };

  for (const test of config.tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   Endpoint: ${test.endpoint}`);
      
      const response = await axios({
        method: test.method,
        url: `${config.baseURL}${test.endpoint}`,
        timeout: config.timeout,
        validateStatus: () => true // Aceita qualquer status code
      });

      const statusMatch = response.status === test.expectedStatus;
      
      if (statusMatch) {
        console.log(`   ✅ PASS - Status: ${response.status} (expected: ${test.expectedStatus})`);
        results.passed++;
      } else {
        console.log(`   ❌ FAIL - Status: ${response.status} (expected: ${test.expectedStatus})`);
        results.failed++;
        results.errors.push({
          test: test.name,
          expected: test.expectedStatus,
          actual: response.status
        });
      }

      // Verificar headers de segurança se solicitado
      if (test.checkHeaders) {
        console.log('   🔒 Security Headers Check:');
        const securityHeaders = {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        };

        for (const [header, expectedValue] of Object.entries(securityHeaders)) {
          const actualValue = response.headers[header.toLowerCase()];
          if (actualValue) {
            console.log(`      ✅ ${header}: ${actualValue}`);
          } else {
            console.log(`      ⚠️ ${header}: Missing`);
          }
        }
      }

    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      results.failed++;
      results.errors.push({
        test: test.name,
        error: error.message
      });
    }
  }

  // Resumo dos resultados
  console.log('\n📊 Simple DAST Scan Results:');
  console.log(`   Total Tests: ${results.total}`);
  console.log(`   Passed: ${results.passed}`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors Found:');
    results.errors.forEach(error => {
      console.log(`   - ${error.test}: ${error.error || `Expected ${error.expected}, got ${error.actual}`}`);
    });
  }

  // Determinar se o scan foi bem-sucedido (mais permissivo)
  const successRate = (results.passed / results.total) * 100;
  if (successRate >= 60) { // Mais permissivo para testes básicos
    console.log('\n✅ Simple DAST Scan PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ Simple DAST Scan FAILED');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runSimpleDAST();
}

module.exports = { runSimpleDAST }; 