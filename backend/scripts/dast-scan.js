const axios = require('axios');

// Configuração do DAST scan
const config = {
  baseURL: process.env.TARGET_URL || 'http://localhost:3000',
  timeout: 10000,
  endpoints: [
    '/',
    '/health',
    '/api/users',
    '/api/users/nonexistent',
    '/invalid-endpoint'
  ],
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
      name: 'Users List',
      endpoint: '/api/users',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Invalid Endpoint (404)',
      endpoint: '/invalid-endpoint',
      method: 'GET',
      expectedStatus: 404
    }
  ]
};

async function runDASTScan() {
  console.log('🛡️ Starting DAST Security Scan...');
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

      // Verificar headers de segurança
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      };

      console.log('   🔒 Security Headers Check:');
      for (const [header, expectedValue] of Object.entries(securityHeaders)) {
        const actualValue = response.headers[header.toLowerCase()];
        if (actualValue) {
          console.log(`      ✅ ${header}: ${actualValue}`);
        } else {
          console.log(`      ⚠️ ${header}: Missing`);
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
  console.log('\n📊 DAST Scan Results:');
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

  // Determinar se o scan foi bem-sucedido
  const successRate = (results.passed / results.total) * 100;
  if (successRate >= 80) {
    console.log('\n✅ DAST Scan PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ DAST Scan FAILED');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runDASTScan();
}

module.exports = { runDASTScan }; 